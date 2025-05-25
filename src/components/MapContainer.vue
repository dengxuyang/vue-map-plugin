<!--
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:18:48
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-19 19:28:22
 * @FilePath: /vue-map-plugin/src/components/MapContainer.vue
 * @Description: 地图容器组件
-->
<template>
  <div :id="containerId" class="map-container">
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, inject, provide } from "vue";

export default {
  name: "MapContainer",
  props: {
    containerId: {
      type: String,
      default: "map-container",
    },
    mapType: {
      type: String,
      default: "amap",
      validator: (value) => ["amap", "bmap", "google"].includes(value),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    
  },
  emits: ["map-loaded", "map-error"],
  setup(props, { emit }) {
    const mapService = inject("mapServiceFactory");
    const serviceInstance = ref(null);
    const mapInstance = ref(null);

    const initMap = async () => {
      try {
        serviceInstance.value = mapService.createService(props.mapType);
        mapInstance.value = await serviceInstance.value.initMap(
          props.containerId,
          props.config
        );
        emit("map-loaded", {
          map: mapInstance.value,
          service: serviceInstance.value,
        });
      } catch (error) {
        emit("map-error", error);
      }
    };

    onMounted(initMap);

    onBeforeUnmount(() => {
      if (serviceInstance.value && serviceInstance.value.destroyMap) {
        serviceInstance.value.destroyMap();
      }
    });

    watch(
      () => props.mapType,
      () => {
        initMap();
      }
    );

    return {
      mapInstance,
      serviceInstance,
    };
  },
};
</script>
<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
