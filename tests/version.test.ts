import { before, describe, it } from 'node:test'
import assert from 'node:assert'
import { execaUniapp } from './helper.js'
import { type PackageJson, readPackageJSON } from 'pkg-types'

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
