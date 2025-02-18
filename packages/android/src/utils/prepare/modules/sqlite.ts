import { App } from '@wtto00/uniapp-common'
import { appendFeature } from '../files/dcloud_properties.xml.js'
import type { Results } from '../results.js'

export async function appendSQLite(results: Results) {
  const manifest = await App.getManifestJson()
  const SQLite = manifest['app-plus']?.modules?.SQLite
  if (!SQLite) return

  results.libs.add('sqlite-release.aar')

  appendFeature(results.properties, {
    name: 'Sqlite',
    value: 'io.dcloud.feature.sqlite.DataBaseFeature',
  })
}
