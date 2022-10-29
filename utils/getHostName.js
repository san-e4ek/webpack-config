module.exports = (envConfig = {}) => {
  const { HOST, PORT, isHTTPS } = envConfig;

  return `${isHTTPS ? 'https' : 'http'}://${HOST}:${PORT}`;
};
