/*
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:14:38
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-20 01:02:02
 * @FilePath: /vue-map-plugin/src/index.js
 * @Description: 插件入口
 */
import MapContainer from './components/MapContainer.vue'
import MapServiceFactory from './services/MapServiceFactory'

const VueMapPlugin = {
  install(app, options = {}) {
    console.log('options', options)
    // 注册全局组件
    app.component('MapContainer', MapContainer)
    
    
    // 提供全局服务
    app.config.globalProperties.$mapService = (type = 'amap') => {
      return MapServiceFactory.createService(type, options[type] || {})
    }
    
    // 提供组合式API
    app.provide('mapServiceFactory',  {
      createService(type) {
        return MapServiceFactory.createService(type, options[type] || {})
      }
    })
  }
}

export { MapServiceFactory, MapContainer }
export default VueMapPlugin