import ComponentView from "./ComponentView.vue";
import type { EnhanceAppContext } from "vitepress";

export interface ComponentViewProps {
  render?: "GroupTabs" | "SourceCodeButton" | (string & {});
  disableRender?: boolean;
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

  const { render, disableRender } = resolvedConfig;
  if (disableRender) {
    return;
  }

  if (render === "GroupTabs") {
    const importer = await import("./GroupTabs.vue");
    app.component("GroupTabs", importer.default);
  }
}
