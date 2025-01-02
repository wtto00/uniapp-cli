import { getHdc } from '../harmony/tools/hdc.js'
import { getHvigorw } from '../harmony/tools/hvigorw.js'
import { getOhpm } from '../harmony/tools/ohpm.js'

/**
 * 缓存相关配置
 */
export const Tools = {
  _hdc: null as null | string,
  _ohpm: null as null | string,
  _hvigorw: null as null | string,

  async getHdc() {
    if (!Tools._hdc) Tools._hdc = await getHdc()
    return Tools._hdc
  },

  async getOhpm() {
    if (!Tools._ohpm) Tools._ohpm = await getOhpm()
    return Tools._ohpm
  },

  async getHvigorw() {
    if (!Tools._hvigorw) Tools._hvigorw = await getHvigorw()
    return Tools._hvigorw
  },
}
