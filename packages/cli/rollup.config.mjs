import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      format: "esm",
      dir: "dist/esm",
    },
    plugins: [typescript({tsconfig:'../../tsconfig.json'}), resolve(), commonjs(), json()],
  },
  {
    input: "src/index.ts",
    output: {
      format: "cjs",
      dir: "dist/cjs",
    },
    plugins: [typescript({tsconfig:'../../tsconfig.json'}), resolve(), commonjs(), json()],
  },
]);
