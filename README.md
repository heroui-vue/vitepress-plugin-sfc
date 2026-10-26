# VitePress Plugin SFC

[Documentation](https://vitepress-plugin-sfc-playgrou.vercel.app/) | [中文](README-zh-CN.md)

Allows you to write Vue SFC within Markdown files and render them in VitePress.

## Install

```shell
npm install -D vitepress-plugin-sfc@latest
```

## Configuration

Configure it in `.vitepress/config.ts` and `.vitepress/theme/index.ts`:

`.vitepress/config.ts`

```ts
import { defineConfig } from "vitepress";
import { sfcPlugin, sfcRegistryVitePlugin } from "vitepress-plugin-sfc";

export default defineConfig({
  // ...其他配置
  markdown: {
    config: (md) => {
      md.use(sfcPlugin);
    },
  },
  vite: {
    plugins: [sfcRegistryVitePlugin()],
  },
});
```

`.vitepress/theme/index.ts`

```ts
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from "vitepress-plugin-sfc/client";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app);
  },
};
```

## Usage

Wrap **valid** Vue SFC content with `:::sfc`:

```markdown
:::sfc
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::
```

[MIT](LICENSE)
