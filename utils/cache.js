import { FILE_TYPES } from './utils';
export function Cache() {
    const _cache = {};
    return {
        add: function(_module) {
            _cache[_module.path] = _module;
        },
        update: function(path, partail) {
            _cache[path] = { ..._cache[path], ...partail };
        },
        get: function(path) {
            return (
                _cache[path] ||
                FILE_TYPES.reduce((result, type) => {
                    if (result) return result;
                    else {
                        return _cache[`${path}${type}`];
                    }
                }, null)
            );
        },
        entries: function() {
            return Object.values(_cache);
        }
    };
}
