// const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const openBrowser = require('react-dev-utils/openBrowser');
// const nodeExternals = require('webpack-node-externals');

const resolvePath = require('./utils/resolvePath');
const getHostName = require('./utils/getHostName');
const connectMfe = require('./utils/connectMfe');
const connectEnv = require('./utils/connectEnv');
const getPlugins = require('./utils/getPlugins');
const getRules = require('./utils/getRules');
const getEnv = require('./utils/getEnv');
const paths = require('./paths');

connectEnv(process.env.NODE_ENV);

const envConfig = getEnv();
const { isDevelopmentMode, isNeedSourceMap, isIndependentMode, isProductionMode } = envConfig;
const { isHTTPS, HOST, PORT, isEsbuild } = envConfig;
const hostName = getHostName(envConfig);

module.exports.mergeConfig = ({
  paths: { aliasPaths = {}, packagesPaths = [], modulesPaths = [] },
  options = {},
  plugins = [],
  configs = {},
}) => {
  const { output = {}, devServer = {} } = options;

  const appPathList = [paths.appSrc].concat(packagesPaths, modulesPaths);

  return {
    entry: paths.entryPath,
    mode: process.env.NODE_ENV ?? 'development',
    devtool: isDevelopmentMode ? 'eval-cheap-module-source-map' : isNeedSourceMap ? 'source-map' : undefined,
    infrastructureLogging: { level: 'warn' },
    stats: 'minimal',

    // externalsPresets: { node: true },
    // externals: [
    // nodeExternals({
    //   modulesFromFile: true,
    // }),
    // nodeExternals({
    //   modulesDir: path.resolve(__dirname, '../../node_modules'),
    // }),
    // ],

    output: Object.assign(
      {
        publicPath: '/',
      },
      isProductionMode && {
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
        assetModuleFilename: 'static/media/[name].[hash][ext]',
        path: paths.buildPath,
        clean: true,
      },
      output
    ),

    devServer: Object.assign(
      {
        onListening: () => openBrowser(hostName),
        client: { overlay: false },
        historyApiFallback: true,
        allowedHosts: 'all',
        https: isHTTPS,
        host: HOST,
        port: PORT,
      },
      !isIndependentMode && {
        watchFiles: appPathList,
      },
      devServer
    ),

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: Object.assign(aliasPaths, {
        process: 'process/browser',
      }),
    },

    module: {
      rules: getRules(appPathList, envConfig),
    },

    plugins: [].concat(getPlugins({ envConfig, ...configs }), plugins),

    cache: {
      type: 'filesystem',
      allowCollectingMemory: true,
    },

    optimization: {
      minimizer: [
        isEsbuild
          ? new ESBuildMinifyPlugin({
              target: 'es2015',
              css: true,
            })
          : new TerserPlugin(),
      ],
    },
  };
};

module.exports.resolvePath = resolvePath;

module.exports.getHostName = getHostName;

module.exports.connectMfe = connectMfe;

module.exports.getEnv = getEnv;
