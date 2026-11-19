import ComponentView from "./ComponentView.vue";
import type { Component } from "vue";
import type { EnhanceAppContext } from "vitepress";

export interface ComponentViewProps {
  render?: "GroupTabs" | "SourceCodeButton" | (string & {}) | Component | boolean;
  disableRender?: boolean;
  nativeIfNotRender?: boolean;
  isolateStyles?: boolean;
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

export const globalConfigSymbol = Symbol("__vitepress_plugin_sfc_config");
export const contextConfigSymbol = Symbol();

export function mergeProps<T extends Record<string, any> = Record<string, any>>(
  ...args: (T | null | undefined)[]
): T {
  const result = {} as T;

  for (const props of args) {
    if (props) {
      Object.assign(result, props);
    }
  }

  return result;
}

export async function enhanceAppWithComponentView(app: EnhanceAppContext["app"], config?: Config) {
  app.component("ComponentView", ComponentView);

  if (app) {
    app.provide(globalConfigSymbol, config);
  } else {
    throw new Error(
      "[vitepress-plugin-sfc] The `useConfig` must be called within a Vue component if not providing an app",
    );
  }
}
