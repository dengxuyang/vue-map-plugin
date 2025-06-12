import AMapLoader from "@amap/amap-jsapi-loader";

class AMapService {
  constructor(options) {
    this.options = options;
    this.map = null;
    this.AMap = null;
    this.markers = [];
    this.lines = [];
    this.polygons = [];
    this.infoWindows = [];
  }

  async initMap(containerId, config = {}) {
    try {
      console.log("高德地图初始化中...", this.options);
      window._AMapSecurityConfig = {
        securityJsCode: this.options.securityJsCode,
      };
      const loaderResult = await AMapLoader.load({
        key: this.options.key,
        version: "2.0",
        plugins: this.options.plugins || [],
      });
      console.log("AMapLoader.load 返回:", loaderResult);

      const AMap = loaderResult;
      if (!AMap || !AMap.Map) {
        throw new Error("AMap 加载失败或 key 配置有误");
      }

      this.AMap = AMap;
      console.log("高德地图初始化成功:", AMap);
      console.log(config);

      if (config.tileLayer == "Satellite") {
        //创建卫星图层
        var satellite = new AMap.TileLayer.Satellite();
        //创建路网图层
        var roadNet = new AMap.TileLayer.RoadNet();
        config.layers = [satellite, roadNet];
      }
      this.map = new AMap.Map(containerId, config);

      // var toolbar = new AMap.ToolBar(); //创建工具条插件实例
      // this.map.addControl(toolbar); //添加工具条插件到页面
      // var scale = new AMap.Scale();
      // this.map.addControl(scale);

      return this.map;
    } catch (error) {
      console.error("高德地图初始化失败:", error);
      throw error;
    }
  }

  /**
   * 添加标记点
   * @param {Object} options - 标记点配置
   * @param {Array} options.position - 坐标 [lng, lat]
   * @param {String} options.title - 标题
   * @param {String} options.content - 内容
   * @param {Object} options.icon - 图标配置
   * @param {Boolean} options.draggable - 是否可拖动
   * @param {Function} options.click - 点击回调
   * @returns {Object} - 返回标记点实例
   */
  addMarker(options) {
    if (!this.map || !this.AMap) {
      console.warn("地图未初始化，请先调用initMap方法");
      return null;
    }

    const marker = new this.AMap.Marker({
      position: options.position,
      title: options.title,
      content: options.content,
      // offset: new this.AMap.Pixel(-13, -30),
      icon: this._createDefaultMarkerIcon(options.icon),
      draggable: options.draggable || false,
      extData: options.extData || {},
      bubble: options.bubble || false,
      offset: options.offset || new this.AMap.Pixel(0, 0),
      label: options.label || null,
    });

    if (options.click) {
      marker.on("click", (e) => options.click(e, marker));
    }

    this.map.add(marker);
    this.markers.push(marker);

    return marker;
  }

  /**
   * 批量添加标记点
   * @param {Array} markers - 标记点数组
   */
  addMarkers(markers) {
    return markers.map((marker) => this.addMarker(marker));
  }

  /**
   * 移除标记点
   * @param {Object} marker - 标记点实例
   */
  removeMarker(marker) {
    if (!this.map) return;

    this.map.remove(marker);
    this.markers = this.markers.filter((m) => m !== marker);
  }

  /**
   * 移除所有标记点
   */
  clearMarkers() {
    if (!this.map) return;

    this.markers.forEach((marker) => {
      this.map.remove(marker);
    });
    this.markers = [];
  }

  /**
   * 添加折线
   * @param {Object} options - 折线配置
   * @param {Array} options.path - 路径坐标数组
   * @param {String} options.strokeColor - 线条颜色
   * @param {Number} options.strokeWeight - 线条宽度
   * @param {Number} options.strokeOpacity - 线条透明度
   * @param {Function} options.click - 点击回调
   * @returns {Object} - 返回折线实例
   */
  addPolyline(options) {
    if (!this.map || !this.AMap) return null;

    const line = new this.AMap.Polyline({
      path: options.path,
      strokeColor: options.strokeColor || "#3366FF",
      strokeWeight: options.strokeWeight || 5,
      strokeOpacity: options.strokeOpacity || 1,
      strokeStyle: options.strokeStyle || "solid",
      extData: options.extData || {},
    });

    if (options.click) {
      line.on("click", (e) => options.click(e, line));
    }

    this.map.add(line);
    this.lines.push(line);

    return line;
  }

