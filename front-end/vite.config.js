import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  define: {
    global: "window", // 🔥 FIX for sockjs-client
  },

  resolve: {
    alias: {
      process: "process/browser",
      buffer: "buffer",
    },
  },

  optimizeDeps: {
    include: ["sockjs-client"],
  },
});
