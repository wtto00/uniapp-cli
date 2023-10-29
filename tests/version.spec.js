const { spawnExec } = require('./util.js')
const { version } = require('../package.json')

const VERSION_TEXT = `uniapp-cli v${version}
`

const tests = [
  { name: '--version', command: '--version', expect: VERSION_TEXT },
  { name: '-V', command: '-V', expect: VERSION_TEXT }
]

describe('version', () => {
  it.each(tests)('uni $name', ({ command, expect: expectResult }) => {
    const res = spawnExec(`node bin/uni ${command}`)
    expect(res).toBe(expectResult)
  })
})
