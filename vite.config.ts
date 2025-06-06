import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(()=>{

  return{
    server: {
        host: '0.0.0.0',
        port: 5173,
        // https: true, // If you want HTTPS
        watch: {
            usePolling: true
        }
    },
    plugins: [react()],

    build: {
        // target: 'es2015',  // Ensures compatibility with async/await
        rollupOptions: {
            input: {
                main: 'index.html',
            }
        }
    },
    esbuild: {
        target: 'es2021'  // Ensures regenerator support in esbuild
    }
  }
})
