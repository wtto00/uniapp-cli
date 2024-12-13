import { cp, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { execa } from 'execa'
import type { GeneratorTransform } from 'execa/types/transform/normalize.js'
import fetch from 'node-fetch'
import ora from 'ora'
import { resolveCommand } from 'package-manager-detector/commands'
import { ProxyAgent } from 'proxy-agent'
import { buildAndroid, runAndroid } from '../android/run.js'
import { initSignEnv } from '../android/sign.js'
import { getLibSDKDir } from '../android/utils.js'
import { checkConfig } from '../app-plus/check.js'
import type { BuildOptions } from '../build.js'
import type { RunOptions } from '../run.js'
import { App } from '../utils/app.js'
import { errorMessage } from '../utils/error.js'
import { stripAnsiColors } from '../utils/exec.js'
import { exists } from '../utils/file.js'
import { runHXCli } from '../utils/hbuilderx.js'
import Log from '../utils/log.js'
import { AndroidDir, AndroidPath, IOSDir, TemplateDir, UNIAPP_SDK_HOME } from '../utils/path.js'
import { showSpinner } from '../utils/spinner.js'
import { trimEnd, uniRunSuccess } from '../utils/util.js'
import { PlatformModule } from './index.js'

const UNIAPP_ANDROID_SDK_URL =
  trimEnd(process.env.UNIAPP_ANDROID_SDK_URL, '/') || 'https://wtto00.github.io/uniapp-android-sdk'

export class PlatformAndroid extends PlatformModule {
  modules = ['@dcloudio/uni-app-plus', '@dcloudio/uni-uts-v1']

  async isInstalled() {
    return (await super.isInstalled()) && (await exists(AndroidDir))
  }

  async requirement() {
    // JAVA_HOME
    if (process.env.JAVA_HOME) {
      const javaBinPath = resolve(process.env.JAVA_HOME, `bin/java${process.platform === 'win32' ? '.exe' : ''}`)
      if (await exists(javaBinPath)) {
        const { stderr, stdout } = await execa`${javaBinPath} -version`
        const raw = (stdout || stderr).split('\n')[0]
        if (raw.includes(' version ')) {
          Log.success(`${raw}`)
        } else {
          Log.warn('检测 Java 版本失败了')
        }
      } else {
        Log.warn(`Java 可执行文件不存在: ${javaBinPath}`)
      }
    } else {
      Log.warn('没有设置环境变量: `JAVA_HOME` ')
    }
    // ANDROID_HOME
    if (process.env.ANDROID_HOME) {
      Log.success(`ANDROID_HOME=${process.env.ANDROID_HOME}`)
    } else {
      Log.warn('没有设置环境变量: `ANDROID_HOME` ')
    }
  }

  async add() {
    await super.add()

    const uniVersion = App.getUniVersion()

    const sdkDir = resolve(UNIAPP_SDK_HOME, 'android', uniVersion)
    const agent = new ProxyAgent()
    if (!(await exists(sdkDir))) {
      // download sdk libs
      const spinner = ora('正在下载Android SDK Lib文件: ').start()
      const url = `${UNIAPP_ANDROID_SDK_URL}/libs/${uniVersion}/index.json`
      let sdkFiles: Record<string, string> = {}
      try {
        const fetchResult = await fetch(url, { agent })
        if (fetchResult.status === 404) {
          throw Error(`Android 平台暂不支持版本 ${uniVersion}`)
        }
        sdkFiles = (await fetchResult.json()) as Record<string, string>
        if (!sdkFiles) throw Error()
      } catch (error) {
        spinner.fail(errorMessage(error))
        throw Error(`请求UniApp Android SDK@${uniVersion} 文件列表失败: ${url}`)
      }
      const targetDir = resolve(UNIAPP_SDK_HOME, 'android', `${uniVersion}-tmp`)
      if (!(await exists(targetDir))) await mkdir(targetDir, { recursive: true })
      const libSDKDir = getLibSDKDir(uniVersion)
      const libsName = Object.keys(sdkFiles)
      const libsCount = libsName.length
      try {
        for (let i = 0; i < libsCount; i++) {
          const lib = libsName[i]
          spinner.text = `(${i + 1}/${libsCount}) 正在下载Android SDK Lib文件: ${lib} (0%)`
          const libPath = resolve(targetDir, lib)
          if (await exists(libPath)) continue
          const libUrl = `${UNIAPP_ANDROID_SDK_URL}/libs/${sdkFiles[lib]}`
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
            spinner.text = `(${i + 1}/${libsCount}) 正在下载Android SDK Lib文件: ${lib} (${Number(((fileBuffer.byteLength / total) * 100).toFixed(2))}%)`
          })
          await new Promise((resolve, reject) => {
            libFetchRes.body!.on('error', reject)
            libFetchRes.body!.on('finish', resolve)
          })
          await writeFile(libPath, fileBuffer)
        }
        spinner.succeed('Android SDK Lib文件已下载完成')
        await rename(targetDir, libSDKDir)
      } catch (error) {
        spinner.fail(errorMessage(error))
        throw Error('下载Android SDK Lib文件失败了，请重试')
      }
    }

    try {
      await cp(resolve(TemplateDir, 'android'), AndroidDir, { recursive: true })
    } catch (error) {
      await rm(AndroidDir, { recursive: true, force: true })
      throw error
    }
  }

  async remove() {
    if (!(await exists(IOSDir))) {
      await super.remove()
    }
    await showSpinner(() => rm(AndroidDir, { recursive: true, force: true }), {
      start: `正在删除 ${AndroidPath}`,
      succeed: `${AndroidPath} 已删除`,
      fail: `${AndroidPath} 删除失败`,
    })
  }

  async run(options: RunOptions) {
    initSignEnv(options)

    checkConfig()

    if (options.hxcli !== false) {
      // 使用HBuilderX运行
      await runHXCli(options)
      return
    }

    const pm = App.getPackageManager()
    const args = []
    if (App.isVue3()) {
      args.push('uni', '-p', 'app-android')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      process.env.UNI_PLATFORM = 'app-plus'
      args.push('vue-cli-service', 'uni-build', '--watch')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    let over = false
    const outTransform = function* (line: string) {
      yield line
      if (over) return
      const text = stripAnsiColors(line)
      if (uniRunSuccess(text)) {
        over = true
        runAndroid(options)
      }
    } as GeneratorTransform<false>
    const errTransform = function* (line: string) {
      const text = stripAnsiColors(line)
      if (
        text === 'Cannot find module: @dcloudio/uni-uts-v1' ||
        text.includes('项目使用了uts插件，正在安装 uts Android 运行扩展...')
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

  async build(options: BuildOptions) {
    initSignEnv(options)

    checkConfig()

    const cli = process.env.HBUILDERX_CLI_PATH
    if (cli && (await exists(cli))) {
      Log.info(`使用HBuilderX的CLI打包: ${cli}`)

      const open = await execa({
        stdout: 'inherit',
        stderr: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${cli} open`

      if (open.stderr) {
        throw Error('打开HBuilderX失败了')
      }

      await new Promise((resolve) => setTimeout(resolve, 3000))

      const { stderr } = await execa({
        stdout: 'inherit',
        stderr: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${cli} project open --path ${App.projectRoot}`

      if (stderr) {
        throw Error(`使用HBuilderX的CLI打开项目 ${App.projectRoot} 失败`)
      }

      const projectName = basename(App.projectRoot)
      const output = await execa({
        stdout: ['inherit', 'pipe'],
        stderr: ['inherit', 'pipe'],
        env: { FORCE_COLOR: 'true' },
      })`${cli} publish --platform APP --type appResource --project ${projectName}`

      if (output.stderr || output.stdout.match(/Build failed in (\d+\.)?\d+m?s/)) {
        throw Error('使用HBuilderX的CLI打包失败了')
      }

      await buildAndroid(options, { isBuild: true, isHbuilderX: true })
      return
    }

    const pm = App.getPackageManager()
    const args = []
    if (App.isVue3()) {
      args.push('uni', 'build', '-p', 'app-android')
      if (options.mode) args.push('--mode', options.mode)
    } else {
      process.env.UNI_PLATFORM = 'app-plus'
      args.push('vue-cli-service', 'uni-build')
    }
    const commands = resolveCommand(pm.agent, 'execute-local', args)
    if (!commands) throw Error(`无法转换执行命令: ${pm.agent} execute-local ${args.join(' ')}`)

    const { stdout, stderr } = await execa({
      stdout: ['inherit', 'pipe'],
      stderr: ['inherit', 'pipe'],
      env: { FORCE_COLOR: 'true' },
    })`${commands.command} ${commands.args}`
    if (!options.open) return

    const text = stripAnsiColors(stdout as unknown as string)

    if (/DONE {2}Build complete\./.test(text)) {
      await buildAndroid(options, { isBuild: true })
    } else if (
      stderr.includes('Cannot find module: @dcloudio/uni-uts-v1') ||
      stderr.includes('项目使用了uts插件，正在安装 uts Android 运行扩展...')
    ) {
      Log.error('应用使用了UTS插件，请配置 `HBUILDERX_CLI_PATH` 环境变量')
    }
  }
}
