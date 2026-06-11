import { defineConfig } from 'vite';
import { resolve } from 'path';

// Custom plugin to serve .html files for clean URLs (no .html extension)
const cleanUrls = () => ({
  name: 'clean-urls',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // If the request doesn't have an extension and isn't the root, append .html
      if (req.url && !req.url.includes('.') && req.url !== '/') {
        req.url += '.html';
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html')
      }
    }
  }
});
