export * from "./markdown";
export * from "./vite";

import pkg from "../../package.json" with { type: "json" };
export const version = pkg.version;
