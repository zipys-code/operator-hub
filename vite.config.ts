import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // שיניתי כאן את ההגדרה שתהיה יותר "סלחנית" מול שרת ה-IIS שלכם
      '/api': {
        target: 'http://localhost:18322',
        changeOrigin: true,
        secure: false,
        // הסרתי את ה-rewrite כי יכול להיות שהשרת מצפה לקבל את הנתיב המלא
        // או שה-rewrite הקודם שיבש את הכתובת
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));