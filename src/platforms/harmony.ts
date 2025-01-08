import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import fetch from 'node-fetch'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector'
import type { PackageJson } from 'pkg-types'
import { ProxyAgent } from 'proxy-agent'
import type { BuildOptions } from '../build.js'
import { buildHarmony } from '../harmony/build.js'
import { checkConfig } from '../harmony/check.js'
import { getLibSDKDir } from '../harmony/utils/lib.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { errorMessage } from '../utils/error.js'
import { stripAnsiColors } from '../utils/exec.js'
import { editJsonFile, exists } from '../utils/file.js'
import Log from '../utils/log.js'
import { uninstallDeps } from '../utils/package.js'
import { HarmonyDir, HarmonyPath, TemplateDir } from '../utils/path.js'
import { showSpinner } from '../utils/spinner.js'
import { trimEnd, uniRunSuccess } from '../utils/util.js'
import PlatformAndroid from './android.js'
import { PlatformModule } from './index.js'
import PlatformIOS from './ios.js'

const UNIAPP_HARMONY_SDK_URL =
  trimEnd(process.env.UNIAPP_HARMONY_SDK_URL, '/') || 'https://wtto00.github.io/uniapp-harmony-sdk'

export default class PlatformHarmony extends PlatformModule {
  static instance = new PlatformHarmony()

