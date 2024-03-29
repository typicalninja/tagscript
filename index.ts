export { default as Parser } from './src/parser';
export { default as Interpreter } from './src/internal/interpreter/interpreter';
export { default as getStaticProps } from './src/internal/static/staticprops';
export { applyExt as addDefaults, removeExt as removeDefaults, createLoadExtensionData } from './ext';
export * as utils from './src/internal/utils'
export const { version } = require('./package.json')