  /**
   * 移除折线
   * @param {Object} line - 折线实例
   */
  removePolyline(line) {
    if (!this.map) return;

    this.map.remove(line);
    this.lines = this.lines.filter((l) => l !== line);
  }

  /**
   * 移除所有折线
   */
  clearPolylines() {
    if (!this.map) return;

    this.lines.forEach((line) => {
      this.map.remove(line);
    });
    this.lines = [];
  }

  /**
   * 添加多边形
   * @param {Object} options - 多边形配置
   * @param {Array} options.path - 路径坐标数组
   * @param {String} options.fillColor - 填充颜色
   * @param {Number} options.fillOpacity - 填充透明度
   * @param {String} options.strokeColor - 线条颜色
   * @param {Number} options.strokeWeight - 线条宽度
   * @param {Function} options.click - 点击回调
   * @returns {Object} - 返回多边形实例
   */
  addPolygon(options) {
    if (!this.map || !this.AMap) return null;

    const polygon = new this.AMap.Polygon({
      path: options.path,
      fillColor: options.fillColor || "#1791fc",
      fillOpacity: options.fillOpacity || 0.3,
      strokeColor: options.strokeColor || "#1791fc",
      strokeWeight: options.strokeWeight || 2,
      strokeStyle: options.strokeStyle || "solid",
      draggable: options.draggable || false,
      zIndex: options.zIndex || true,
      extData: options.extData || {},
    });

    if (options.click) {
      polygon.on("click", (e) => options.click(e, polygon));
    }

    this.map.add(polygon);
    this.polygons.push(polygon);

    return polygon;
  }

  /**
   * 移除多边形
   * @param {Object} polygon - 多边形实例
   */
  removePolygon(polygon) {
    if (!this.map) return;

    this.map.remove(polygon);
    this.polygons = this.polygons.filter((p) => p !== polygon);
  }

  /**
   * 移除所有多边形
   */
  clearPolygons() {
    if (!this.map) return;

    this.polygons.forEach((polygon) => {
      this.map.remove(polygon);
    });
    this.polygons = [];
  }

  /**
   * 添加信息窗口
   * @param {Object} options - 信息窗口配置
   * @param {Array} options.position - 坐标 [lng, lat]
   * @param {String} options.content - 内容
   * @param {Number} options.offset - 偏移量
   * @param {Boolean} options.isCustom - 是否自定义
   * @param {Boolean} options.autoClose - 是否自动关闭
   * @param {Boolean} options.closeWhenClickMap - 点击地图是否关闭
   * @returns {Object} - 返回信息窗口实例
   */
  addInfoWindow(options) {
    if (!this.map || !this.AMap) return null;

    const infoWindow = new this.AMap.InfoWindow({
      position: options.position,
      content: options.content,
      offset: options.offset || new this.AMap.Pixel(0, -30),
      isCustom: options.isCustom || false,
      autoClose: options.autoClose !== false,
      closeWhenClickMap: options.closeWhenClickMap !== false,
    });

    infoWindow.open(this.map, options.position);
    this.infoWindows.push(infoWindow);

    return infoWindow;
  }

  /**
   * 移除信息窗口
   * @param {Object} infoWindow - 信息窗口实例
   */
  removeInfoWindow(infoWindow) {
    if (!this.map) return;

    infoWindow.close();
    this.infoWindows = this.infoWindows.filter((i) => i !== infoWindow);
  }

  /**
   * 移除所有信息窗口
   */
  clearInfoWindows() {
    if (!this.map) return;

    this.infoWindows.forEach((infoWindow) => {
      infoWindow.close();
    });
    this.infoWindows = [];
  }

  /**
   * 清除所有覆盖物
   */
  clearAllOverlays() {
    this.clearMarkers();
    this.clearPolylines();
    this.clearPolygons();
    this.clearInfoWindows();
    this.clearTracks();
    this.clearOverlayLayers();
  }

