interface HarfBuzzEmscriptenModule {
  instantiateWasm(
    imports: WebAssembly.Imports,
    receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
  ): WebAssembly.Exports;
}

declare module "harfbuzzjs/hb.js" {
  const createHarfBuzz: (module: HarfBuzzEmscriptenModule) => Promise<unknown>;

  export default createHarfBuzz;
}

declare module "harfbuzzjs/hbjs.js" {
  const createHarfBuzzBindings: (module: unknown) => unknown;

  export default createHarfBuzzBindings;
}

declare module "harfbuzzjs/hb.wasm" {
  const harfbuzzWasm: WebAssembly.Module;

  export default harfbuzzWasm;
}
