# 开始

## 背景

要在 Vitepress 的 Markdown 中使用 Vue 组件，需要显式的从`.vue`文件中导入，就像这样：

MyInput.vue

```vue
<script setup>
import { ref } from "vue";
const msg = ref();
</script>

<template>
  <input v-model="msg" placeholder="please input" />
</template>
```

index.md

```markdown
<script setup>
import MyInput from "./MyInput.vue"
</script>

# Title

This is an input component.

<MyInput />
```

`MyInput.vue`本身的内容并不多，在某些场景下，比如文档站点的代码示例，内容简单，且只出现在特定的上下文里，大部分都不会再次出现。

但为了渲染出这个一次性的简单组件，确要单独创建文件，便显得有些多此一举了。

## 对比

`vitepress-plugin-sfc`允许你在markdown文件里直接写SFC，并像[代码组](https://vitepress.dev/zh/guide/markdown#code-groups)那样渲染展示出来。

以[背景](#背景)中的代码为例，看看在使用了本插件后有什么不一样的：

index.md

```markdown
# Title

This is an input component.

:::sfc
<script setup>
import { ref } from "vue"
const msg = ref();
</script>

<template>
    <input v-model="msg" placeholder="please input" />
</template>
:::
```

不再需要单独创建`MyInput.vue`文件，也不需要在`index.md`中显式的导入，仅通过内联`MyInput.vue`的内容，然后包裹到`sfc容器`中即可。
