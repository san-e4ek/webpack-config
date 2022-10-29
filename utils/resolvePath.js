const { resolve } = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

module.exports.resolveApp = (relativePath) => resolve(appDirectory, relativePath);

module.exports.setResolver = (relativePath) => (packagePath) =>
  resolve(appDirectory, `${relativePath}${packagePath}`);
