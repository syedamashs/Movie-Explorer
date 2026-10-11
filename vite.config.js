import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// CloudFront IPs for api.themoviedb.org to handle DNS-blocked ISPs
const tmdbAgent = new https.Agent({
  servername: 'api.themoviedb.org',
  lookup: (hostname, options, callback) => {
    const cb = typeof options === 'function' ? options : callback;
    const opts = typeof options === 'object' && options !== null ? options : {};
    if (opts.all) {
      cb(null, [
        { address: '99.84.152.32', family: 4 },
        { address: '99.84.152.53', family: 4 },
        { address: '99.84.152.85', family: 4 },
      ]);
    } else {
      cb(null, '99.84.152.32', 4);
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  base: '/Movie-Explorer/',
  plugins: [react()],
  server: {
    proxy: {
      '/tmdb-proxy': {
        target: 'https://api.themoviedb.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-proxy/, ''),
        agent: tmdbAgent,
        headers: {
          Host: 'api.themoviedb.org',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    }
  }
})

