import { createHash } from 'node:crypto'
import { createReadStream, existsSync, readFileSync, readdirSync, statSync, watch } from 'node:fs'
import { resolve } from 'node:path'
import JSON5 from 'json5'
import { App } from './app.js'
import Log from './log.js'

export function readJsonFile<T extends object>(jsonPath: string, isJson5?: boolean) {
  const fullPath = resolve(App.projectRoot, jsonPath)
  if (!existsSync(fullPath)) {
    throw Error(`读取文件 \`${jsonPath}\` 失败: 文件不存在。`)
  }
  const content = readFileSync(fullPath, { encoding: 'utf8' })
  try {
    return (isJson5 ? JSON5 : JSON).parse(content) as T
  } catch {
    throw Error(`解析JSON文件 \`${jsonPath}\` 失败。`)
  }
}

async function md5(filename: string) {
  const stream = createReadStream(filename)
  const hash = createHash('md5')
  return new Promise<string>((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      hash.update(chunk)
    })
    stream.on('end', () => {
      const md5 = hash.digest('hex')
      resolve(md5)
    })
    stream.on('error', () => {
      reject(Error(`Failed to get md5 of file ${filename}`))
    })
  })
}

const md5cahces: Record<string, string> = {}

async function hasChanged(dirPath: string): Promise<boolean> {
  const files = readdirSync(dirPath)
  let changed = false
  for (const file of files) {
    const filePath = resolve(dirPath, file)
    if (statSync(filePath).isDirectory()) {
      const isChanged = await hasChanged(filePath)
      if (!changed && isChanged) changed = true
    } else {
      try {
        const fileMD5 = await md5(filePath)
        if (fileMD5 === md5cahces[filePath]) continue
        changed = true
        md5cahces[filePath] = fileMD5
      } catch (error) {
        Log.error((error as Error).message)
      }
    }
  }
  return changed
}

export async function watchFiles(filename: string, callback: () => Promise<void>, options?: { immediate?: boolean }) {
  // cache dir md5
  await hasChanged(filename)

  let isRuning = false
  let willRun = false
  const runCallback = async () => {
    if (isRuning) {
      willRun = true
      return
    }
    isRuning = true
    await callback()
    isRuning = false
    if (willRun) {
      willRun = false
      await runCallback()
    }
  }

  if (options?.immediate) runCallback()

  let isCalcMD5 = false
  let willCalc = false
  const watchCallback = async () => {
    if (isCalcMD5) {
      willCalc = true
      return
    }
    isCalcMD5 = true
    const isChanged = await hasChanged(filename)
    isCalcMD5 = false
    if (isChanged) {
      willCalc = false
      await runCallback()
    } else if (willCalc) {
      willCalc = false
      await watchCallback()
    } else {
      Log.debug(`${filename} 没有任何改变`)
    }
  }
  let clock: NodeJS.Timeout
  watch(filename, { persistent: true, recursive: true }, () => {
    clearTimeout(clock)
    setTimeout(watchCallback, 500)
  })
}
