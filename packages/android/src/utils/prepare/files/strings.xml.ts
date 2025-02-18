import { generateSpace } from '../space.js'

export const StringsFilePath = 'app/src/main/res/values/strings.xml'

export type Strings = Record<string, string>

export const defaultStrings: Strings = {
  app_name: 'My UniApp',
  dcloud_permission_write_external_storage_message:
    '应用保存运行状态等信息，需要获取读写手机存储（系统提示为访问设备上的照片、媒体内容和文件）权限，请允许。',
  dcloud_permission_read_phone_state_message:
    '为保证您正常、安全地使用，需要获取设备识别码（部分手机提示为获取手机号码）使用权限，请允许。',
}

export function genderateStrings(strings: Strings) {
  const stringsXML: string[] = []
  for (const name in strings) {
    stringsXML.push(`<string name="${name}">${strings[name]}</string>`)
  }
  return `<resources>
    ${stringsXML.join(`\n${generateSpace(4)}`)}
</resources>`
}
