import { defineConfig } from "vitepress";
import { sfcPlugin, sfcRegistryVitePlugin } from "vitepress-plugin-sfc";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vitepress-plugin-sfc",
  description: "vitepress-plugin-sfc plugin",
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/heroui-vue/vitepress-plugin-sfc",
      },
      {
        icon: "npm",
        link: "https://npmx.dev/package/vitepress-plugin-sfc",
      },
    ],
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    zh: {
      label: "简体中文",
      lang: "zh",
      link: "/zh/",
    },
    fr: {
      label: "Français",
      lang: "fr",
      link: "/fr/",
    },
  },
  markdown: {
    config: (md) => {
      md.use(sfcPlugin);
    },
  },
  vite: {
    plugins: [sfcRegistryVitePlugin()],
  },
});
