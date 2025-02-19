import { join } from 'node:path'
import { execa } from 'execa'

/**
 * 获取微信开发者工具的cli路径。
 * 优先级: 1. 配置文件中的路径 2. 环境变量中的路径 3. 默认路径
 */
export async function getWeixinDevToolCliPath(projectInfo: ProjectInfo) {
  const {
    Log,
    config,
    utils: { exists },
  } = projectInfo

  if (process.platform !== 'win32' && process.platform !== 'darwin') {
    Log.error(`微信开发者工具不支持系统: ${process.platform}`)
    return
  }
  if (config['mp-weixin']?.devTool) {
    if (await exists(config['mp-weixin'].devTool)) return config['mp-weixin'].devTool
  }
  if (process.env.WEIXIN_DEV_TOOL) {
    if (await exists(process.env.WEIXIN_DEV_TOOL)) return process.env.WEIXIN_DEV_TOOL
  }
  const defaultPath =
    process.platform === 'win32'
      ? 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat'
      : '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
  if (await exists(defaultPath)) return defaultPath
  Log.error('未找到微信开发工具，请确认已安装')
}

/**
 * 使用微信开发者工具打开打包后的项目文件
 * @param projectPath 打包后的微信小程序文件目录相对于项目根目录的位置
 */
export async function openWeixinDevTool(projectInfo: ProjectInfo, projectPath: string) {
  const cliPath = await getWeixinDevToolCliPath(projectInfo)
  if (!cliPath) return

  await execa({
    stdio: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${cliPath} ${['open', '--project', join(process.cwd(), projectPath)]}`
}

/**
 * 生成小程序的预览二维码
 * @param projectPath 打包后的微信小程序文件目录相对于项目根目录的位置
 */
export async function preview(projectInfo: ProjectInfo, projectPath: string) {
  const cliPath = await getWeixinDevToolCliPath(projectInfo)
  if (!cliPath) return

  await execa({
    stdio: 'inherit',
    env: { FORCE_COLOR: 'true' },
    reject: false,
  })`${cliPath} ${['preview', '--project', join(process.cwd(), projectPath)]}`
}

/**
 * 上传小程序
 * @param projectPath 打包后的微信小程序文件目录相对于项目根目录的位置
 * @param options 上传选项
 */
export async function upload(
  projectInfo: ProjectInfo,
  projectPath: string,
  options: Required<Pick<UniPublishOptions, 'version' | 'desc'>>,
) {
  const cliPath = await getWeixinDevToolCliPath(projectInfo)
  if (!cliPath) return

  const { Log } = projectInfo

  Log.info('开始上传微信小程序...')
  await execa({
    stdio: 'inherit',
    env: { FORCE_COLOR: 'true' },
  })`${cliPath} ${['upload', '--project', join(process.cwd(), projectPath), '-v', options.version, '-d', options.desc]}`
}
