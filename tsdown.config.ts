import { defineConfig } from "tsdown/config";
import vue from "unplugin-vue/rolldown";

export default defineConfig({
  format: "esm",
  platform: "node",
  entry: {
    index: "src/node/index.ts",
    client: "src/client/index.ts",
  },
  plugins: [vue()],
  alias: {
    "@": "src/",
  },
  deps: {
    neverBundle: ["vue", "vitepress"],
  },
});
