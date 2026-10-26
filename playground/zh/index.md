# 快速开始

`vitepress-plugin-sfc`能让你在Markdown文件中书写Vue SFC并在Vitepress上渲染出来。

## 安装

```shell
npm install -D vitepress-plugin-sfc
```

## 配置

在`.vitepress/config.ts`和`.vitepress/theme/index.ts`中配置：

::: code-group
```ts [.vitepress/config.ts]
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

```ts [.vitepress/theme/index.ts]
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from "vitepress-plugin-sfc/client";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app);
  },
};
```
:::

## 使用

将**合法的**Vue SFC内容用`:::sfc`和`:::`包裹起来：

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

## 功能

### 禁用默认渲染

`vitepress-plugin-sfc`默认会使用一个类似于[Vitepress 代码组](https://vitepress.dev/zh/guide/markdown#code-groups)的组件来渲染Vue SFC，它由**预览**和**源码**（可配置）两个**可切换**的tab组成。

要禁用此行为，可通过块标记参数或者全局配置实现

#### 通过块标记参数

添加参数`disableRender`到`:::sfc`，就像这样

```markdown
:::sfc disableRender
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
    <input v-model="msg" placeholder="请输入" />
</template>
:::
```

组件将按原样渲染：

:::sfc disableRender
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
    <input v-model="msg" placeholder="请输入" />
</template>
:::

::: tip
`disableRender=true`也会生效，除此以外，其它形式会被认为无效。
:::

#### 通过全局配置

在`.vitepress/theme/index.ts`中配置：

::: code-group
```ts [.vitepress/theme/index.ts]
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from "vitepress-plugin-sfc/client";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app, {
      disableRender: true,
    });
  },
};
```
:::
