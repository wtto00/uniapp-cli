import { describe, it } from 'node:test'

describe('ios', () => {
  it('add', { timeout: 60000, todo: true, skip: process.platform !== 'darwin' })
  it('remove', { timeout: 60000, todo: true, skip: process.platform !== 'darwin' })
  it('run', { timeout: 60000, todo: true, skip: process.platform !== 'darwin' })
  it('build', { timeout: 60000, todo: true, skip: process.platform !== 'darwin' })
})
