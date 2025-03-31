import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'remove-bootstrap-source-map',
          Once (root) {
            root.walkComments(comment => {
              if (comment.text.includes('sourceMappingURL=bootstrap.min.css.map')) {
                comment.remove();
              }
            });
          }
        }
      ]
    }
  }
});
