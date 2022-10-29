const fs = require('fs');

const paths = require('../paths');

module.exports = (nodeEnv) => {
  const dotenvFiles = [`${paths.dotenv}.${nodeEnv}.local`, `${paths.dotenv}.${nodeEnv}`, paths.dotenv];

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand').expand(
        require('dotenv').config({
          path: dotenvFile,
        })
      );
    }
  });
};
