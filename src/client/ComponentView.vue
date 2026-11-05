<script setup lang="ts">
import { inject, computed, createCommentVNode, type Component } from "vue";
import { configSymbol, type Config, type ComponentViewProps } from "./index";
import GroupTabs from "./GroupTabs.vue";

interface Props extends ComponentViewProps {
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disableRender: false,
});

const injectedConfig = inject<Config>(configSymbol);

const VitePressPluginSFCComment = computed(() =>
  createCommentVNode(`[vitepress-plugin-sfc] @name ${props.name}`),
);

const config = computed<Props>(() => {
  const { render, disableRender, nativeIfNotRender } = injectedConfig;
  const resolveConfig = {
    render: render || props.render,
    disableRender:
      disableRender === null || disableRender === undefined ? props.disableRender : disableRender,
  };

  let renderInstance: Component | boolean | undefined;
  if (resolveConfig.render === "GroupTabs") {
    renderInstance = GroupTabs;
  } else if (nativeIfNotRender && !resolveConfig.render) {
    renderInstance = true;
  } else if (!resolveConfig.render) {
    console.error(
      `[vitepress-plugin-sfc] Unregistered component: ${resolveConfig.render}.
      You can render content as-is by enabling the "nativeIfNotRender" parameter.`,
    );
  }
  return {
    ...resolveConfig,
    render: renderInstance,
  };
});
</script>

<template>
  <component :is="VitePressPluginSFCComment"></component>
  <slot v-if="!config.render || config.disableRender"></slot>
  <component v-else :is="config.render">
    <slot />
    <template #highlight>
      <slot name="highlight"></slot>
    </template>
  </component>
</template>

<style></style>
