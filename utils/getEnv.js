module.exports = () => {
  return {
    isDevelopmentMode: process.env.NODE_ENV === 'development',
    isProductionMode: process.env.NODE_ENV === 'production',
    isIndependentMode: process.env.INDEPENDENT_MODE === 'true',
    isNeedSourceMap: process.env.GENERATE_SOURCEMAP === 'true',
    isDisabledESLintPlugin: process.env.DISABLED_ESLINT_PLUGIN === 'true',
    isDisabledTypeCheckPlugin: process.env.DISABLED_TYPE_CHECK === 'true',
    isEsbuild: process.env.ESBUILD === 'true',
    isHTTPS: process.env.HTTPS === 'true',
    HOST: process.env.HOST ?? 'localhost',
    PORT: process.env.PORT ?? 3000,
    PUBLIC_URL: process.env.PUBLIC_URL,
  };
};
