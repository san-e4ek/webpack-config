const { resolveApp } = require('./utils/resolvePath');

module.exports = {
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  dotenv: resolveApp('.env'),
  buildPath: resolveApp('build'),
  publicPath: resolveApp('public'),
  entryPath: resolveApp('src/index'),
  appHtml: resolveApp('public/index.html'),
  tsConfig: resolveApp('tsconfig.json'),
  webpackCache: resolveApp('node_modules/.cache/webpack'),
  eslintCache: resolveApp('node_modules/.cache/.eslintcache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  nodeModules: resolveApp('node_modules'),
};
