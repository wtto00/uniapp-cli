import { generateSpace } from '../../utils/space.js'
import { deepMerge, mergeSet } from '../../utils/util.js'

export const BuildGradleFilePath = 'build.gradle'

export interface Repositories {
  credentials?: {
    username: string
    password: string
  }
}

export interface BuildGradle {
  repositories: Record<string, Repositories>
  dependencies: Set<string>
  allRepositories: Record<string, Repositories>
  ext: Record<string, string>
}

export const defaultBuildGradle: BuildGradle = {
  repositories: {
    'https://maven.aliyun.com/repository/google': {},
    'http://maven.aliyun.com/nexus/content/groups/public/': {},
    'http://maven.aliyun.com/nexus/content/repositories/jcenter': {},
  },
  dependencies: new Set(['com.android.tools.build:gradle:4.1.1']),
  allRepositories: {
    'https://maven.aliyun.com/repository/google': {},
    'http://maven.aliyun.com/nexus/content/groups/public/': {},
    'http://maven.aliyun.com/nexus/content/repositories/jcenter': {},
    'https://mvn.getui.com/nexus/content/repositories/releases': {},
  },
  ext: {
    androidXVersion: '1.1.0',
  },
}

export function mergeBuildGradle(gradle1: Partial<BuildGradle>, gradle2: Partial<BuildGradle>): BuildGradle {
  return {
    repositories: deepMerge(gradle1.repositories, gradle2.repositories),
    dependencies: mergeSet(gradle1.dependencies, gradle2.dependencies),
    allRepositories: deepMerge(gradle1.allRepositories, gradle2.allRepositories),
    ext: deepMerge(gradle1.ext, gradle2.ext),
  }
}

function genderateRepositories(repositories: BuildGradle['repositories'], space = 8) {
  const repositoriesXML: string[] = []
  for (const url in repositories) {
    const { credentials } = repositories[url]
    repositoriesXML.push(
      `maven { url '${url}'${
        credentials
          ? `\n${generateSpace(space + 4)}credentials {
${generateSpace(space + 8)}username '${credentials.username}'
${generateSpace(space + 8)}password '${credentials.password}'
${generateSpace(space + 4)}}`
          : ''
      } }`,
    )
  }
  return repositoriesXML.join(`\n${generateSpace(space)}`)
}

function genderateDependencies(dependencies: Set<string>, space = 8) {
  const dependenciesXML: string[] = []
  for (const dependencie of dependencies) {
    dependenciesXML.push(`classpath '${dependencie}'`)
  }
  return dependenciesXML.join(`\n${generateSpace(space)}`)
}

function genderateExt(ext?: BuildGradle['ext']) {
  if (!ext) return ''
  const xml: string[] = []
  for (const key in ext) {
    xml.push(`${key} = '${ext[key]}'`)
  }
  return `ext {
  ${xml.join(`\n${generateSpace(4)}`)}
}`
}

export function generateBuildGradle(_gradle: BuildGradle) {
  const gradle = mergeBuildGradle(defaultBuildGradle, _gradle)
  return `buildscript {
    repositories {
        ${genderateRepositories(gradle.repositories, 8)}
    }
    dependencies {
        ${genderateDependencies(gradle.dependencies)}
    }
}

allprojects {
    repositories {
        ${genderateRepositories(gradle.allRepositories, 8)}
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
${genderateExt(gradle.ext)}`
}
