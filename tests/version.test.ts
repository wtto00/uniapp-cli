import assert from 'node:assert'
import { before, describe, it } from 'node:test'
import { type PackageJson, readPackageJSON } from 'pkg-types'
import { execaUniapp } from './helper.js'

describe('version', async () => {
  let packages = {} as PackageJson

  before(async () => {
    packages = await readPackageJSON()
  })

  it('--version', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('--version')
    assert.strictEqual(stdout, `uniapp_cli v${packages.version}`)
  })

  it('-v', { timeout: 10000 }, async () => {
    const { stdout } = await execaUniapp('--version')
    assert.strictEqual(stdout, `uniapp_cli v${packages.version}`)
  })
})
