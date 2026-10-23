import crypto from "node:crypto";
import markdownItContainer from "markdown-it-container";

import type Token from "markdown-it/lib/token.mjs";
import { type PluginSimple } from "markdown-it";
import {
  type MarkdownEnv,
  type MarkdownRenderer,
  type MarkdownOptions,
  type SfcBlock,
} from "vitepress";

const CONTAINER_NAME = "sfc";
const openFlag = `container_${CONTAINER_NAME}_open`;

export const SCRIPT_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/;
export const SFC_IMPORTER_RE = /^virtual:VP_SFC_/;

export function createDefaultSfcBlock(): SfcBlock {
  return {
    content: "<script setup>\n</script>",
    tagOpen: "<script setup>",
    type: "script",
    contentStripped: "\n",
    tagClose: "</script>",
  };
}

export function createVirtualImport(
  content: string,
): Pick<SFC, "hash" | "name" | "importer" | "renderedContent"> {
  const hash = toHash(content);
  const name = `VP_SFC_${hash}`;
  const importer = `virtual:${name}.vue`;
  const renderedContent =
    `// [vitepress-plugin-sfc] injected vue virtual imports` +
    `\n// REGION START\n` +
    `import ${name} from '${importer}'` +
    "\n// REGION END\n";
  return { hash, name, importer, renderedContent };
}

export interface SFC {
  name: string;
  hash: string;
  importer: string;
  content: string;
  renderedContent: string;
  markupParams: MarkupParams;
}

export interface MarkdownEnvExt extends MarkdownEnv {
  sfcs: SFC[];
  __matched_sfc_set__: Set<string>;
}

export interface MarkupParams {
  showSource: boolean;
  filepath?: string;
  component?: string;
}

function toHash(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function parseMarkupParams(params: string): MarkupParams {
  if (!params) {
    return {} as MarkupParams;
  }

  const arr = params.split(",");
  return Object.fromEntries(
    arr.map((item) => {
      const [, key, value] = (item.match(/([^=]+)=(.*)/) || []) as [
        any,
        keyof MarkupParams,
        string,
      ];
      if (item === "showSource" || (key === "showSource" && value === "true")) {
        return ["showSource", true];
      }
      return [key, value];
    }),
  );
}

function plugin(md: MarkdownRenderer) {
  // @ts-ignore
  md.use(markdownItContainer, CONTAINER_NAME, {
    validate: (params: string) => {
      return new RegExp(`^${CONTAINER_NAME}`).test(params.trim());
    },
    render: (tokens: Token[], idx: number, options: MarkdownOptions, env: MarkdownEnvExt) => {
      const { __matched_sfc_set__, sfcBlocks } = env;

      if (!sfcBlocks.scripts.length) {
        sfcBlocks.scripts.push(createDefaultSfcBlock());
      }

      const [validSfcBlock] = sfcBlocks.scripts ?? [];
      const token = tokens[idx];

      if (token.nesting === 1) {
        const { hash, name, content, renderedContent, markupParams } = token.meta.sfc as SFC;
        const hasHash = __matched_sfc_set__.has(hash);

        if (!hasHash) {
          const { tagOpen, tagClose, contentStripped } = validSfcBlock;
          const appendContentStripped = contentStripped + renderedContent;
          validSfcBlock.contentStripped = appendContentStripped;
          validSfcBlock.content = tagOpen + appendContentStripped + tagClose;
          __matched_sfc_set__.add(hash);
        }

        return markupParams.showSource
          ? `<ComponentView>\n` +
              `<template #v3><${name} /></template>\n` +
              `<template #highlight>${options.highlight(content, "vue", "")}</template>\n` +
              `</ComponentView>\n`
          : `<${name} />`;
      } else {
        return ``;
      }
    },
  });

  md.core.ruler.after("block", "extract_sfc", (state) => {
    const sourceLines = state.src.split("\n");
    const sfcs: SFC[] = state.env.sfcs || [];
    let currentOpenToken: Token | undefined;

    function toSFC(token: Token): SFC | undefined {
      const { type, nesting, map, info } = token;
      if (type !== openFlag || nesting !== 1 || !map) {
        return;
      }

      const [s, e] = map;
      const content = sourceLines.slice(s + 1, e).join("\n");
      const virtualImport = createVirtualImport(content);
      const [, params] = (info ?? "").split(" ");
      const sfc = { ...virtualImport, content, markupParams: parseMarkupParams(params) };
      return sfc;
    }

    for (const token of state.tokens) {
      const { map } = token;
      const sfc = toSFC(token);
      if (sfc) {
        currentOpenToken = token;
        token.meta = {
          ...token.meta,
          sfc,
        };

        const hasSameSFC = sfcs.some(({ name }) => sfc?.name === name);
        if (sfc && !hasSameSFC) {
          sfcs.push(sfc);
        }
      }

      if (currentOpenToken && currentOpenToken !== token) {
        const [pos] = map || [-1];
        const [min, max] = currentOpenToken.map;
        if (pos > min && pos < max) {
          token.content = "";
        } else {
          // container close flag
          currentOpenToken = undefined;
        }
      }
    }

    // inject the sfcs to markdown-it env
    const env = state.env as MarkdownEnvExt;
    env.sfcs = [...sfcs];
    env.__matched_sfc_set__ = new Set();
  });
}

export const sfcPlugin = plugin as PluginSimple;
