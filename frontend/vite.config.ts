import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(({ mode }) => {
  // SDK build configuration
  if (mode === 'sdk') {
    return {
      plugins: [
        react(),
        cssInjectedByJsPlugin(), // Inject CSS into JS bundle
      ],
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/sdk.tsx'),
          name: 'VetChatbot',
          fileName: (format) => `vet-chatbot-sdk.${format}.js`,
          formats: ['umd'], // Universal Module Definition for browser
        },
        rollupOptions: {
          external: [], // Bundle everything (no external dependencies)
          output: {
            globals: {},
          },
        },
        outDir: 'dist-sdk',
        emptyOutDir: true,
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  // Default dev/build configuration
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
})
