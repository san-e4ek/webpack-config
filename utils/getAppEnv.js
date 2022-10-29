module.exports = () =>
  Object.entries(process.env).reduce((envConfig, [key, value]) => {
    return { ...envConfig, [`process.env.${key}`]: JSON.stringify(value) };
  }, {});
