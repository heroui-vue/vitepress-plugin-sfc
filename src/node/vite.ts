import { sfcPlugin, SFC_IMPORTER_RE, type SFC } from "./markdown"
import type MarkdownIt from "markdown-it";
import type { Plugin } from "vitepress"

interface PluginOptions {
  md: MarkdownIt;
}

export function sfcRegistryVitePlugin(options: PluginOptions): Plugin {
  const { md } = options || {}
  const sfcMap = new Map()

  return {
    name: 'vite-plugin-sfc-registry',
    enforce: "pre",
    resolveId: {
      order: "pre",
      filter: { id: new RegExp(SFC_IMPORTER_RE, "gi") },
      handler(id) {
        if (sfcMap.has(id)) {
          return id
        }
      }
    },
    load: {
      order: "pre",
      filter: { id: new RegExp(SFC_IMPORTER_RE, "gi") },
      handler(id) {
        if (sfcMap.has(id)) {
          return sfcMap.get(id)
        }
      }
    },
    transform(code, id) {
      if (/.md$/gi.test(id)) {
        const env = {} as { sfcs: SFC[] }
        md.use(sfcPlugin, { render: false }).render(code, env)
        const sfcs: SFC[] = env.sfcs || []
        for (const { importer, content } of sfcs) {
          sfcMap.set(importer, content)
        }
      }
    }
  }
}
