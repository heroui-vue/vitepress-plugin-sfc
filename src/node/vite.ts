import { sfcPlugin, SFC_IMPORTER_RE, type SFC, type MarkdownEnvExt } from "./markdown";
import { createMarkdownRenderer, type Plugin } from "vitepress";

export async function sfcRegistryVitePlugin(): Promise<Plugin> {
  const md = await createMarkdownRenderer("", { html: true });
  md.use(sfcPlugin);
  const sfcMap = new Map();

  return {
    name: "vite-plugin-sfc-registry",
    enforce: "pre",
    resolveId: {
      filter: { id: new RegExp(SFC_IMPORTER_RE, "gi") },
      handler(id) {
        if (sfcMap.has(id)) {
          return id;
        }
      },
    },
    load: {
      filter: { id: new RegExp(SFC_IMPORTER_RE, "gi") },
      handler(id) {
        if (sfcMap.has(id)) {
          return sfcMap.get(id);
        }
      },
    },
    transform(code, id) {
      if (/.md$/gi.test(id)) {
        const env = {} as MarkdownEnvExt;
        md.render(code, env);

        const sfcs: SFC[] = env.sfcs || [];
        for (const { importer, content } of sfcs) {
          sfcMap.set(importer, content);
        }
      }
    },
  };
}
