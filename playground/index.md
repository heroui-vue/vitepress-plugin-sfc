# Demo

::: tip
This is a tip.
:::

Renders a tab bar displaying a **Preview** and **Source Code**; the preview result is a counter button.

:::sfc showSource
<script setup lang="ts">
import { ref } from "vue";

const counter = ref(0);
const pressed = ref(false);
</script>

<template>
    <button
        @click="counter++"
    >
        Counter: {{ counter }}
    </button>
</template>
:::

This is achieved using the following code:

```markdown
:::sfc
<script setup lang="ts">
import { ref } from "vue";

const counter = ref(0);
const pressed = ref(false);
</script>

<template>
    <button
        @click="counter++"
    >
        Counter: {{ counter }}
    </button>
</template>
:::
```

`vitepress-plugin-sfc` strives to adapt to VitePress themes as closely as possible. You can switch themes via the navigation bar and then observe the changes within the tabs.
