import { type ModuleClass } from './index.js'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { spawnExec } from '@wtto00/android-tools'
import { BuildOptions } from 'typescript'
import { getOutput, spawnExecSync, installPackages, uninstallPackages, killChildProcess } from '../utils/exec.js'
import { dynamicImport } from '../utils/import.js'
import { Log } from '../utils/log.js'
import { getPackageJson, isInstalled } from '../utils/package.js'

const android: ModuleClass = {
  modules: ['@dcloudio/uni-app-plus', 'uniapp-android'],

  requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
      if (existsSync(javaBinPath)) {
        const res = getOutput(spawnExecSync(javaBinPath, ['-version']))
        const version = res.split('\n')[0]
        Log.success(`${Log.emoji.success} ${version}`)
      } else {
        Log.warn(`${Log.emoji.fail} Java exec bin file is not exists.`)
      }
    } else {
      Log.warn(`${Log.emoji.fail} JAVA_HOME is not set.`)
    }
    // ANDROID_HOME
    if (process.env.ANDROID_HOME) {
      Log.success(`${Log.emoji.success} ANDROID_HOME=${process.env.ANDROID_HOME}`)
    } else {
      Log.warn(`${Log.emoji.fail} ANDROID_HOME is not set.`)
    }
  },

  async platformAdd({ version }) {
    installPackages(this.modules.map((m) => `${m}@${version}`))
    const newPackages = await getPackageJson()
    for (const module of this.modules) {
      if (!isInstalled(newPackages, module)) {
        Log.error(`Module \`${module}\` is not installed.`)
        return
      }
    }
    const scriptPath = resolve(global.projectRoot, 'node_modules/uniapp-android/dist/add.js')
    if (!existsSync(scriptPath)) {
      Log.error('File `node_modules/uniapp-android/dist/add.js` not found.')
      return
    }

    const addAndroid = await dynamicImport<() => Promise<void>>(scriptPath)

    try {
      addAndroid()
      Log.success('Patform android has been added successfully.')
    } catch (error) {
      Log.error((error as Error).message)
    }
  },

  async platformRemove({ packages }) {
    if (isInstalled(packages, 'uniapp-android')) {
      const scriptPath = resolve(global.projectRoot, 'node_modules/uniapp-android/dist/remove.js')
      if (existsSync(scriptPath)) {
        const removeAndroid = await dynamicImport<() => void>(scriptPath)
        try {
          removeAndroid()
        } catch (error) {
          Log.error((error as Error).message)
        }
      }
    }
    uninstallPackages(['uniapp-android'])
  },

  run(options) {
    const uniappProcess = spawnExec('npx', ['uni', '-p', 'app-android'], async (msg) => {
      const doneChange = /DONE {2}Build complete\. Watching for changes\.{3}/.test(msg)
      if (!doneChange) return

      Log.info('\nstart build android:')

      const scriptPath = resolve(global.projectRoot, 'node_modules/uniapp-android/dist/run.js')
      if (!existsSync(scriptPath)) {
        Log.error(`File \`${scriptPath}\` does't exist.`)
        killChildProcess(uniappProcess)
        return
      }

      const build = await dynamicImport<(options: BuildOptions) => Promise<string>>(scriptPath)

      try {
        const deviceName = await build(options)
        if (!options.device) options.device = deviceName
      } catch (error) {
        Log.error((error as Error).message)
        killChildProcess(uniappProcess)
      }
    })
  },

  build() {},
}

export default android
