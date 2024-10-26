import type { PackageJson } from 'pkg-types'
import type { ManifestConfig } from './manifest.config.js'
import { readJsonFile } from './file.js'

export const App = {
  projectRoot: '',

  package: null as PackageJson | null,

  manifest: null as ManifestConfig | null,

  init() {
    App.projectRoot = process.cwd()
  },

  getPackageJson(): PackageJson {
    if (!App.package) {
      App.package = readJsonFile<PackageJson>('package.json')
    }
    return App.package
  },

  getManifestJson(): ManifestConfig {
    if (!App.manifest) {
      App.manifest = readJsonFile<ManifestConfig>('src/manifest.json', true)
    }
    return App.manifest
  },
}
