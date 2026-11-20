<script setup>
const version = VITEPRESS_PLUGIN_SFC_VERSION
</script>

# Quick Start

`vitepress-plugin-sfc` allows you to write Vue SFCs (Single-File Components) within Markdown files and render them in VitePress.

## Installation

```shell-vue
npm install -D vitepress-plugin-sfc@{{ version }}
```

## Configuration

Configure it in `.vitepress/config.ts` and `.vitepress/theme/index.ts`:

::: code-group
```ts [.vitepress/config.ts]
import { defineConfig } from "vitepress";
import { sfcPlugin, sfcVitePlugin } from "vitepress-plugin-sfc";

export default defineConfig({
  // ...other configurations
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

::: details Why is `noExternal: ["vitepress-plugin-sfc"]` required?
Some built-in components in `vitepress-plugin-sfc` rely on [Runtime APIs](https://vitepress.dev/reference/runtime-api#runtime-api) to access specific data (such as `lang`). When running `vitepress build`, `vitepress-plugin-sfc` must be included in the VitePress SSR build process, rather than being treated as a standard Node.js dependency. For more context, see:

- [VitePress Issue #2987](https://github.com/vuejs/vitepress/issues/2987)
- [Nólëbase Integrations Issue](https://nolebase-integrations.ayaka.io/pages/zh-CN/integrations/vitepress-plugin-enhanced-readabilities)
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

Features can be enabled or disabled through block parameters or global configuration. Separate block parameters with commas (`,`). All supported block parameters can also be used in the global configuration. When both are set, block parameters take precedence.

### Disabling Default Rendering

By default, `vitepress-plugin-sfc` uses the built-in [GroubTab component](#), similar to [VitePress Code Groups](https://vitepress.dev/guide/markdown#code-groups), to render Vue SFCs. It consists of two switchable tabs: **Preview** and **Source Code**.

To disable this behavior, add the `disableRender` block parameter:

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

::: tip
Block parameters are parsed like Vue props, which means `boolean` parameters can be declared without a value.
:::

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

### Style Isolation

Inline SFCs are affected by VitePress's default styles, as are externally imported components. `vitepress-plugin-sfc` provides the `isolateStyles` parameter to prevent this.

```markdown
:::sfc isolateStyles
<template>
  <input placeholder="Please enter text" />
</template>
:::
```

Internally, `isolateStyles` adds the `vp-raw` HTML class, which VitePress uses to isolate styles. First, install `postcss`:

```shell-vue
npm add -D postcss
```

Then configure `postcss.config.mjs`:

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

The rendered result:

:::sfc isolateStyles
<template>
  <input placeholder="Please enter text" />
</template>
:::

If `disableRender` is also set, `isolateStyles` has no effect:

```markdown
:::sfc disableRender,isolateStyles
<template>
  <input placeholder="Please enter text" />
</template>
:::
```

The rendered result:

:::sfc isolateStyles,disableRender
<template>
  <input placeholder="Please enter text" />
</template>
:::

To isolate styles, add the `vp-raw` HTML class manually:

```markdown
:::sfc disableRender,isolateStyles
<template>
  <input class="vp-raw" placeholder="Please enter text" />
</template>
:::
```

The rendered result after adding the class:

:::sfc isolateStyles,disableRender
<template>
  <input class="vp-raw" placeholder="Please enter text" />
</template>
:::

::: tip
You still need to install and configure `postcss`.
:::
