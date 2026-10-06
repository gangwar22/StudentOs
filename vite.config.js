import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const { PORT = '5001' } = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${PORT}`,
          changeOrigin: true,
          configure(proxy) {
            proxy.on('error', (_error, _request, response) => {
              if (!response || !('writeHead' in response) || response.headersSent) return;
              response.writeHead(503, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                success: false,
                error: 'StudentOS API is unavailable. Start the app with npm run dev, or start the backend with npm run server.'
              }));
            });
          }
        }
      }
    }
  };
})
