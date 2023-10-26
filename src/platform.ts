import type { Command } from 'commander'
import { checkIsUniapp, getModuleVersion, getPackage } from './utils/package'
import { ALL_PLATFORMS, type Platform } from './utils/const'
import Log from './utils/log'
import { installPackages } from './utils/exec'

export async function add (platforms: Platform[]): Promise<void> {
  const packages = await getPackage()
  checkIsUniapp(packages)

  const uniVersoin = await getModuleVersion(packages, '@dcloudio/uni-app')

  for (let i = 0; i < platforms.length; i++) {
    const pfm = platforms[i]
    if (!ALL_PLATFORMS[pfm]) {
      Log.error(`${pfm} is not an valid platform value.\n`)
    } else {
      const { vue3NotSupport, modules } = ALL_PLATFORMS[pfm]
      if (vue3NotSupport) {
        const vueVersion = await getModuleVersion(packages, 'vue')
        if (vueVersion >= '3') {
          Log.error(`Vue3 currently does not support ${pfm}\n`)
        }
      } else {
        if (!uniVersoin) {
          Log.error('Cannot get version of uniapp.')
        } else {
          installPackages(modules.map((m) => `${m}@^${uniVersoin}`))
        }
      }
    }
  }
}
export function remove (pfm: string[]): void {}
export function list (): void {}

export function initPlatformCommand (program: Command): void {
  const platform = program
    .command('platform')
    .usage('<command> [options]')
    .summary('Manage project platforms.')
    .description('Manage project platforms.')

  platform
    .command('add')
    .usage('<plat-spec...>')
    .summary('Add specified platforms and install them.')
    .description('Add specified platforms and install them.')
    .argument('<plat-spec...>', 'Specified platforms')
    .action((pfm) => {
      void add(pfm)
    })
  platform
    .command('rm')
    .alias('remove')
    .usage('<platform...>')
    .summary('Remove specified platforms.')
    .description('Remove specified platforms.')
    .argument('<platform...>', 'Specified platforms')
    .action((pfm) => {
      remove(pfm)
    })
  platform
    .command('ls')
    .alias('list')
    .summary('List all installed and available platforms.')
    .description('List all installed and available platforms.')
    .action(() => {
      list()
    })

  program.parse(process.argv)
}
