# vue-map-plugin

基于 Vue3 的多地图（高德、百度、谷歌）插件，支持地图容器组件和统一服务 API，方便在项目中快速集成多种主流地图。

---

## 当前开发进度

**注意：目前本插件仅实现了高德地图（AMap）文档中的全部功能，百度地图（BMap）和谷歌地图（Google Map）部分尚未开发，敬请期待后续更新。欢迎关注和 Star 项目进展！**

项目地址：[https://github.com/dengxuyang/vue-map-plugin.git](https://github.com/dengxuyang/vue-map-plugin.git)

---
---

## 未来计划

- [ ] 百度地图（BMap）支持
- [ ] 谷歌地图（Google Map）支持
- [ ] 更多地图高级功能

---
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
 <!-- mapType 可选：amap | bmap | google -->
<template>
  <MapContainer
    :containerId="'my-map'"
    :mapType="'amap'" 
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

...existing code...

## MapContainer 组件 Props

| 属性         | 类型     | 说明                       |
| ------------ | -------- | -------------------------- |
| containerId  | String   | 容器 DOM id                |
| mapType      | String   | 地图类型：amap/bmap/google |
| config       | Object   | 地图初始化配置             |

### config 配置详解（以高德地图为例）

`config` 是传递给地图初始化的参数对象，常用配置如下：

| 配置项         | 类型           | 说明                                                                                  | 示例值                        |
| -------------- | -------------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| center         | Array          | 地图中心点坐标 `[lng, lat]`                                                           | `[116.397428, 39.90923]`      |
| zoom           | Number         | 地图缩放级别（3-20）                                                                  | `12`                          |
| layers         | Array          | 地图图层（如卫星、路网等），一般无需手动设置，推荐用 `tileLayer` 字段                  | `[new AMap.TileLayer()]`      |
| tileLayer      | String         | 快速切换底图类型，可选值：`"Satellite"`（卫星图），不传为默认矢量                       | `"Satellite"`                 |
| viewMode       | String         | 地图视图模式，可选 `"2D"` 或 `"3D"`                                                   | `"2D"`                        |
| pitch          | Number         | 俯仰角度，仅 3D 模式下有效                                                            | `0`                           |
| rotation       | Number         | 地图旋转角度，范围 [0-360]                                                            | `0`                           |
| animateEnable  | Boolean        | 是否允许有动画效果                                                                    | `true`                        |
| showLabel      | Boolean        | 是否显示地图文字标注                                                                  | `true`                        |
| features       | Array          | 地图显示要素，如 `["bg", "road", "point"]`                                            | `["bg", "road", "point"]`     |
| mapStyle       | String         | 地图自定义样式，详见高德官方文档                                                      | `"amap://styles/whitesmoke"`  |
| ...            | ...            | 其他高德地图支持的初始化参数，详见[官方文档](https://lbs.amap.com/api/jsapi-v2/documentation#map) |                               |

#### 示例

```js
const config = {
  center: [116.397428, 39.90923], // 中心点
  zoom: 12,                       // 缩放级别
  tileLayer: "Satellite",         // 卫星底图（可选）
  viewMode: "2D",                 // 2D/3D
  animateEnable: true,            // 动画
  showLabel: true,                // 显示文字标注
  mapStyle: "amap://styles/whitesmoke" // 自定义样式
}
```

> **注意：**
> - `tileLayer: "Satellite"` 时会自动叠加卫星和路网图层，无需手动配置 `layers`。
> - 其他参数可参考 [高德地图 JSAPI v2.0 Map 配置文档](https://lbs.amap.com/api/jsapi-v2/documentation#map)。


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
### 轨迹动画（逐点轨迹）相当于轨迹回放

```js
// 逐点绘制轨迹动画
const controller = service.createTrackStepByStep([
  [lng1, lat1],
  [lng2, lat2],
  [lng3, lat3]
], {
  interval: 500, // 每个点之间的间隔（毫秒）
  onProgress: (index, position, progress) => {
    // index: 当前点索引
    // position: 当前点坐标
    // progress: 进度百分比（0~1）
  },
  onFinish: () => {
    // 动画完成回调
  }
})

// 控制动画
controller.start()   // 开始动画
controller.stop()    // 暂停动画
controller.destroy() // 移除轨迹及相关标记
```

### 清除所有逐点轨迹

```js
service.clearStepTracks()
```

### 绘制模式（draw）

通过 `draw` 方法可以让用户在地图上交互式绘制点、线、面等几何图形，适用于自定义标记、路径、区域等场景。

#### 方法签名

```js
service.draw(type, options) : Promise<overlay>
```

- `type`：绘制类型，支持 `'marker'`（点）、`'polyline'`（折线）、`'polygon'`（多边形）、`'rectangle'`（矩形）、`'circle'`（圆）。
- `options`：绘制参数（可选），如样式、颜色等，具体可参考高德 MouseTool 配置。

#### 返回值

- 返回一个 Promise，resolve 时参数为绘制完成的覆盖物对象（如 Marker、Polyline、Polygon 等）。

#### 使用示例

```js
// 绘制一个多边形
service.draw('polygon', {
  strokeColor: '#f00',
  fillColor: '#0f0',
  fillOpacity: 0.4
}).then(polygon => {
  // polygon 为绘制完成的多边形实例
  console.log('绘制完成', polygon)
})

// 绘制一个点
service.draw('marker').then(marker => {
  // marker 为绘制完成的标记点实例
})
```

#### 关闭绘制模式

```js
service.closeDraw()
```

#### 注意事项

- 开启绘制模式后，鼠标指针会变为十字形，绘制完成后自动恢复。
- 若需中途取消绘制，可调用 `closeDraw()`。
- 支持多种类型的覆盖物绘制，参数与高德 MouseTool 保持一致。

---

如需更详细的参数说明，请参考高德地图官方 [MouseTool 文档](https://lbs.amap.com/api/jsapi-v2/documentation#mouseTool)。
### 其他常用方法

- `service.setCenter([lng, lat])` 设置中心点
- `service.setZoom(zoom)` 设置缩放级别
- `service.fitView(positions)` 自动适应视野
- `service.setRotation(angle, animate = true, duration = 300) ` 地图旋转
- `service.getRotation() ` 获取地图旋转角度
- `service.rotateToDirection(direction, animate = true)` 旋转到指定方向 方向：'north'(正北), 'east'(正东), 'south'(正南), 'west'(正西)
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