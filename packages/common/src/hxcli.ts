import { App } from './app.js'
import { exists } from './file.js'

/**
 * 获取HBuilderX的cli可执行文件位置
 * 优先命令中的参数，然后是配置文件中的配置，最后是环境变量中的配置
 * @param hxcli 指定HBuilderX的cli可执行文件位置
 * @returns HBuilderX的cli可执行文件位置
 */
export async function getHXCli(hxcli: string | boolean): Promise<string> {
  if (hxcli === false) return ''
  if (typeof hxcli === 'string' && hxcli.trim()) {
    if (await exists(hxcli)) return hxcli
  }
  const config = await App.getConfig()
  if (config.hxcli) {
    if (await exists(config.hxcli)) return config.hxcli
  }
  if (process.env.HBUILDERX_CLI) {
    if (await exists(process.env.HBUILDERX_CLI)) return process.env.HBUILDERX_CLI
  }
  throw Error('未找到HBuilderX的cli可执行文件位置')
}
