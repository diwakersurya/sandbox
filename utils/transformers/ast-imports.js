import { transform, transformFromAst } from '@babel/standalone';

const babelConfig = { sourceType: 'module', plugins: ['syntax-jsx'] };

export default function(meta, content, rawContent) {
    const imports = [];
    const { ast } = transform(content, { ...babelConfig, ast: true });
    const transformedBody = [];

    ast.program.body.forEach(node => {
        if (node.type === 'ImportDeclaration') {
            const newImport = {};
            newImport.variables = node.specifiers.map(
                ({ type, imported, local }) => {
                    switch (type) {
                        case 'ImportNamespaceSpecifier':
                            return { local: local.name, name: '*' };
                        case 'ImportDefaultSpecifier':
                            return { local: local.name, name: 'default' };
                        case 'ImportSpecifier':
                        default:
                            return { local: local.name, name: imported.name };
                    }
                }
            );
            newImport.external = !node.source.value.startsWith('./');
            newImport.source = node.source.value;
            imports.push(newImport);
        } else transformedBody.push(node);
    });
    ast.program.body = transformedBody;
    const { code } = transformFromAst(ast, content, babelConfig);
    meta.imports = imports;
    return code;
}
