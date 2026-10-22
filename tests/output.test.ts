import { expect, test } from "vitest";
import { createMarkdownRenderer, type MarkdownEnv } from "vitepress";
import { sfcPlugin, type MarkdownEnvExt } from "../src/node";
import { compile } from "vue";

// @ts-ignore
import index from "../playground/index.md?raw";

test("markdown to vue", async () => {
  const md = await createMarkdownRenderer("", {});
  md.use(sfcPlugin);

  const env = {} as MarkdownEnvExt;
  const html = await md.renderAsync(index, env);

  const sfcBlocks = env.sfcBlocks;

  const vueSrc = [
    ...(sfcBlocks?.scripts.map((item) => item.content) ?? []),
    `<template><div>${html}</div></template>`,
    ...(sfcBlocks?.styles.map((item) => item.content) ?? []),
    ...(sfcBlocks?.customBlocks.map((item) => item.content) ?? []),
  ].join("\n");

  console.log(vueSrc);
});
