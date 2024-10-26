import { program } from 'commander'
import { Log } from './utils/log.js'
import { App } from './utils/app.js'
import { CLI_VERSION } from './utils/const.js'
import { checkIsUniapp } from './utils/package.js'

App.init()

program
  .name('uniapp')
  .version(`uniapp_cli v${CLI_VERSION}`, '-v, --version', 'uniapp_cli 的版本号')
  .usage('<command> [options]')
  .option('-d, --verbose', '调试模式，输出 debug 级别的日志信息')
  .helpOption('-h, --help', '帮助信息')
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true)

program
  .command('create')
  .usage('<project-name>')
  .summary('创建新项目')
  .description('使用 uniapp_cli 创建新项目')
  .argument('<project-name>', '项目名称')
  .option('-t, --template <template>', '新建项目的模板，是一个 Git 仓库地址')
  .option('-f, --force', '如果目录已存在，强制覆盖')
  .addHelpText(
    'after',
    `
示例:
  uniapp create MyUniApp
  uniapp create MyUniApp -t dcloudio/uni-preset-vue#vite-ts --force
  uniapp create MyUniApp -t https://gitee.com/dcloudio/uni-preset-vue#vite-ts
  uniapp create MyUniApp -t git@gitee.com:dcloudio/uni-preset-vue#vite
`,
  )
  .action(async (projectName, options) => {
    try {
      const { create } = await import('./create.js')
      await create(projectName, options)
    } catch (error) {
      Log.error((error as Error).message || '创建新项目出错了。')
      process.exit(1)
    }
  })

program
  .command('requirements')
  .alias('requirement')
  .usage('<platform ...>')
  .summary('检查给定平台的环境要求')
  .description('检查给定平台的环境要求')
  .argument('<platform...>', '想要检查的平台: android,ios,h5,mp-weixin...')
  .addHelpText('after', '\n示例:\n  uniapp requirements android\n  uniapp requirement h5 mp-weixin')
  .action(async (platforms) => {
    try {
      checkIsUniapp()
      const { requirements } = await import('./requirements.js')
      await requirements(platforms)
    } catch (error) {
      Log.error((error as Error).message || '检查平台环境要求出错了。')
      process.exit(1)
    }
  })

const platform = program
  .command('platform')
  .usage('<command> [options]')
  .summary('管理应用的平台')
  .description('管理应用的平台')

platform
  .command('add')
  .usage('<platform...>')
  .summary('添加并安装给定的平台')
  .description('添加并安装给定的平台')
  .argument('<platform...>', '要添加的平台: android,ios,h5,mp-weixin...')
  .action(async (platforms) => {
    try {
      checkIsUniapp()
      const { add } = await import('./platform.js')
      await add(platforms)
    } catch (error) {
      Log.error((error as Error).message || '添加安装平台出错了。')
      process.exit(1)
    }
  })
platform
  .command('rm')
  .alias('remove')
  .usage('<platform...>')
  .summary('移除并卸载给定的平台')
  .description('移除并卸载给定的平台')
  .argument('<platform...>', '要移除的平台: android,ios,h5,mp-weixin...')
  .action(async (platforms) => {
    try {
      checkIsUniapp()
      const { remove } = await import('./platform.js')
      await remove(platforms)
    } catch (error) {
      Log.error((error as Error).message || '移除卸载平台出错了。')
      process.exit(1)
    }
  })
platform
  .command('ls')
  .alias('list')
  .summary('列出所有已安装和可用的平台')
  .description('列出所有已安装和可用的平台')
  .action(async () => {
    try {
      checkIsUniapp()
      const { list } = await import('./platform.js')
      await list()
    } catch (error) {
      Log.error((error as Error).message || '列举平台出错了。')
      process.exit(1)
    }
  })

program
  .command('run')
  .usage('<platform>')
  .summary('开始运行给定的平台')
  .description('开始运行给定的平台')
  .argument('<platform>', '要运行的平台: android,ios,h5,mp-weixin...')
  .option('--no-open', '不自动打开')
  .option('--debug', '开发模式')
  .option('--release', '发布模式')
  .option('--device <device>', '运行到给定的设备上')
  .addHelpText(
    'after',
    '\n示例:\n  uniapp run android --release --device myEmulator\n  uniapp run ios --debug\n  uniapp run mp-weixin',
  )
  .action(async (platform, options) => {
    try {
      checkIsUniapp()
      const { run } = await import('./run.js')
      await run(platform, options)
    } catch (error) {
      Log.error((error as Error).message || `运行平台 \`${platform}\` 出错了。`)
      process.exit(1)
    }
  })

program
  .command('build')
  .usage('<platform>')
  .summary('打包给定的平台')
  .description('打包给定的平台')
  .argument('<platform>', '要打包的平台: android,ios,h5,mp-weixin...')
  .option('--no-open', '不自动打开')
  .option('--debug', '开发模式')
  .option('--release', '发布模式')
  .option('--device <device>', '运行到给定的设备上')
  .addHelpText(
    'after',
    '\n示例:\n  uniapp build android --release\n  uniapp build ios --debug\n  uniapp build mp-weixin',
  )
  .action(async (platform, options) => {
    try {
      checkIsUniapp()
      const { build } = await import('./build.js')
      await build(platform, options)
    } catch (error) {
      Log.error((error as Error).message || `打包平台 \`${platform}\` 出错了。`)
      process.exit(1)
    }
  })

program.parse(process.argv)

Log.verbose = program.getOptionValue('verbose')
