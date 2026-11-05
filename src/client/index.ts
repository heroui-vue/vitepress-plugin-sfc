import ComponentView from "./ComponentView.vue";
import type { Component } from "vue";
import type { EnhanceAppContext } from "vitepress";

export interface ComponentViewProps {
  render?: "GroupTabs" | "SourceCodeButton" | (string & {}) | Component | boolean;
  disableRender?: boolean;
  nativeIfNotRender?: boolean;
}

export interface GroupTabsProps {
  locale?: Record<string, { label: { preview: string; code: string } }>;
}

// export interface SourceCodeButtonProps {
//   icon: string;
// }

export type Config = ComponentViewProps & {
  groupTabs?: GroupTabsProps;
};

export const configSymbol = Symbol("__vitepress_plugin_sfc_config");

const DEFUALT_CONFIG: Config = {
  render: "GroupTabs",
};

export async function enhanceAppWithComponentView(app: EnhanceAppContext["app"], config?: Config) {
  app.component("ComponentView", ComponentView);

  const resolvedConfig = { ...DEFUALT_CONFIG, ...config };

  if (app) {
    app.provide(configSymbol, resolvedConfig);
  } else {
    throw new Error(
      "[vitepress-plugin-sfc] The `useConfig` must be called within a Vue component if not providing an app",
    );
  }

  const { disableRender } = resolvedConfig;
  if (disableRender) {
    return;
  }
}
