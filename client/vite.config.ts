import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/routes',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
      react()
    ],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@socket": path.resolve(__dirname, "src/socket"),
        "@shared": path.resolve(__dirname, "src/shared"),
        "@modules": path.resolve(__dirname, "src/modules"),
        "@apis": path.resolve(__dirname, "src/apis"),
        "@routes": path.resolve(__dirname, "src/routes"),
        "@services": path.resolve(__dirname, "src/services"),
        "@stores": path.resolve(__dirname, "src/stores"),
        "@customTypes": path.resolve(__dirname, "src/customTypes"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@configs": path.resolve(__dirname, "src/configs"),
        "@lib": path.resolve(__dirname, "src/lib"),
      },
    },
  }
})

