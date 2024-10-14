import { generateSpace } from "../../utils/space";
import { appendSet } from "../../utils/util";

export interface BuildGradle {
  repositories: Set<string>;
  dependencies: Set<string>;
  allRepositories: Set<string>;
}

export const defaultBuildGradle: BuildGradle = {
  repositories: new Set([
    "https://maven.aliyun.com/repository/google",
    "http://maven.aliyun.com/nexus/content/groups/public/",
    "http://maven.aliyun.com/nexus/content/repositories/jcenter",
  ]),
  dependencies: new Set(["com.android.tools.build:gradle:4.1."]),
  allRepositories: new Set([
    "https://maven.aliyun.com/repository/google",
    "http://maven.aliyun.com/nexus/content/groups/public/",
    "http://maven.aliyun.com/nexus/content/repositories/jcenter",
    "https://mvn.getui.com/nexus/content/repositories/releases",
  ]),
};

export function mergeBuildGradle(gradle1: Partial<BuildGradle>, gradle2: Partial<BuildGradle>) {
  const buildGradle: BuildGradle = {
    repositories: new Set(),
    dependencies: new Set(),
    allRepositories: new Set(),
  };
  appendSet(buildGradle.repositories, gradle1.repositories);
  appendSet(buildGradle.dependencies, gradle1.dependencies);
  appendSet(buildGradle.allRepositories, gradle1.allRepositories);
  appendSet(buildGradle.repositories, gradle2.repositories);
  appendSet(buildGradle.dependencies, gradle2.dependencies);
  appendSet(buildGradle.allRepositories, gradle2.allRepositories);
  return buildGradle;
}

function genderateRepositories(repositories: Set<string>, space = 8) {
  const repositoriesXML: string[] = [];
  for (const url of repositories) {
    repositoriesXML.push(`maven { url '${url}' }`);
  }
  return repositoriesXML.join(`\n${generateSpace(space)}`);
}

function genderateDependencies(dependencies: Set<string>, space = 8) {
  const dependenciesXML: string[] = [];
  for (const dependencie of dependencies) {
    dependenciesXML.push(`classpath '${dependencie}'`);
  }
  return dependenciesXML.join(`\n${generateSpace(space)}`);
}

export function generateBuildGradle(gradle: BuildGradle) {
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
}`;
}
