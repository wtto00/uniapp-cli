/**
 * create uniapp project
 * @param {string[]} options
 */
module.exports = async function create(options) {
  const [command] = options;
  switch (command) {
    case "-h":
    case "--help":
      require("./help")();
      break;
    default:
      require("./create")(options);
      break;
  }
};
