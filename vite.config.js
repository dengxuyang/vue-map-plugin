/*
 * @Author: dengxuyang
 * @Date: 2025-05-16 14:08:34
 * @LastEditors: 673303066@qq.com
 * @LastEditTime: 2025-05-16 14:30:53
 * @FilePath: /vue-map-plugin/vite.config.js
 * @Description: 配置打包
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'VueMapPlugin',
      fileName: (format) => `vue-map-plugin.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})