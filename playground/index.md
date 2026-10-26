# Quick Start

`vitepress-plugin-sfc` allows you to write Vue SFCs (Single-File Components) within Markdown files and render them in VitePress. ## Installation

```shell
npm install -D vitepress-plugin-sfc
```

## Configuration

Configure it in `.vitepress/config.ts` and `.vitepress/theme/index.ts`:

::: code-group
```ts [.vitepress/config.ts]
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

## Usage

Wrap **valid** Vue SFC content with `:::sfc` and `:::`:

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

The component will be rendered as expected:

:::sfc
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::

## Features

### Disabling Default Rendering

By default, `vitepress-plugin-sfc` uses a component—similar to [VitePress Code Groups](https://vitepress.dev/guide/markdown#code-groups)—to render Vue components. The SFC component consists of two switchable tabs: **Preview** and **Source Code** (which can be configured).

You can disable this behavior either via a block-level parameter or through global configuration.

#### Via a block-level parameter

Add the `disableRender` parameter to the `:::sfc` block, like this:

```markdown
:::sfc disableRender
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::
```

The component will be rendered as is:

:::sfc disableRender
<script setup>
import { ref } from "vue"
const msg = ref("");
</script>

<template>
<input v-model="msg" placeholder="Please enter text" />
</template>
:::

::: tip
Setting `disableRender=true` also works; any other format will be considered invalid.
:::

#### Via global configuration

Configure it in `.vitepress/theme/index.ts`:

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
