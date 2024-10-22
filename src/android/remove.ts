import { existsSync, rmSync } from 'node:fs'

export default function remove() {
  if (existsSync(androidDir)) rmSync(androidDir, { recursive: true, force: true })
}
