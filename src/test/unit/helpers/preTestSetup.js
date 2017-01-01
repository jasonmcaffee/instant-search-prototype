/* eslint no-process-env: "off" */
/**
 * We don't want to use relative paths when requiring modules, so we need to set the NODE_PATH to be root/build.
 * Helpers execute before specs run.
 */
console.log('dir: ' + __dirname);
console.log('cwd:' + process.cwd());
process.env.NODE_PATH = process.cwd() + '/build';
require('module').Module._initPaths();
console.log('NODE_PATH is ' + process.env.NODE_PATH);
