import exports from './ast-exports';
import imports from './ast-imports';

// const transformers = {
//     css: () => import('./css').then(m => m.default),
//     json: () => import('./json').then(m => m.default),
//     svg: () => import('./svg').then(m => m.default),
//     md: () => import('./markdown').then(m => m.default)
// };
export const jsTransformers = [imports, exports];
//export default transformers;
