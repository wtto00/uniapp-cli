import type { ManifestConfig } from '../../utils/manifest.config.js'
import type { Results } from '../prepare.js'
import { appendFeature } from '../templates/dcloud_properties.xml.js'

export function appendSQLite(results: Results, manifest: ManifestConfig) {
  const SQLite = manifest['app-plus']?.modules?.SQLite
  if (!SQLite) return

  results.libs.add('sqlite-release.aar')

  appendFeature(results.properties, {
    name: 'Sqlite',
    value: 'io.dcloud.feature.sqlite.DataBaseFeature',
  })
}
