import { transform } from 'buble';
import { jsTransformers } from './utils/transformers/index';
import { Cache } from './utils/cache';
const externalCache = new Cache();

window.addEventListener('message', receiveMessage, false);
//over ride console.log
const _consoleLog = window.console.log;
window.console.log = function() {
    log('log', arguments[0]);
    _consoleLog(...arguments);
};

//utility functions to execute the code
export function define(deps, string) {
    var F = new Function(string);
    F();
}
function cleanupDOM() {
    document.querySelector('#app').innerHTML = '';
}
//===================================================

async function compileCode(payload) {
    return transform(payload).code;
}

const jspmResolverBody = `return import("https://unsafe-production.jspm.io/"+_module.source).then(m => {
  return {
    path: _module.source,
    exports: {default:m.default,...m.default}
  };
});`;
// eslint-disable-next-line no-new-func
const jspmResolver = new Function('_module', jspmResolverBody);
async function defaultResolver(importDeclaration) {
    return jspmResolver(importDeclaration);
}
async function createModuleDefinition({
    file,
    imports,
    content,
    globals,
    cache
}) {
    //const cwd = cwd(file.path);
    const importVariableNames = imports.reduce(function(
        result,
        importDeclaration
    ) {
        importDeclaration.variables.forEach(v => result.push(v.local));
        return result;
    },
    []);
    const _code = await compileCode(content);
    const globalVariables = Object.keys(globals);
    const globalVariablesValue = Object.values(globals);
    const importVariablesValue = imports.reduce(function(
        result,
        importDeclaration
    ) {
        const _cache = importDeclaration.external ? externalCache : cache;
        const _depModule = _cache.get(importDeclaration.source);
        if (!_depModule) {
            throw Error(
                `can't find ${importDeclaration.source} in ${file.path}`
            );
        }
        importDeclaration.variables.forEach(v =>
            result.push(
                v.name === '*' ? _depModule.exports : _depModule.exports[v.name]
            )
        );
        return result;
    },
    []);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...importVariableNames, ...globalVariables, _code);

    return fn(...importVariablesValue, ...globalVariablesValue);
}

export function filterFile(name) {
    return function(file) {
        return file.path === name;
    };
}
async function initializeDependencies({
    imports,
    resolver,
    parent,
    files,
    globals,
    cache
}) {
    for (const importDeclaration of imports) {
        //if (importDeclaration.external) {
        let _module = undefined;

        try {
            _module = await resolver(importDeclaration);
            _module =
                !_module && importDeclaration.external
                    ? await defaultResolver(importDeclaration)
                    : _module;
        } catch (err) {
            console.error(err);
        }
        if (_module) {
            const _cache = importDeclaration.external ? externalCache : cache;
            _cache.add(_module);
        } else {
            const file = files.filter(filterFile(importDeclaration.source))[0];
            if (!file) {
                throw Error(
                    `can't find ${importDeclaration.source} in ${parent}`
                );
            }
            await initializeModule({ file, files, resolver, globals, cache });
        }
    }
}
async function transformCode(file) {
    const meta = {};
    let tranformedContent = file.content;
    const ext = file.path.split('.').pop();
    // const transformerModule = transformers[ext];
    // if (transformerModule) {
    //   const transformer = await transformerModule();
    //   tranformedContent = await transformer(meta, tranformedContent, file);
    // }
    for (const t of jsTransformers) {
        tranformedContent = await t(meta, tranformedContent, file);
    }
    return { meta, content: tranformedContent };
}
async function initializeModule({ file, files, resolver, globals, cache }) {
    const { meta, content } = await transformCode(file);
    const { imports } = meta;
    cache.add({
        path: file.path,
        meta
    });

    await initializeDependencies({
        imports,
        resolver,
        parent: file.path,
        files,
        globals,
        cache
    });
    const definition = await createModuleDefinition({
        file,
        imports,
        content,
        globals,
        cache
    });
    cache.update(file.path, {
        exports: definition
    });
}
export default async function runtime({
    files,
    entry = '/index.js',
    globals = {},
    resolver = () => {}
}) {
    const cache = new Cache();
    const file = files.find(f => f.path === entry);
    await initializeModule({
        file,
        files,
        resolver,
        globals,
        cache
    });
    return cache.get(entry).exports;
}

export function process(files) {
    cleanupDOM();
    runtime({ files }).catch(ex => {
        log('error', ex.message);
    });
}

export function receiveMessage(event) {
    const data = event.data;
    if (data.type === 'files') {
        // document.getElementById('app').innerHTML = JSON.stringify(data.payload);
        const files = data.payload;
        try {
            process(files);
        } catch (ex) {
            log('error', ex.message);
        }
    }
}
export function log(level, message) {
    parent.postMessage({ type: level, payload: message });
}
