import { cp, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { URL, resolve } from 'node:url'
import { App, errorMessage, exists, installDependencies, ora } from '@wtto00/uniapp-common'
import fetch from 'node-fetch'
import { ProxyAgent } from 'proxy-agent'
import { dependencies, projectDir } from './utils/const.js'
import { getSDKDir, getTemplateDir } from './utils/path.js'

export { platformRemove } from './platform-remove.js'

export async function platformAdd() {
  const uniVersion = await App.getUniVersion()
  await installDependencies(dependencies.map((dependencyName) => `${dependencyName}@${uniVersion}`))

  const sdkDir = await getSDKDir()
  const agent = new ProxyAgent()
  if (!(await exists(sdkDir))) {
    // download sdk libs
    const baseUrl = new URL(process.env.UNIAPP_ANDROID_SDK_URL || 'https://wtto00.github.io/uniapp-android-sdk/')
    const spinner = ora('正在下载Android SDK Lib文件: ').start()
    const url = new URL(`libs/${uniVersion}/index.json`, baseUrl)
    const sdkFiles: Record<string, string> = {}
    try {
      const fetchResult = await fetch(url, { agent })
      if (fetchResult.status === 404) {
        throw Error(`Android 平台暂不支持版本 ${uniVersion}`)
      }
      const sdkJson = (await fetchResult.json()) as Record<string, string>
      if (!sdkJson) throw Error()
      Object.assign(sdkFiles, sdkJson)
    } catch (error) {
      spinner.fail(errorMessage(error))
      throw Error(`请求Android SDK@${uniVersion} Lib文件列表失败: ${url}`)
    }
    const targetDir = `${sdkDir}-tmp`
    if (!(await exists(targetDir))) await mkdir(targetDir, { recursive: true })
    const libNames = Object.keys(sdkFiles)
    const libCount = libNames.length
    try {
      for (let i = 0; i < libCount; i++) {
        const lib = libNames[i]
        spinner.text = `(${i + 1}/${libCount}) 正在下载Android SDK Lib文件: ${lib} (0%)`
        const libPath = resolve(targetDir, lib)
        if (await exists(libPath)) continue
        const libUrl = new URL(`libs/${sdkFiles[lib]}`, baseUrl)
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
          spinner.text = `(${i + 1}/${libCount}) 正在下载Android SDK Lib文件: ${lib} (${Number(((fileBuffer.byteLength / total) * 100).toFixed(2))}%)`
        })
        await new Promise((resolve, reject) => {
          libFetchRes.body!.on('error', reject)
          libFetchRes.body!.on('finish', resolve)
        })
        await writeFile(libPath, fileBuffer)
      }
      spinner.succeed('Android SDK Lib文件已下载完成')
      await rename(targetDir, sdkDir)
    } catch (error) {
      spinner.fail(errorMessage(error))
      throw Error('下载Android SDK Lib文件失败了，请重试')
    }
  }

  try {
    await cp(getTemplateDir(), projectDir, { recursive: true })
  } catch (error) {
    await rm(projectDir, { recursive: true, force: true })
    throw error
  }
}
