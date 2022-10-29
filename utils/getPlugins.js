const { ProvidePlugin, DefinePlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const getAppEnv = require('./getAppEnv');
const paths = require('../paths');

module.exports = (configs) => {
  const { htmlWebpack = {}, copyWebpack = {}, envConfig = {} } = configs;

  const { isDevelopmentMode, isProductionMode, isDisabledESLintPlugin } = envConfig;
  const { isNeedSourceMap, isDisabledTypeCheckPlugin } = envConfig;

  const { patterns = [], options = {}, ignorePublicOption = [] } = copyWebpack;

  return [
    new NodePolyfillPlugin(),
    new DefinePlugin(getAppEnv()),
    new ProgressBarPlugin({ complete: '█', incomplete: '_', width: 50 }),
    new ProvidePlugin({ process: 'process/browser', React: 'react' }),
    isDevelopmentMode && new ReactRefreshPlugin({ overlay: false }),
    isProductionMode &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.publicPath,
            globOptions: {
              ignore: ['**/index.html'].concat(ignorePublicOption),
            },
          },
        ].concat(patterns),
        options,
      }),
    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          filename: 'index.html',
          template: paths.appHtml,
          buildTime: String(new Date().getTime()),
        },
        htmlWebpack
      )
    ),
    !isDisabledTypeCheckPlugin &&
      new ForkTsCheckerWebpackPlugin({
        async: isDevelopmentMode,
        devServer: false,
        typescript: {
          mode: isProductionMode ? 'write-references' : 'readonly',
          configFile: paths.tsConfig,
          configOverwrite: {
            compilerOptions: {
              sourceMap: isProductionMode ? isNeedSourceMap : isDevelopmentMode,
              tsBuildInfoFile: paths.appTsBuildInfoFile,
              build: isProductionMode,
            },
          },
          diagnosticOptions: {
            syntactic: true,
          },
        },
        issue: {
          include: [{ file: '../**/src/**/*.{ts,tsx}' }, { file: '**/src/**/*.{ts,tsx}' }],
          exclude: [
            { file: '**/src/**/__tests__/**' },
            { file: '**/src/**/?(*.){spec|test}.*' },
            { file: '**/src/setupTests.*' },
          ],
        },
      }),
    !isDisabledESLintPlugin &&
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        cwd: paths.appPath,
        failOnError: isDevelopmentMode,
        cacheLocation: paths.eslintCache,
        cache: true,
        fix: true,
      }),
  ].filter(Boolean);
};
