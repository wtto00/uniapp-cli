import { ManifestConfig } from '@uniapp-cli/common'
import { Results } from '../prepare'

export function appendSQLite(results: Results, manifest: ManifestConfig) {
  const SQLite = manifest['app-plus']?.modules?.SQLite
  if (!SQLite) return
}
