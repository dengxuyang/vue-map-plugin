/*
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:18:01
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-17 01:10:45
 * @FilePath: /vue-map-plugin/src/services/MapServiceFactory.js
 * @Description: 地图服务工厂
 */
import AMapService from './AMapService'
import BMapService from './BMapService'
// import GoogleMapService from './GoogleMapService'

class MapServiceFactory {
  static createService(type, options = {}) {
    switch (type) {
      case 'amap':
        return new AMapService(options)
      case 'bmap':
        return new BMapService(options)
      // case 'google':
      //   return new GoogleMapService(options)
      default:
        throw new Error(`Unsupported map type: ${type}`)
    }
  }
}

export default MapServiceFactory