# vue-map-plugin

基于 Vue3 的多地图（高德、百度、谷歌）插件，支持地图容器组件和统一服务 API，方便在项目中快速集成多种主流地图。

## 安装

推荐使用 pnpm / npm / yarn 安装：

```sh
pnpm add vue-map-plugin
# 或
npm install vue-map-plugin
# 或
yarn add vue-map-plugin
```

## 快速开始

### 1. 注册插件

在你的 `main.js` 或 `main.ts` 中注册插件：

```js
import { createApp } from 'vue'
import App from './App.vue'
import VueMapPlugin from 'vue-map-plugin'

const app = createApp(App)

app.use(VueMapPlugin, {
  amap: {
    key: '你的高德Key',
    securityJsCode: '你的安全密钥', // 如需安全密钥
    plugins: ['AMap.Geocoder'] // 需要加载的插件
  },
  bmap: {
    key: '你的百度Key'
  },
  google: {
    key: '你的Google Key'
  }
})

app.mount('#app')
```

### 2. 使用地图容器组件

```vue
<template>
  <MapContainer
    :containerId="'my-map'"
    :mapType="'amap'"  <!-- 可选：amap | bmap | google -->
    :config="{
      center: [116.397428, 39.90923],
      zoom: 12
    }"
    @map-loaded="onMapLoaded"
    @map-error="onMapError"
    style="height: 500px"
  />
</template>

<script setup>
function onMapLoaded({ map, service }) {
  // map: 地图实例
  // service: 地图服务实例（AMapService/BMapService）
  // 例如添加标记点
  service.addMarker({
    position: [116.397428, 39.90923],
    title: '天安门'
  })
}
function onMapError(error) {
  console.error('地图加载失败', error)
}
</script>
```

### 3. 通过组合式 API 获取服务实例

```js
import { inject } from 'vue'

const mapServiceFactory = inject('mapServiceFactory')
const amapService = mapServiceFactory.createService('amap')
```

## API 说明

### MapContainer 组件 Props

| 属性         | 类型     | 说明                       |
| ------------ | -------- | -------------------------- |
| containerId  | String   | 容器 DOM id                |
| mapType      | String   | 地图类型：amap/bmap/google |
| config       | Object   | 地图初始化配置             |

### 事件

- `@map-loaded`：地图加载完成，参数为 `{ map, service }`
- `@map-error`：地图加载失败

---

## 地图服务 API（以高德为例）

通过 `service` 实例可调用以下方法：

### 初始化地图

```js
await service.initMap(containerId, config)
```

### 添加标记点

```js
service.addMarker({
  position: [lng, lat], // 必填
  title: '标题',
  content: '内容',
  icon: { image: 'xxx.png' }, // 可选
  draggable: false, // 可选
  click: (e, marker) => {} // 可选
})
```

### 批量添加标记点

```js
service.addMarkers([
  { position: [lng1, lat1], title: 'A' },
  { position: [lng2, lat2], title: 'B' }
])
```

### 移除/清除标记点

```js
service.removeMarker(marker)
service.clearMarkers()
```

### 添加折线

```js
service.addPolyline({
  path: [[lng1, lat1], [lng2, lat2]],
  strokeColor: '#3366FF',
  strokeWeight: 5,
  click: (e, line) => {}
})
```

### 添加多边形

```js
service.addPolygon({
  path: [[lng1, lat1], [lng2, lat2], [lng3, lat3]],
  fillColor: '#1791fc',
  fillOpacity: 0.3,
  strokeColor: '#1791fc',
  strokeWeight: 2,
  click: (e, polygon) => {}
})
```

### 信息窗口

```js
service.addInfoWindow({
  position: [lng, lat],
  content: '内容'
})
service.removeInfoWindow(infoWindow)
service.clearInfoWindows()
```

### 轨迹绘制

```js
const track = service.addTrack([
  [lng1, lat1],
  [lng2, lat2],
  [lng3, lat3]
])
service.removeTrack(track)
service.clearTracks()
```

### 其他常用方法

- `service.setCenter([lng, lat])` 设置中心点
- `service.setZoom(zoom)` 设置缩放级别
- `service.fitView(positions)` 自动适应视野
- `service.switchBaseLayer(type)` 切换底图（normal/satellite/roadNet）
- `service.addOverlayLayer(type, options)` 添加叠加图层（traffic/buildings/custom）
- `service.removeOverlayLayer(layer)` / `service.clearOverlayLayers()`
- `service.geocode(address)` 地址转坐标，返回 Promise
- `service.reverseGeocode([lng, lat])` 坐标转地址，返回 Promise
- `service.addMapEvent(eventName, handler)` 添加地图事件监听
- `service.removeMapEvent(eventName, handler)` 移除地图事件监听
- `service.destroyMap()` 销毁地图

---

## 类型定义

详见 [types/index.d.ts](types/index.d.ts)

---

## 目录结构

详见 [项目结构](#项目结构)

---

## License

MIT