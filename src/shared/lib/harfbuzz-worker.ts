import createHarfBuzz from "harfbuzzjs/hb.js";
import createHarfBuzzBindings from "harfbuzzjs/hbjs.js";
import harfbuzzWasm from "harfbuzzjs/hb.wasm";

const harfbuzz = createHarfBuzz({
  instantiateWasm(imports, receiveInstance) {
    const instance = new WebAssembly.Instance(harfbuzzWasm, imports);
    receiveInstance(instance, harfbuzzWasm);
    return instance.exports;
  },
}).then(createHarfBuzzBindings);

export default harfbuzz;
