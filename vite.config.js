import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

export default defineConfig({
  base: '/directors-mind/', // 确保这里的名字和你的仓库名完全一致
  // ...其他配置
})
