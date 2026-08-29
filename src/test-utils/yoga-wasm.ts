import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const yogaWasmBytes = await readFile(resolve(process.cwd(), "node_modules/satori/yoga.wasm"));
// The Worker type declarations omit dynamic compilation because production
// Workers disallow it. This adapter runs only in Vitest's Node environment.
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const nodeWebAssembly = WebAssembly as unknown as {
  compile(bytes: Uint8Array): Promise<WebAssembly.Module>;
};
const yogaWasm = await nodeWebAssembly.compile(yogaWasmBytes);

export default yogaWasm;
