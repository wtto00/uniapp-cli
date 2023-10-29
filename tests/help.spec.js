const { spawnExec } = require('./util.js')
const help = require('./help.js')

const tests = [
  { name: '', command: '', expect: help.indexHelpText },
  { name: 'help', command: 'help', expect: help.indexHelpText },
  { name: '--help', command: '--help', expect: help.indexHelpText },
  { name: '-h', command: '-h', expect: help.indexHelpText },
  { name: 'help create', command: 'help create', expect: help.createHelpText },
  { name: 'create --help', command: 'create --help', expect: help.createHelpText },
  { name: 'create -h', command: 'create -h', expect: help.createHelpText }
]

describe('help', () => {
  it.each(tests)('uni $name', ({ command, expect: expectResult }) => {
    const res = spawnExec(`node bin/uni ${command}`)
    expect(res).toBe(expectResult)
  })
})
