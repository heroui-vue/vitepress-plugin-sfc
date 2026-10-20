<script setup>
import Button from '../Button.vue'
</script>

# 使用

`vitepress-plugin-sfc`能让你在Markdown文件中书写Vue SFC并在Vitepress上渲染出来。

## 安装

```shell
npm install -D vitepress-plugin-sfc
```

## 配置

在`.vitepress/config.ts`中配置：

::: code-group
```ts [config.ts]
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
:::

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

组件会正常渲染：

:::sfc
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
    <input v-model="msg" placeholder="请输入" />
</template>
:::

### 内置的渲染组件

`vitepress-plugin-sfc`内置了一个类似于[Vitepress 代码组](https://vitepress.dev/zh/guide/markdown#code-groups)的渲染组件，它由**预览**和**源码**（可配置）两个**可切换**的tab组成。

要启用它，需要在`.vitepress/theme/index.ts`中配置：

::: code-group
```ts [index.ts]
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from "vitepress-plugin-sfc/client";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app, {
      localeMappings: {},
    });
  },
};
```
:::

然后添加参数`showSource`或者`showSource=true`，这将渲染为以下效果：

:::sfc showSource
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
    <input v-model="msg" placeholder="请输入" />
</template>
:::

### 选项

~待定~

### 示例