  modules = ['@dcloudio/uni-app-harmony', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(HarmonyDir))
  }

  async requirement() {
    // HARMONY_HOME
    if (process.env.HARMONY_HOME) {
      Log.success(`HARMONY_HOME=${process.env.HARMONY_HOME}`)
    } else {
      Log.warn('没有设置环境变量: `HARMONY_HOME`')
    }
  }

  async add() {
    await super.add()

    const uniVersion = App.getUniVersion()

    const sdkDir = getLibSDKDir(uniVersion)
    const agent = new ProxyAgent()
    const libFiles: Record<string, string> = {}
    if (!(await exists(sdkDir))) {
      // download sdk libs
      const spinner = ora('正在下载Android SDK Lib文件: ').start()
      const url = `${UNIAPP_HARMONY_SDK_URL}/libs/${uniVersion}/index.json`
      const sdkFiles: Record<string, string> = {}
      try {
        const fetchResult = await fetch(url, { agent })
        if (fetchResult.status === 404) {
          throw Error(`Harmony 平台暂不支持版本 ${uniVersion}`)
        }
        const sdkJson = (await fetchResult.json()) as Record<string, string>
        if (!sdkJson) throw Error()
        Object.assign(sdkFiles, sdkJson)
      } catch (error) {
        spinner.fail(errorMessage(error))
        throw Error(`请求Harmony SDK@${uniVersion} Lib文件列表失败: ${url}`)
      }
      const targetDir = getLibSDKDir(`${uniVersion}-tmp`)
      if (!(await exists(targetDir))) await mkdir(targetDir, { recursive: true })
      // 保存index.json
      const libNames = Object.keys(sdkFiles)
      const libCount = libNames.length
      try {
        for (let i = 0; i < libCount; i++) {
          const libUrlPath = sdkFiles[libNames[i]]
          const fileName = basename(libUrlPath)
          libFiles[libNames[i]] = fileName
          spinner.text = `(${i + 1}/${libCount}) 正在下载Harmony SDK Lib文件: ${fileName} (0%)`
          const libPath = resolve(targetDir, fileName)
          if (await exists(libPath)) continue
          const libUrl = `${UNIAPP_HARMONY_SDK_URL}/libs/${libUrlPath}`
          const libFetchRes = await fetch(libUrl, { agent })
          if (!libFetchRes.ok) throw Error(`下载出错了: ${libFetchRes.statusText}`)
          const contentLength = libFetchRes.headers.get('content-length')
          if (!contentLength) throw Error('下载出错了: content-length为空')
          const total = Number.parseInt(contentLength, 10)
          if (!total) throw Error('下载出错了: 文件大小为0')
          if (!libFetchRes.body) throw Error('下载出错了: body为空')
          let fileBuffer = new Uint8Array()
          libFetchRes.body.on('data', (chunk) => {
            fileBuffer = Buffer.concat([fileBuffer, chunk])
            spinner.text = `(${i + 1}/${libCount}) 正在下载Harmony SDK Lib文件: ${fileName} (${Number(((fileBuffer.byteLength / total) * 100).toFixed(2))}%)`
          })
          await new Promise((resolve, reject) => {
            libFetchRes.body!.on('error', reject)
            libFetchRes.body!.on('finish', resolve)
          })
          await writeFile(libPath, fileBuffer)
        }
        await writeFile(join(targetDir, 'index.json'), JSON.stringify(libFiles), 'utf8')
        spinner.succeed('Harmony SDK Lib文件已下载完成')
        await rename(targetDir, sdkDir)
      } catch (error) {
        spinner.fail(errorMessage(error))
        throw Error('下载Harmony SDK Lib文件失败了，请重试')
      }
    } else {
      const libIndexJsonPath = join(sdkDir, 'index.json')
      const libIndexJsonContent = await readFile(libIndexJsonPath, 'utf8')
      Object.assign(libFiles, JSON.parse(libIndexJsonContent))
    }

    try {
      await cp(join(TemplateDir, 'harmony'), HarmonyDir, { recursive: true })

      Log.debug('准备SDK Lib文件')
      const dependencies: Record<string, string> = {}
      for (const name in libFiles) {
        dependencies[name] = `./libs/${libFiles[name]}`
        await cp(join(sdkDir, libFiles[name]), join(HarmonyDir, 'libs', libFiles[name]), { recursive: true })
      }
      await editJsonFile<PackageJson>(join(HarmonyDir, 'oh-package.json5'), (data) => {
        if (!data.dependencies) data.dependencies = dependencies
        else Object.assign(data.dependencies, dependencies)
      })
    } catch (error) {
      await rm(HarmonyDir, { recursive: true, force: true })
      throw error
    }
  }

  async remove() {
    if (!(await PlatformAndroid.instance.isInstalled()) && !(await PlatformIOS.instance.isInstalled())) {
      await uninstallDeps(this.modules)
    } else {
      await uninstallDeps(this.modules.slice(0, 1))
    }
    await showSpinner(() => rm(HarmonyDir, { recursive: true, force: true }), {
      start: `正在删除 ${HarmonyPath}`,
      succeed: `${HarmonyPath} 已删除`,
      fail: `${HarmonyPath} 删除失败`,
    })
  }

  async run(options: RunOptions) {
    checkConfig()

    const pm = App.getPackageManager()
    const args = []
    args.push('uni', '-p', 'app-harmony')
    if (options.mode) args.push('--mode', options.mode)

    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    let over = false
    const outTransform = function* (line: string) {
      yield line
      if (over) return
      const text = stripAnsiColors(line)
      if (uniRunSuccess(text)) {
        over = true
        buildHarmony(options)
      }
    } as GeneratorTransform<false>
    const errTransform = function* (line: string) {
      const text = stripAnsiColors(line)
      if (
        text === 'Cannot find module: @dcloudio/uni-uts-v1' ||
        text.includes('应用使用了uts插件，正在安装 uts Harmony 运行扩展...')
      ) {
        Log.error('应用使用了UTS插件，请添加 `--hxcli [cliPath]` 参数以使用HBuilderX运行')
        process.exit(1)
      }
      if (text !== 'HBuilderX is not found') yield line
    } as GeneratorTransform<false>
    await execa({
      stdout: options.open ? [outTransform, 'inherit'] : 'inherit',
      stderr: [errTransform, 'inherit'],
      env: { FORCE_COLOR: 'true' },
      reject: false,
    })`${commands.command} ${commands.args}`
  }

  async build(_options: BuildOptions) {
    return Promise.reject(Error('暂未实现'))
  }
}
