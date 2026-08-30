interface HarfBuzzEmscriptenModule {
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAP32: Int32Array;
  _malloc(size: number): number;
  _free(ptr: number): void;
  _hb_blob_create(
    data: number,
    length: number,
    mode: number,
    userData: number,
    destroy: number,
  ): number;
  _hb_blob_destroy(blob: number): void;
  _hb_face_create(blob: number, index: number): number;
  _hb_face_destroy(face: number): void;
  _hb_font_create(face: number): number;
  _hb_font_destroy(font: number): void;
  _hb_font_set_scale(font: number, xScale: number, yScale: number): void;
  _hb_buffer_create(): number;
  _hb_buffer_destroy(buffer: number): void;
  _hb_buffer_add_utf16(
    buffer: number,
    text: number,
    textLength: number,
    itemOffset: number,
    itemLength: number,
  ): void;
  _hb_buffer_guess_segment_properties(buffer: number): void;
  _hb_buffer_set_direction(buffer: number, direction: number): void;
  _hb_buffer_set_language(buffer: number, language: number): void;
  _hb_buffer_set_script(buffer: number, script: number): void;
  _hb_language_from_string(value: number, length: number): number;
  _hb_script_from_string(value: number, length: number): number;
  _hb_buffer_get_length(buffer: number): number;
  _hb_buffer_get_glyph_infos(buffer: number, length: number): number;
  _hb_buffer_get_glyph_positions(buffer: number, length: number): number;
  _hb_glyph_info_get_glyph_flags(info: number): number;
  _hb_feature_from_string(value: number, length: number, feature: number): number;
  _hb_shape(font: number, buffer: number, features: number, featuresLength: number): void;
}

interface HarfBuzzModuleOptions {
  instantiateWasm(
    imports: WebAssembly.Imports,
    receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
  ): WebAssembly.Exports;
}

declare module "harfbuzzjs/hb.js" {
  const createHarfBuzz: (module: HarfBuzzModuleOptions) => Promise<HarfBuzzEmscriptenModule>;

  export default createHarfBuzz;
}

declare module "harfbuzzjs/hb.wasm" {
  const harfbuzzWasm: WebAssembly.Module;

  export default harfbuzzWasm;
}
