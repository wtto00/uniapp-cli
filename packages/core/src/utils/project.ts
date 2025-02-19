import { installedMessage, notInstalledMessage } from '../platforms/index.js'
import { getConfig } from './config.js'
import { errorDebugLog, errorMessage } from './error.js'
import { stripAnsiColors } from './exec.js'
import { exists } from './file.js'
import { Log } from './log.js'
import { getManifestJson } from './manifest.js'
import {
  getPackageJson,
  getPackageManager,
  getUniVersion,
  installDependencies,
  isInstalled,
  transformPackageCommand,
  uninstallDependencies,
} from './package.js'
import { uniBuildDone, uniRunSuccess } from './util.js'

declare global {
  type ProjectInfo = Awaited<ReturnType<typeof getProjectInfo>>
}

export async function getProjectInfo() {
  return {
    root: process.cwd(),
    Log: Log,
    manifest: await getManifestJson(),
    package: await getPackageJson(),
    packageManager: await getPackageManager(),
    uniVersion: await getUniVersion(),
    config: await getConfig(),
    utils: {
      platformNotInstalledMessage: notInstalledMessage,
      platformInstalledMessage: installedMessage,
      transformPackageCommand,
      installDependencies,
      isDependencyInstalled: isInstalled,
      uninstallDependencies,
      stripAnsiColors,
      uniRunSuccess,
      uniBuildDone,
      exists,
      errorMessage,
      errorDebugLog,
    },
  }
}
