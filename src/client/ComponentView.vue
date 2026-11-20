<script setup lang="ts">
import { inject, provide, computed, createCommentVNode, type Component } from "vue";
import { globalConfigSymbol, contextConfigSymbol } from "./index";
import defu from "defu";
import type { Config, ComponentViewProps } from "./index";
import GroupTabs from "./GroupTabs.vue";

interface Props extends ComponentViewProps {
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  render: "GroupTabs",
  disableRender: false,
  nativeIfNotRender: undefined,
  isolateStyles: undefined,
});

const globalConfig = inject<Config>(globalConfigSymbol);

const VitePressPluginSFCComment = computed(() =>
  createCommentVNode(`[vitepress-plugin-sfc] @name ${props.name}`),
);

const config = computed<Props>(() => {
  const resolveConfig = defu(props, globalConfig);
  const { render, nativeIfNotRender } = resolveConfig;
  let renderInstance: Component | boolean | undefined;
  if (render === "GroupTabs") {
    renderInstance = GroupTabs;
  } else if (nativeIfNotRender && !render) {
    renderInstance = true;
  } else if (!render) {
    console.error(
      `[vitepress-plugin-sfc] Unregistered component: ${render}.
      You can render content as-is by enabling the "nativeIfNotRender" parameter.`,
    );
  }
  return {
    ...resolveConfig,
    render: renderInstance,
  };
});

provide(contextConfigSymbol, config);
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
