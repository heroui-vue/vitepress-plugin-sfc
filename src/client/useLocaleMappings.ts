import { provide, inject, getCurrentInstance } from "vue";
import type { App } from "vue";

export type LocaleMappings = Record<string, { previewLabel: string; codeLabel: string }>;

const localeMappingSymbol = Symbol("__vitepress_plugin_component_localeMapping");

/**
 * Initialize locale mappings for the application.
 * @param app - The Vue application instance. If not provided, the mappings will be provided to the current component.
 */
export function useLocaleMappings(app?: App) {
  return {
    set: (localeMapping: LocaleMappings) => {
      const instance = getCurrentInstance();
      if (app) {
        app?.provide(localeMappingSymbol, localeMapping);
      } else {
        if (!instance) {
          throw new Error(
            "useLocaleMappings must be called within a Vue component if not providing an app",
          );
        }
        provide(localeMappingSymbol, localeMapping);
      }
    },
    get: () => {
      return inject<LocaleMappings | undefined>(localeMappingSymbol, undefined);
    },
  };
}
