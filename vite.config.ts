import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
<<<<<<< HEAD
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:18322',
        changeOrigin: true,
        // לוקח את /api/GetOperatorsUi והופך אותו ל- /GetOperatorsUi עבור השרת ב-18322
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
=======
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:18322",
        changeOrigin: true,
        secure: false,
        followRedirects: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
>>>>>>> b09087bb10ea6e1ede6f9cb2ab2740a07356c536
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
}));
=======
}));
>>>>>>> b09087bb10ea6e1ede6f9cb2ab2740a07356c536
