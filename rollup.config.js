// rollup.config.js

import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
const baseConfig = createBasicConfig();

export default merge(baseConfig, [
  {
    input: "./dist/esm/index.js",
    output: {
      dir: "lib/esm",
      format: "esm",
      exports: "named",
    },
    context: "window",
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true,
      }),
      terser(),
    ],
    external: ["multer", "next-connect"],
  },
]);
