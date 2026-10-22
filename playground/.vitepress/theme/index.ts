import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from "vitepress-plugin-sfc/client";
import type { Theme } from "vitepress";

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app, {
      localeMappings: {},
    });
  },
};

export default theme;
