# Vitepress Plugin SFC

[文档](https://vitepress-plugin-sfc-playgrou.vercel.app/)

让你在Markdown文件中书写Vue SFC并在Vitepress上渲染出来。

## 安装

```shell
npm install -D vitepress-plugin-sfc
```

## 配置

在`.vitepress/config.ts`中配置：

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

## 使用

将**合法的**Vue SFC内容用`:::sfc`包裹起来：

```markdown
:::sfc
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
    <input v-model="msg" placeholder="请输入" />
</template>
:::
```

[MIT](LICENSE)
