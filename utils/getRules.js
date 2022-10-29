module.exports = (loadPaths = [], env) => [
  {
    test: /\.m?js/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
  },
  {
    test: /\.(ts|tsx|js|jsx)$/,
    include: loadPaths,
    exclude: /node_modules/,
    use: [
      env.isEsbuild
        ? {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
              // tsconfigRaw: require('tsconfig/base.json'),
            },
          }
        : {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript'],
                ['patronum/babel-preset'],
                ['@babel/preset-env'],
                ['react-app'],
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['babel-plugin-styled-components', { displayName: true }],
                ['@babel/plugin-transform-flow-strip-types'],
                ['@babel/transform-runtime'],
              ],
            },
          },
    ],
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('@svgr/webpack'),
        options: {
          prettier: false,
          svgo: false,
          svgoConfig: {
            plugins: [{ removeViewBox: false }],
          },
          titleProp: true,
          ref: true,
        },
      },
      {
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash].[ext]',
        },
      },
    ],
  },
  {
    test: /\.(woff2|woff|ttf|otf|eot|png|jpe?g|gif)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.json$/,
    loader: 'json-loader',
  },
];
