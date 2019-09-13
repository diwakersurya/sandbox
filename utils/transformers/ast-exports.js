import { transform, transformFromAst } from '@babel/standalone';

const babelConfig = { sourceType: 'module', plugins: ['syntax-jsx'] };
const DEFAULT_VARIABLE_NAME = '___default';

function getExpressionFromDefaultDeclaration(node, expressionVariable) {
    const expression = {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', name: expressionVariable },
        right: node.declaration
    };

    return { type: 'ExpressionStatement', ...expression };
}

function exportToReturnString(_exports) {
    return Object.entries(_exports).reduce(
        (returnString, [key, value]) =>
            key === value
                ? `${returnString}${key}, `
                : `${returnString}${value}: ${key}, `,
        ''
    );
}

export default function(meta, content, rawContent) {
    let _exports = {};
    const { ast } = transform(content, { ...babelConfig, ast: true });
    const transformedBody = [];

    ast.program.body.forEach(node => {
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration) {
                if (node.declaration.type === 'FunctionDeclaration') {
                    _exports = [node.declaration].reduce(
                        (allExports, { id: { name } }) => ({
                            ...allExports,
                            [name]: name
                        }),
                        _exports
                    );
                } else {
                    _exports = node.declaration.declarations.reduce(
                        (allExports, { id: { name } }) => ({
                            ...allExports,
                            [name]: name
                        }),
                        _exports
                    );
                }

                transformedBody.push(node.declaration);
            } else {
                node.specifiers.forEach(({ local, exported }) => {
                    _exports[local.name] = exported.name;
                });
            }
        } else if (node.type === 'ExportDefaultDeclaration') {
            transformedBody.push(
                getExpressionFromDefaultDeclaration(node, DEFAULT_VARIABLE_NAME)
            );
        } else transformedBody.push(node);
    });

    ast.program.body = transformedBody;
    const { code } = transformFromAst(ast, content, babelConfig);
    meta.exports = [...Object.keys(_exports), 'default'];

    return `
  let ${DEFAULT_VARIABLE_NAME} = undefined;

  ${code}

  return {
    default:${DEFAULT_VARIABLE_NAME},
    ${exportToReturnString(_exports)}
  }
`;
}
