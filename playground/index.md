# Quick Start

`vitepress-plugin-sfc` allows you to write Vue SFCs (Single File Components) within Markdown files and render them in VitePress.

## Installation

```shell
npm install -D vitepress-plugin-sfc
```

## Configuration

Configure it in `.vitepress/config.ts`:

::: code-group
```ts [config.ts]
import { defineConfig } from "vitepress";
import { sfcPlugin, sfcRegistryVitePlugin } from "vitepress-plugin-sfc";

export default defineConfig({
  // ...other configurations
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

The component will render as expected:

:::sfc
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::

## Built-in Rendering Component

`vitepress-plugin-sfc` includes a built-in rendering component—similar to [VitePress Code Groups](https://vitepress.dev/guide/markdown#code-groups)—that provides switchable tabs for the **preview** and the **source code** (configurable). To enable it, you need to configure it in `.vitepress/theme/index.ts`:

::: code-group
```ts [index.ts]
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

Then, add the `showSource` parameter to `:::sfc`—like this: `:::sfc showSource`—which will render as follows:

:::sfc showSource
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::

::: tip
Using `showSource=true` also works; any other format will be considered invalid.
:::
