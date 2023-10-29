const { spawnExec } = require('./util.js')
const { createHelpText } = require('./help.js')
const { existsSync, rmSync, mkdirSync, writeFileSync } = require('fs')

describe('create', () => {
  it('uni create', () => {
    const res = spawnExec('node bin/uni create')
    expect(res).toBe(`error: missing required argument 'app-name'\n\n${createHelpText}`)
  })

  it('uni create project --template', () => {
    rmSync('./test-project1', { recursive: true, force: true })
    spawnExec('node bin/uni create test-project1 --template dcloudio/uni-preset-vue#vite')
    const exist = existsSync('./test-project1/')
    expect(exist).toBe(true)
    rmSync('./test-project1', { recursive: true, force: true })
  })

  it('uni create project -t', () => {
    rmSync('./test-project2', { recursive: true, force: true })
    spawnExec('node bin/uni create test-project2 -t dcloudio/uni-preset-vue#vite')
    const exist = existsSync('./test-project2/')
    expect(exist).toBe(true)
    rmSync('./test-project2', { recursive: true, force: true })
  })

  it('uni create project --template force warn', () => {
    mkdirSync('./test-project3')
    writeFileSync('./test-project3/test.md', 'test data', { encoding: 'utf8' })
    const res = spawnExec('node bin/uni create test-project3 --template dcloudio/uni-preset-vue#vite')
    expect(res).toBe('directory test-project3 already exists, use `--force` to overwrite.\n')
    rmSync('./test-project3', { recursive: true, force: true })
  })

  it('uni create project --template --force', () => {
    mkdirSync('./test-project4')
    writeFileSync('./test-project4/test.md', 'test data', { encoding: 'utf8' })
    spawnExec('node bin/uni create test-project4 --template dcloudio/uni-preset-vue#vite --force')
    const exist = existsSync('./test-project4/package.json')
    expect(exist).toBe(true)
    rmSync('./test-project4', { recursive: true, force: true })
  })

  it('uni create project --template -f', () => {
    mkdirSync('./test-project5')
    writeFileSync('./test-project5/test.md', 'test data', { encoding: 'utf8' })
    spawnExec('node bin/uni create test-project5 --template dcloudio/uni-preset-vue#vite -f')
    const exist = existsSync('./test-project5/package.json')
    expect(exist).toBe(true)
    rmSync('./test-project5', { recursive: true, force: true })
  })

  it('uni create project', () => {
    const res = spawnExec('node bin/uni create test-project6')
    expect(res).toBe(`? Please select a project template (Use arrow keys)
❯ vue3-ts 
  vue3 
  vitesse-uni-app 
  vue2 
  vue3-alpha 
  vue2-alpha \u001b[13D\u001b[13C`)
  })
  // TODO: How to test create project by vue-cli
})
