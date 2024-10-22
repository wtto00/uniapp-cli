export const ControlFilePath = 'app/src/main/assets/data/dcloud_control.xml'

export interface Control {
  appid: string
}

export function mergeControl(control1?: Control, control2?: Control) {
  return {
    appid: control2?.appid || control1?.appid || '',
  } as Control
}

export function genderateDcloudControl(control: Control) {
  return `<hbuilder>
<apps>
    <app appid="${control.appid}" appver=""/>
</apps>
</hbuilder>
`
}
