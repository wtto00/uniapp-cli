import type { Command } from 'commander'
import { getModuleVersion, getPackage, isInstalled } from './utils/package'
import Log from './utils/log'
import chalk from 'chalk'
import { ALL_PLATFORMS, type Platform } from './utils/const'

export async function requirements (platforms: Platform[]): Promise<void> {
  const packages = await getPackage()

  const allPlatforms = Object.keys(ALL_PLATFORMS) as Platform[]
  const checkCurrentDirectory = !Array.isArray(platforms) || platforms.length === 0

  const platform: Platform[] = checkCurrentDirectory
    ? allPlatforms.filter((pfm) =>
      (ALL_PLATFORMS[pfm as Platform].modules || []).every((module) => isInstalled(packages, module))
    )
    : platforms.reduce<Platform[]>((sum, pfm) => {
      if (ALL_PLATFORMS[pfm]) sum.push(pfm)
      return sum
    }, [])

  let vueVersion = ''

  for (let i = 0; i < platform.length; i++) {
    const pfm = platform[i]
    Log.debug(`check requirements of ${pfm}`)
    Log.info(chalk.bgGreen(`${pfm}:`))

    const { vue3NotSupport, envs, modules } = ALL_PLATFORMS[pfm]

    // check vue3 support
    if (vue3NotSupport) {
      try {
        vueVersion ||= await getModuleVersion(packages, 'vue')
        if (vueVersion >= '3') {
          Log.error(`Vue3 currently does not support ${pfm}\n`)
          return
        }
      } catch (error) {
        Log.error((error as Error).message)
      }
    }

    modules.forEach(module => {
      if (isInstalled(packages, module)) {
        Log.info(`package: ${module} has been installed ✅`)
      } else {
        Log.info(`package: ${module} has not installed ❌`)
      }
    });

    // check environments of requirement
    (envs ?? []).forEach((/** @type {string} */ env) => {
      if (process.env[env]) {
        Log.info(`env: ${env} has been set ✅`)
      } else {
        Log.info(`env: ${env} is not set ❌`)
      }
    })
    Log.info()
  }
}

export function initRequirementsCommand (program: Command): void {
  program
    .command('requirements')
    .alias('requirement')
    .usage('[platform ...]')
    .summary('Checks and print out all the requirements for platforms specified.')
    .description(
      'Checks and print out all the requirements for platforms specified ' +
      '(or all platforms added to project if none specified). ' +
      'If all requirements for each platform are met, exits with code 0 otherwise exits with non-zero code.'
    )
    .argument('[platform...]', 'Platforms requirements you want to check.')
    .addHelpText('after', '\nExample:\n  uniapp requirements android')
    .action((platforms) => {
      void requirements(platforms)
    })
}
