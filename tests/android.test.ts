import assert from 'node:assert'
import { rm } from 'node:fs'
import { after, before, describe, it } from 'node:test'
import { execaSync } from 'execa'
import Log from '../src/utils/log.js'
import { execaUniapp, execaUniappSync } from './helper.js'

describe('android', () => {
  before(
    async () => {
      execaUniappSync('create test-project-android --template dcloudio/uni-preset-vue#vite-ts')
      process.chdir('test-project-android')
      execaSync`pnpm --ignore-workspace --no-lockfile install`
    },
    { timeout: 90000 },
  )

  after(
    async () => {
      process.chdir('..')
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          rm('test-project-android', { force: true, recursive: true }, (err) => {
            if (err) reject(err)
            else resolve(undefined)
          })
        }, 1000),
      )
    },
    { timeout: 90000 },
  )

  it('add', { timeout: 60000 }, async () => {
    const { stdout } = await execaUniapp('platform add android')
    assert.equal(stdout, Log.successMessage('平台 android 已成功添加'))
  })

  it('remove', { timeout: 60000, todo: true })
  it('run', { timeout: 60000, todo: true })
  it('build', { timeout: 60000, todo: true })
})
