import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

const httpsConfig = fs.existsSync('.certs/key.pem')
  ? { key: fs.readFileSync('.certs/key.pem'), cert: fs.readFileSync('.certs/cert.pem') }
  : false

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    https: httpsConfig
  }
})
