<script setup>
const version = VITEPRESS_PLUGIN_SFC_VERSION
</script>

# 快速开始

`vitepress-plugin-sfc`能让你在Markdown文件中书写Vue SFC并在Vitepress上渲染出来。

## 安装

```shell-vue
npm install -D vitepress-plugin-sfc@{{ version }}
```

## 配置

在`.vitepress/config.ts`和`.vitepress/theme/index.ts`中配置：

::: code-group
```ts [.vitepress/config.ts]
import { defineConfig } from "vitepress";
import { sfcPlugin, sfcVitePlugin } from "vitepress-plugin-sfc";

export default defineConfig({
  // ...其他配置
  markdown: {
    config: (md) => {
      md.use(sfcPlugin);
    },
  },
  vite: {
    plugins: [sfcVitePlugin()],
    ssr: {
      noExternal: ["vitepress-plugin-sfc"],
    },
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

::: details 为什么需要`noExternal: ["vitepress-plugin-sfc"]`?
`vitepress-plugin-sfc` 部分内置组件依赖 [运行时API](https://vitepress.dev/zh/reference/runtime-api#runtime-api) 读取某些数据(比如 `lang` )，在运行 `vitepress build` 时，`vitepress-plugin-sfc` 需要进入到vitrepss的SSR构建流程，而不是被当成一个普通的nodejs依赖。更多上下文：

- [VitePress Issue #2987](https://github.com/vuejs/vitepress/issues/2987)
- [Nólëbase Integrations Issue
  ](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/vitepress-plugin-enhanced-readabilities)
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

可通过块标记参数配置和全局配置来启用或者禁用功能，块标记参数之间通过`,`分割。所有支持的块标记参数同样可以在全局配置中使用，当同时使用两者时，块标记参数配置具有更高的优先级。

### 禁用默认渲染

`vitepress-plugin-sfc`默认会使用一个类似于[Vitepress 代码组](https://vitepress.dev/zh/guide/markdown#code-groups)的内置[GroubTab组件](#)来渲染Vue SFC，它由**预览**和**源码**两个可切换的tab组成。

要禁用此行为，可通过块标记参数 `disableRender`

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

::: tip
块标记参数会像Vue Props一样被解析，这意味着`boolean`类型的参数可以裸声明。
:::

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

### 样式隔离

内联的SFC会受到Vitepress的默认样式影响，即使是通过外部导入的组件也是如此。`vitepress-plugin-sfc`提供`isolateStyles`参数来避免这种情况。

```markdown
:::sfc isolateStyles
<template>
  <input placeholder="请输入" />
</template>
:::
```

在内部，`isolateStyles`会添加一个`vp-raw` html class属性，`vitepress`会通过它来实现样式隔离，在此之前，你还需要安装`postcss`

```shell-vue
npm add -D postcss
```

然后配置`postcss.config.mjs`

```js
import { postcssIsolateStyles } from "vitepress";

export default {
  plugins: [
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/, /base\.css/],
    }),
  ],
};
```

渲染后效果：

:::sfc isolateStyles
<template>
  <input placeholder="请输入" />
</template>
:::

如果同时声明了`disableRender`，`isolateStyles`将不会生效

```markdown
:::sfc disableRender,isolateStyles
<template>
  <input placeholder="请输入" />
</template>
:::
```

渲染效果：

:::sfc isolateStyles,disableRender
<template>
  <input placeholder="请输入" />
</template>
:::

要实现样式隔离，你需要手动添加`vp-raw` html class属性

```markdown
:::sfc disableRender,isolateStyles
<template>
  <input class="vp-raw" placeholder="请输入" />
</template>
:::
```

添加后渲染效果：

:::sfc isolateStyles,disableRender
<template>
  <input class="vp-raw" placeholder="请输入" />
</template>
:::

::: tip
注意，你仍然需要安装并配置`postcss`
:::
