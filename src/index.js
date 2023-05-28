#!/usr/bin/env node

const [command, ...args] = process.argv.slice(2)

async function init() {
  switch (command) {
    case 'create':
      const create = require('./create')
      create(args)
      break
    case '-h':
    case '--help':
      const help = require('./help')
      help()
      break
    default:
      console.log(`Unkonwn command: ${command}`)
      break
  }
}

init()
