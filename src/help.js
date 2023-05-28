async function help() {
  const { version } = require('../package.json')
  console.log(`
  uniapp-cli@${version}
  
  Synopsis
  
      uniapp command [options]
  
  Commands
      create ............................. Create a project
  
  Options
      -h, --help ......................... Get help for a command
      -v, --version ...................... prints out this utility's version
      -d, --verbose ...................... debug mode produces verbose log output for all activity`)
}

module.exports = help
