const { log } = require("./util");

module.exports = function version() {
  const { version } = require("../package.json");
  log(`v${version}`);
};
