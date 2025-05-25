/*
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:23:08
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-16 14:23:13
 * @FilePath: /vue-map-plugin/types/index.d.ts
 * @Description: 
 */
import { App } from 'vue'

declare interface MapPluginOptions {
  amap?: {
    key: string
    plugins?: string[]
  }
  bmap?: {
    key: string
  }
  google?: {
    key: string
    libraries?: string[]
  }
}

declare const VueMapPlugin: {
  install: (app: App, options?: MapPluginOptions) => void
}

export default VueMapPlugin
export { MapServiceFactory, MapContainer, InfoWindow }