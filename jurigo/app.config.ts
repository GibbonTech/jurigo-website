import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  vite: {
    plugins: [viteTsConfigPaths(), viteReact()],
  },
  server: {
    preset: "node-server",
  },
});
