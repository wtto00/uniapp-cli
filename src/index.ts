import { resolve } from 'node:path'
import { program } from 'commander'
import { Log } from './utils/log.js'
import { Package, checkIsUniapp, readPackageJSONSync } from './utils/package.js'

Package.init()

checkIsUniapp(Package.packages)

program
  .name('uniapp')
  .version(
    `uniapp_cli v${readPackageJSONSync(resolve(import.meta.dirname, '..')).version}`,
    '-v, --version',
    'uniapp_cli 的版本号',
  )
  .usage('<command> [options]')
  .option('-d, --verbose', '调试模式，输出 debug 级别的日志信息')
  .helpOption('-h, --help', '帮助信息')
  .allowUnknownOption(true)
  .showHelpAfterError(true)
  .showSuggestionAfterError(true)

program
  .command('create')
  .usage('<app-name>')
  .summary('创建新应用')
  .description('使用 uniapp_cli 创建新应用')
  .argument('<app-name>', '应用名称')
  .option('-t, --template <template>', '新建应用的模板，是一个 Git 仓库地址')
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
  .action((appName, options) => {
    void import('./create.js').then(({ create }) => create(appName, options))
  })

program
  .command('requirements')
  .alias('requirement')
  .usage('<platform ...>')
  .summary('检查给定平台的环境要求')
  .description('检查给定平台的环境要求')
  .argument('<platform...>', '想要检查的平台: android,ios,h5,mp-weixin...')
  .addHelpText('after', '\n示例:\n  uniapp requirements android\n  uniapp requirement h5 mp-weixin')
  .action((platforms) => {
    void import('./requirements.js').then(({ requirements }) => requirements(platforms))
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
  .action((platforms) => {
    void import('./platform.js').then(({ add }) => add(platforms))
  })
platform
  .command('rm')
  .alias('remove')
  .usage('<platform...>')
  .summary('移除并卸载给定的平台')
  .description('移除并卸载给定的平台')
  .argument('<platform...>', '要移除的平台: android,ios,h5,mp-weixin...')
  .action((platforms) => {
    void import('./platform.js').then(({ remove }) => remove(platforms))
  })
platform
  .command('ls')
  .alias('list')
  .summary('列出所有已安装和可用的平台')
  .description('列出所有已安装和可用的平台')
  .action(() => {
    void import('./platform.js').then(({ list }) => list())
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
  .action((platform, options) => {
    void import('./run.js').then(({ run }) => run(platform, options))
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
  .action((platform, options) => {
    void import('./build.js').then(({ build }) => build(platform, options))
  })

program.parse(process.argv)

Log.verbose = program.getOptionValue('verbose')
