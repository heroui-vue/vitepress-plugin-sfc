import { test, describe, expect } from "vitest";
import { createMarkdownRenderer } from "vitepress";
import {
  sfcPlugin,
  createDefaultSfcBlock,
  createVirtualImport,
  type MarkdownEnvExt,
} from "../src/node";

describe("the plugin", async () => {
  const md = await createMarkdownRenderer("");
  md.use(sfcPlugin);

  test("inject a default script if no script exists", async () => {
    const env = {} as MarkdownEnvExt;
    const src = "hello";
    await md.renderAsync(`no script \n:::sfc\n${src}\n:::`, env);

    const { sfcBlocks, sfcs } = env;
    expect(sfcs.length).toBe(1);
    expect(sfcBlocks!.scripts.length).toBe(1);
    const { renderedContent } = createVirtualImport(src);
    const { contentStripped } = createDefaultSfcBlock();
    expect(sfcBlocks?.scripts[0].contentStripped).toBe(contentStripped + renderedContent);
  });

  test("script and import", async () => {
    const env = {} as MarkdownEnvExt;
    const sfc = "<template>hello</template>";
    const rootImport = "import {} from 'vue'";

    await md.renderAsync(
      `<script setup>${rootImport}</script>\n:::sfc\n${sfc}\n:::\n:::sfc\n${sfc}\n:::`,
      env,
    );

    const { sfcBlocks, sfcs } = env;
    expect(sfcBlocks!.scripts.length).toBe(1);
    // these are same sfcs will be merged.
    expect(sfcs.length).toBe(1);

    const { renderedContent } = createVirtualImport(sfc);
    const { contentStripped } = sfcBlocks!.scripts[0];
    expect(contentStripped).toBe(rootImport + renderedContent);
  });
});
