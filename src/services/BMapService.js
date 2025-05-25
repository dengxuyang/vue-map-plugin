/*
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:18:24
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-16 14:25:58
 * @FilePath: /vue-map-plugin/src/services/BMapService.js
 * @Description: 
 */
class BMapService {
  constructor(options) {
    this.options = options
    this.map = null
    this.BMap = null
    this.markers = []
    this.lines = []
    this.polygons = []
    this.infoWindows = []
  }

  async initMap(containerId, config = {}) {
    return new Promise((resolve, reject) => {
      if (!window.BMap) {
        const script = document.createElement('script')
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${this.options.key}&callback=initBMapCallback`
        script.onerror = reject
        window.initBMapCallback = () => {
          this.BMap = window.BMap
          this.map = new this.BMap.Map(containerId)
          resolve(this.map)
        }
        document.head.appendChild(script)
      } else {
        this.BMap = window.BMap
        this.map = new this.BMap.Map(containerId)
        resolve(this.map)
      }
    })
  }

  // 百度地图特有方法实现...
  addMarker(options) {
    const point = new this.BMap.Point(options.position[0], options.position[1])
    const marker = new this.BMap.Marker(point)
    this.map.addOverlay(marker)
    this.markers.push(marker)
    return marker
  }
  
  // 其他方法...
}

export default BMapService