<script setup lang="ts">
import { inject, computed, getCurrentInstance, withDefaults, type Component } from "vue";
import { configSymbol, type Config, type ComponentViewProps } from "./index";

interface Props extends Omit<ComponentViewProps, "render"> {
  render: Component | undefined;
}

const props = withDefaults(defineProps<ComponentViewProps>(), {
  disableRender: false,
});

const config = computed<Props>(() => {
  const { render, disableRender } = inject<Config>(configSymbol);
  const resolveConfig = {
    render: render || props.render,
    disableRender:
      disableRender === null || disableRender === undefined ? props.disableRender : disableRender,
  };

  const renderInstance = getCurrentInstance().appContext.app.component(
    resolveConfig.render as string,
  );
  if (!renderInstance) {
    console.warn(`[vitepress-plugin-sfc] Unregistered component: ${resolveConfig.render}`);
  }
  return {
    ...resolveConfig,
    render: renderInstance,
  };
});
</script>

<template>
  <div>
    <slot v-if="!config.render || config.disableRender"></slot>
    <component v-else :is="config.render">
      <slot />
      <template #highlight>
        <slot name="highlight"></slot>
      </template>
    </component>
  </div>
</template>

<style></style>
