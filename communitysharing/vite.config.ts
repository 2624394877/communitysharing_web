import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量加载
  const env = loadEnv(mode, process.cwd())
  return {
    base: '/',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver(), VantResolver()],
        dts: 'src/types/auto-imports.d.ts' // 自动导入类型声明
      }),
      Components({
        resolvers: [ElementPlusResolver(), VantResolver()],
        dts: 'src/types/components.d.ts' // 组件类型声明
      }),
      // 打包分析插件（仅生产环境）
      mode === 'production' && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // 浏览器兼容插件
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ],
    // 构建配置
    build: {
      target: 'es2015', // 编译目标
      outDir: 'dist',  // 输出目录
      assetsDir: 'assets', // 静态资源目录
      sourcemap: env.VITE_SOURCEMAP === 'true', // 按需开启
      minify: 'terser', // 压缩方式
      cssCodeSplit: true, // CSS代码分割

      // Rollup配置
      rollupOptions: {
        output: {
          // 代码分割策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            if (id.includes('src/router')) {
              return 'router'
            }
          },
          // 文件命名规则
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]'
        },
        // 外部依赖排除（如有需要）
        // external: ['some-cdn-library']
      },

      // Terser压缩配置
      terserOptions: {
        compress: {
          drop_console: true,  // 移除console
          drop_debugger: true  // 移除debugger
        },
        format: {
          comments: false // 移除注释
        }
      }
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'),
        vue: 'vue/dist/vue.esm-bundler.js'
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/styles/variables.less";`,
          javascriptEnabled: true,
        }
      }
    },
    optimizeDeps: {
      include: ['oh-vue-icons/icons']
    },
  }
})