  /**
   * 设置地图中心点
   * @param {Array} center - 中心点坐标 [lng, lat]
   */
  setCenter(center) {
    if (!this.map) return;

    this.map.setCenter(center);
  }

  /**
   * 设置地图缩放级别
   * @param {Number} zoom - 缩放级别
   */
  setZoom(zoom) {
    if (!this.map) return;

    this.map.setZoom(zoom);
  }

  /**
   * 根据坐标点数组自动调整视野
   * @param {Array} positions - 坐标点数组
   * @param {Number} padding - 边距
   * @param {Number} duration - 动画时长
   */
  fitView(positions, padding = 60, duration = 1000) {
    if (!this.map || !positions || positions.length === 0) return;

    this.map.setFitView(
      positions.filter((pos) => pos),
      padding,
      false,
      [60, 60, 60, 60],
      duration
    );
  }

  /**
   * 销毁地图
   */
  destroyMap() {
    if (!this.map) return;

    this.clearAllOverlays();
    this.map.destroy();
    this.map = null;
    this.AMap = null;
  }

  // 私有方法 - 创建默认标记点内容
  // _createDefaultMarkerContent(options) {
  //   return `<div class="custom-marker">
  //     <div class="marker-title">${options.title || ""}</div>
  //     <div class="marker-content">${options.content || ""}</div>
  //   </div>`;
  // }

  // 私有方法 - 创建默认标记点图标
  _createDefaultMarkerIcon(icon) {
    if (icon) {
      return new this.AMap.Icon(icon);
    } else {
      console.log("使用默认图标");
      return new this.AMap.Icon({
        image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      });
    }
  }

  /* 添加地图事件监听
   * @param {String} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  addMapEvent(eventName, handler) {
    if (!this.map) return;

    this.map.on(eventName, handler);
    return () => this.map.off(eventName, handler); // 返回取消监听函数
  }

  /**
   * 移除地图事件监听
   * @param {String} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  removeMapEvent(eventName, handler) {
    if (!this.map) return;

    this.map.off(eventName, handler);
  }

  /**
   * 地理编码（地址转坐标）
   * @param {String} address - 地址
   * @returns {Promise} - 返回Promise
   */
  geocode(address) {
    return new Promise((resolve, reject) => {
      if (!this.AMap) {
        reject(new Error("AMap未初始化"));
        return;
      }

      const geocoder = new this.AMap.Geocoder();
      geocoder.getLocation(address, (status, result) => {
        if (status === "complete" && result.info === "OK") {
          resolve(result.geocodes);
        } else {
          reject(new Error("地理编码失败"));
        }
      });
    });
  }

