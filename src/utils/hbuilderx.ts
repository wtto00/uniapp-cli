import { access } from 'node:fs/promises'

export async function getHBuilderXCli(hxcli: string | boolean): Promise<string> {
  if (hxcli === false) return ''
  const useEnv = hxcli === true || !hxcli.trim()
  const hxcliPath = useEnv ? process.env.HBUILDERX_CLI : hxcli
  if (!hxcliPath) return Promise.reject(Error('未设置HBuilderX的cli可执行文件位置'))
  try {
    await access(hxcliPath)
    return hxcliPath
  } catch {
    return Promise.reject(Error(`设置的HBuilderX的cli可执行文件位置不存在: ${hxcliPath}`))
  }
}
