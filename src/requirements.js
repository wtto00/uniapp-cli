const { resolve } = require('path');
const Log = require('./log');

module.exports = async function requirements(platform) {
  const projectPath = resolve('./');
  Log.info('platform:', platform, projectPath);
};
