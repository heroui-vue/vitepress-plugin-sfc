import { expect, test } from "vitest";
import { SFC_IMPORTER_RE, createVirtualImport } from "../src/node";

test("The inline SFC's virtual import is able to match its regular expression.", () => {
  // Normally, `createVirtualImport` expects an SFC string as input
  // here it‘s only used to validate the regular expression.
  const { importer } = createVirtualImport("hello");
  expect(importer).toMatch(SFC_IMPORTER_RE);
});
