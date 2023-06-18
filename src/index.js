#!/usr/bin/env node

const { log } = require("./util");

const [command, ...args] = process.argv.slice(2);

async function init() {
  switch (command) {
    case "create":
      require("./create")(args);
      break;
    case "-v":
    case "--version":
      require("./version")();
      break;
    case "-h":
    case "--help":
    case undefined:
      require("./help")();
      break;
    default:
      log(`Unkonwn command: ${command ?? ""}`);
      break;
  }
}

init();
