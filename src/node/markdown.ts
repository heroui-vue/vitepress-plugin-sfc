import markdownItContainer from "markdown-it-container";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";

import type Token from "markdown-it/lib/token.mjs";
import type MarkdownIt from "markdown-it";
import { type PluginWithOptions } from "markdown-it";

const CONTAINER_NAME = "sfc";

export const SCRIPT_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/
export const SFC_IMPORTER_RE = /^virtual:VP_SFC_/

export interface SFC {
  name: string;
  content: string;
  hash: string;
  importer: string;
}

interface PluginOptions {
  render?: boolean
}

function toHash(content: string) {
  return crypto
    .createHash('md5')
    .update(content)
    .digest('hex');
}

function plugin(md: MarkdownIt, options?: PluginOptions) {
  const { render = true } = options || {}
  // @ts-ignore
  md.use(markdownItContainer, CONTAINER_NAME, {
    validate: (params: string) => {
      return new RegExp(`^${CONTAINER_NAME}`).test(params.trim());
    },
    render: (tokens: Token[], idx: number) => {
      if (!render) {
        return
      }
      const token = tokens[idx];

      if (token.nesting === 1) {
        const { content, name }: SFC = token.meta?.sfc || {}
        const highlightContent =
          md.options.highlight?.(content, "vue", "") ?? "";
        const t = `<template #v3><${name} /></template>`
        return `<ComponentView highlightedSrc="${Buffer.from(highlightContent).toString("base64")}">\n${t}`;
      } else {
        return `</ComponentView>`;
      }
    },
  });

  md.core.ruler.after('normalize', 'inject_script', (state) => {
    const injectedScript = `\n<script setup></script>\n`
    // if the `.md` file has no script
    if (!new RegExp(SCRIPT_RE, "gi").test(state.src)) {
      // add script after the `frontmatter`
      // see: https://vitepress.dev/guide/using-vue#script-and-style
      const res = state.src.replace(/---([\s\S]*?)---/gi, (val) => {
        return val + injectedScript
      })
      state.src = res === state.src ? res + injectedScript : res
    }
  });

  md.core.ruler.after("block", "sfc_extract_and_import", (state) => {
    const openFlag = `container_${CONTAINER_NAME}_open`
    const sourceLines = state.src.split(/\r?\n/);

    const sfcs: SFC[] = []
    let rootScriptToken: Token | undefined
    let currentOpenToken: Token | undefined

    const extractSFC = (token: Token, onMatch?: (sfc: SFC) => void): SFC | undefined => {
      const { type, nesting, map } = token
      if (
        type !== openFlag || nesting !== 1 || !map
      ) {
        return;
      }

      const [startLine, endLine] = map;
      const content = sourceLines.slice(startLine + 1, endLine).join("\n");
      const hash = toHash(content)
      const name = `VP_SFC_${hash}`
      const importer = `virtual:${name}.vue`
      if (!SFC_IMPORTER_RE.test(importer)) {
        throw new Error(`[vitepress-plugin-sfc] Plugin-self Error: Unmatched importer syntax`)
      }
      const sfc = { content, name, hash, importer }
      onMatch?.(sfc)
      return sfc
    }

    for (const token of state.tokens) {
      const { type, content, map } = token
      if (!rootScriptToken && type === "html_block" && new RegExp(SCRIPT_RE, "i").test(content)) {
        rootScriptToken = token
      }
      const sfc = extractSFC(token, (_sfc) => {
        token.meta = {
          ...(token.meta ?? {}),
          sfc: _sfc
        }
        currentOpenToken = token
      })
      sfc && sfcs.push(sfc)

      if (currentOpenToken && currentOpenToken !== token) {
        const [pos] = map || [-1]
        const [min, max] = currentOpenToken.map
        if (pos > min && pos < max) {
          token.content = ""
        } else {
          // container close flag
          currentOpenToken = undefined
        }
      }
    }

    // inject the sfcs to markdown-it env
    state.env.sfcs = sfcs

    const sfcImports = sfcs
      .map(({ name, importer }) => `import ${name} from '${importer}'`)
      .join("\n")
    if (sfcImports && rootScriptToken) {
      rootScriptToken.content = rootScriptToken.content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/i, (match, innerContent) => {
        return match.replace(innerContent, `\n${sfcImports}\n`  + innerContent);
      })
    }
  });
};

export const sfcPlugin = plugin as PluginWithOptions<PluginOptions>