  /**
   * 逆地理编码（坐标转地址）
   * @param {Array} lnglat - 坐标 [lng, lat]
   * @returns {Promise} - 返回Promise
   */
  reverseGeocode(lnglat) {
    return new Promise((resolve, reject) => {
      if (!this.AMap) {
        reject(new Error("AMap未初始化"));
        return;
      }

      const geocoder = new this.AMap.Geocoder();
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === "complete" && result.info === "OK") {
          resolve(result.regeocode);
        } else {
          reject(new Error("逆地理编码失败"));
        }
      });
    });
  }

  /**
   * 切换底图类型
   * @param {String} type - 可选值："normal"（默认矢量）、"satellite"（卫星）、"roadNet"（路网）
   */
  switchBaseLayer(type = "normal") {
    if (!this.map || !this.AMap) return;
    let layers = [];
    switch (type) {
      case "satellite":
        layers = [
          new this.AMap.TileLayer.Satellite(),
          new this.AMap.TileLayer.RoadNet(), // 叠加路网，显示地名
        ];
        break;
      case "roadNet":
        layers = [new this.AMap.TileLayer.RoadNet()];
        break;
      case "normal":
      default:
        layers = [new this.AMap.TileLayer()];
        break;
    }
    this.map.setLayers(layers);
  }

  /**
   * 添加叠加图层（如交通、路况等）
   * @param {String} type - 可选值："traffic"（交通）、"buildings"（楼块）、"custom"（自定义图层）
   * @param {Object} [options] - 自定义图层参数
   * @returns {Object} - 返回图层实例
   */
  addOverlayLayer(type, options = {}) {
    if (!this.map || !this.AMap) return null;
    let layer;
    switch (type) {
      case "traffic":
        layer = new this.AMap.TileLayer.Traffic(options);
        break;
      case "buildings":
        layer = new this.AMap.Buildings(options);
        break;
      case "custom":
        layer = new this.AMap.TileLayer(options);
        break;
      default:
        return null;
    }
    this.map.add(layer);
    // 保存到 overlays 方便管理
    if (!this.overlays) this.overlays = [];
    this.overlays.push(layer);
    return layer;
  }

  /**
   * 移除叠加图层
   * @param {Object} layer - 图层实例
   */
  removeOverlayLayer(layer) {
    if (!this.map || !layer) return;
    this.map.remove(layer);
    if (this.overlays) {
      this.overlays = this.overlays.filter((l) => l !== layer);
    }
  }

  /**
   * 移除所有叠加图层
   */
  clearOverlayLayers() {
    if (!this.map || !this.overlays) return;
    this.overlays.forEach((layer) => this.map.remove(layer));
    this.overlays = [];
  }
  /**
   * 添加轨迹
   * @param {Array} path - 轨迹点数组，每个元素为 [lng, lat]
   * @returns {Object} - 返回 { polyline, startMarker, endMarker }
   */
  addTrack(path) {
    if (!this.map || !this.AMap || !Array.isArray(path) || path.length < 2)
      return null;
    // 添加白色轨迹线
    const polyline = new this.AMap.Polyline({
      path,
      strokeColor: "#fff",
      strokeWeight: 4,
      strokeOpacity: 1,
      lineJoin: "round",
      lineCap: "round",
      zIndex: 50,
    });
    this.map.add(polyline);

    // 起点：白色圆形
    const startMarker = new this.AMap.Marker({
      position: path[0],
      icon: new this.AMap.Icon({
        image: "", // 不用图片，直接用自定义内容
        size: new this.AMap.Size(16, 16),
      }),
      content: `<div style="
      width:16px;height:16px;
      background:#fff;
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 0 4px #888;
      "></div>`,
      offset: new this.AMap.Pixel(-8, -8),
      zIndex: 60,
    });
    this.map.add(startMarker);

    // 终点：蓝色圆形，比起点大
    const endMarker = new this.AMap.Marker({
      position: path[path.length - 1],
      icon: new this.AMap.Icon({
        image: "",
        size: new this.AMap.Size(22, 22),
      }),
      content: `<div style="
      width:22px;height:22px;
      background:#1890ff;
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 0 6px #1890ff;
      "></div>`,
      offset: new this.AMap.Pixel(-11, -11),
      zIndex: 61,
    });
    this.map.add(endMarker);

    // 可选：保存到实例属性，便于后续管理
    if (!this.tracks) this.tracks = [];
    this.tracks.push({ polyline, startMarker, endMarker, path });

    return { polyline, startMarker, endMarker, path };
  }
  /**
   * 逐点创建轨迹
   * @param {Array} path - 轨迹点数组，每个元素为 [lng, lat]
   * @param {Object} options - 配置选项
   * @param {Number} options.interval - 每点之间的时间间隔(毫秒)，默认500
   * @param {Function} options.onProgress - 进度回调，参数(index, position, progress)
   * @param {Function} options.onFinish - 完成回调
   * @returns {Object} - 返回控制对象 { start, stop }
   */
  createTrackStepByStep(path, options = {}) {
    if (!this.map || !this.AMap || !Array.isArray(path) || path.length < 2)
      return null;

    const interval = options.interval || 500;
    const mapInstance = this.map; // 保存地图实例的引用

    // 创建轨迹线 - 与 addTrack 保持一致的样式
    const polyline = new this.AMap.Polyline({
      path: [path[0]],
      strokeColor: "#fff", // 与 addTrack 一致的白色
      strokeWeight: 4,
      strokeOpacity: 1,
      lineJoin: "round",
      lineCap: "round",
      zIndex: 50,
    });
    mapInstance.add(polyline);

    // 创建起点标记 - 与 addTrack 一致的样式
    const startMarker = new this.AMap.Marker({
      position: path[0],
      icon: new this.AMap.Icon({
        image: null,
        size: new this.AMap.Size(16, 16),
      }),
      content: `<div style="
      width:16px;height:16px;
      background:#fff;
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 0 4px #888;
      "></div>`,
      offset: new this.AMap.Pixel(-8, -8),
      zIndex: 60,
    });
    mapInstance.add(startMarker);

    // 创建终点标记 - 先隐藏，等到最后一个点时显示
    const endMarker = new this.AMap.Marker({
      position: path[path.length - 1],
      icon: new this.AMap.Icon({
        image: null,
        size: new this.AMap.Size(22, 22),
      }),
      content: `<div style="
      width:22px;height:22px;
      background:#1890ff;
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 0 6px #1890ff;
      "></div>`,
      offset: new this.AMap.Pixel(-11, -11),
      zIndex: 61,
      visible: false, // 初始不可见
    });
    mapInstance.add(endMarker);

    // 创建当前移动点标记
    const currentMarker = new this.AMap.Marker({
      position: path[0],
      icon: new this.AMap.Icon({
        image: null,
        size: new this.AMap.Size(12, 12),
      }),
      content: `<div style="
      width:12px;height:12px;
      background:#1890ff;
      border-radius:50%;
      border:2px solid #fff;
      box-shadow:0 0 4px rgba(0,0,0,0.3);
      "></div>`,
      offset: new this.AMap.Pixel(-6, -6),
      zIndex: 100,
    });
    mapInstance.add(currentMarker);

    let currentIndex = 0;
    let timer = null;
    let isRunning = false;

    // 逐点添加
    const addNextPoint = () => {
      if (!isRunning) return;

      currentIndex++;

      // 判断是否结束
      if (currentIndex >= path.length) {
        // 显示终点标记
        endMarker.show();
        // 隐藏当前移动点
        currentMarker.hide();

        if (options.onFinish) options.onFinish();
        isRunning = false;
        return;
      }

      // 添加下一个点
      const currentPath = path.slice(0, currentIndex + 1);
      polyline.setPath(currentPath);
      currentMarker.setPosition(path[currentIndex]);

      // 调用进度回调
      if (options.onProgress) {
        const progress = currentIndex / (path.length - 1);
        options.onProgress(currentIndex, path[currentIndex], progress);
      }

      // 设置下一个点的定时器
      timer = setTimeout(addNextPoint, interval);
    };

    // 控制对象
    const controller = {
      start() {
        if (isRunning) return this;
        isRunning = true;
        timer = setTimeout(addNextPoint, interval);
        return this;
      },

      stop() {
        isRunning = false;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        return this;
      },

      destroy() {
        this.stop();
        // 使用保存的地图实例引用
        if (polyline && mapInstance) mapInstance.remove(polyline);
        if (startMarker && mapInstance) mapInstance.remove(startMarker);
        if (endMarker && mapInstance) mapInstance.remove(endMarker);
        if (currentMarker && mapInstance) mapInstance.remove(currentMarker);
        return this;
      },
    };

    // 保存到实例属性，便于后续管理
    if (!this.stepTracks) this.stepTracks = [];
    this.stepTracks.push({
      polyline,
      startMarker,
      endMarker,
      currentMarker,
      controller,
      path,
    });

    return controller;
  }

  /**
   * 清除所有逐点创建的轨迹
   */
  clearStepTracks() {
    if (!this.map || !this.stepTracks) return;

    this.stepTracks.forEach((track) => {
      track.controller.destroy();
    });

    this.stepTracks = [];
  }
  /**
   * 移除指定轨迹
   * @param {Object} trackObj - addTrack 返回的对象
   */
  removeTrack(trackObj) {
    if (!this.map || !trackObj) return;
    if (trackObj.polyline) this.map.remove(trackObj.polyline);
    if (trackObj.startMarker) this.map.remove(trackObj.startMarker);
    if (trackObj.endMarker) this.map.remove(trackObj.endMarker);
    if (this.tracks) {
      this.tracks = this.tracks.filter((t) => t !== trackObj);
    }
  }

  /**
   * 移除所有轨迹
   */
  clearTracks() {
    if (!this.map || !this.tracks) return;
    this.tracks.forEach((trackObj) => {
      if (trackObj.polyline) this.map.remove(trackObj.polyline);
      if (trackObj.startMarker) this.map.remove(trackObj.startMarker);
      if (trackObj.endMarker) this.map.remove(trackObj.endMarker);
    });
    this.tracks = [];
  }
  /**
   * 获取鼠标工具实例
   * @returns {Object} - MouseTool 实例
   */
  getMouseTool() {
    if (!this.map || !this.AMap) {
      console.warn("地图未初始化，请先调用initMap方法");
      return null;
    }

    if (!this.mouseTool) {
      this.mouseTool = new this.AMap.MouseTool(this.map);
    }

    return this.mouseTool;
  }

  /**
   * 开启绘制模式
   * @param {String} type - 绘制类型：marker/polyline/polygon/rectangle/circle
   * @param {Object} options - 绘制参数
   * @returns {Promise} - 返回绘制结果的Promise
   */
  draw(type, options = {}) {
    const mouseTool = this.getMouseTool();
    if (!mouseTool) return Promise.reject(new Error("MouseTool未初始化"));
    this.map.setDefaultCursor("crosshair");
    return new Promise((resolve) => {
      // 监听绘制完成事件
      mouseTool.on("draw", (event) => {
        resolve(event.obj);
      });

      // 根据类型开启对应的绘制模式
      switch (type) {
        case "marker":
          mouseTool.marker(options);
          break;
        case "polyline":
          mouseTool.polyline(options);
          break;
        case "polygon":
          mouseTool.polygon(options);
          break;
        case "rectangle":
          mouseTool.rectangle(options);
          break;
        case "circle":
          mouseTool.circle(options);
          break;
        default:
          mouseTool.close();
      }
    });
  }

  /**
   * 关闭绘制模式
   */
  closeDraw() {
    if (this.mouseTool) {
      this.map.setDefaultCursor("default");
      this.mouseTool.close();
    }
  }
  /**
   * 设置地图旋转角度
   * @param {Number} angle - 旋转角度，范围 [0-360]
   * @param {Boolean} animate - 是否使用动画效果
   * @param {Number} duration - 动画持续时间(毫秒)，默认300ms
   */
  setRotation(angle, animate = true, duration = 300) {
    if (!this.map) return;
    let currentRotation = this.map.getRotation();
    if (animate) {
      this.map.setRotation(currentRotation+=angle, true, duration);
    } else {
      this.map.setRotation(angle);
    }
  }

  /**
   * 获取当前地图旋转角度
   * @returns {Number} - 当前旋转角度
   */
  getRotation() {
    if (!this.map) return 0;
    return this.map.getRotation();
  }

  /**
   * 旋转地图到指定方向
   * @param {String} direction - 方向：'north'(正北), 'east'(正东), 'south'(正南), 'west'(正西)
   * @param {Boolean} animate - 是否使用动画效果
   */
  rotateToDirection(direction, animate = true) {
    if (!this.map) return;

    let angle = 0;
    switch (direction.toLowerCase()) {
      case "north":
        angle = 0;
        break;
      case "east":
        angle = 90;
        break;
      case "south":
        angle = 180;
        break;
      case "west":
        angle = 270;
        break;
      default:
        angle = 0;
    }

    this.setRotation(angle, animate);
  }

  /**
   * 启用/禁用地图旋转功能
   * @param {Boolean} enabled - 是否启用
   */
  enableRotation(enabled = true) {
    if (!this.map) return;

    if (enabled) {
      this.map.setStatus({
        rotateEnable: true,
      });
    } else {
      this.map.setStatus({
        rotateEnable: false,
      });
    }
  }
}

export default AMapService;
