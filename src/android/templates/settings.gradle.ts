export const SettingsGradleFilePath = 'settings.gradle'

export const defaultSettingsGradle = new Set(['app'])

export function generateSettingsGradle(apps: Set<string>) {
  const lines = []
  for (const app of defaultSettingsGradle) {
    lines.push(`include ':${app}'`)
  }
  for (const app of apps) {
    lines.push(`include ':${app}'`)
  }
  return lines.join('\n')
}
