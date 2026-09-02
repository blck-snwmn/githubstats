import createHarfBuzz from "harfbuzzjs/hb.js";
import harfbuzzWasm from "harfbuzzjs/hb.wasm";

/* eslint-disable no-underscore-dangle -- Emscripten exposes C functions with leading underscores. */

const HB_MEMORY_MODE_DUPLICATE = 0;
const directionValues: Record<string, number> = {
  ltr: 4,
  rtl: 5,
  ttb: 6,
  btt: 7,
};

interface HarfBuzzObject {
  ptr: number;
  destroy(): void;
}

interface HarfBuzzFont extends HarfBuzzObject {
  setScale(xScale: number, yScale: number): void;
}

interface HarfBuzzBuffer extends HarfBuzzObject {
  addText(text: string): void;
  guessSegmentProperties(): void;
  setDirection(direction: string): void;
  setLanguage(language: string): void;
  setScript(script: string): void;
  json(): HarfBuzzGlyph[];
}

interface HarfBuzzGlyph {
  g: number;
  cl: number;
  ax: number;
  ay: number;
  dx: number;
  dy: number;
  flags: number;
}

function createBindings(module: HarfBuzzEmscriptenModule) {
  const allocateAscii = (value: string) => {
    const ptr = module._malloc(value.length + 1);
    for (let index = 0; index < value.length; index++) {
      module.HEAPU8[ptr + index] = value.charCodeAt(index);
    }
    module.HEAPU8[ptr + value.length] = 0;
    return ptr;
  };

  const createBlob = (data: Uint8Array): HarfBuzzObject => {
    const dataPtr = module._malloc(data.byteLength);
    module.HEAPU8.set(data, dataPtr);

    // DUPLICATE makes HarfBuzz own a copy, avoiding the JS finalizer callback
    // used by harfbuzzjs. That callback requires runtime WASM compilation,
    // which Cloudflare Workers intentionally disallow.
    const ptr = module._hb_blob_create(dataPtr, data.byteLength, HB_MEMORY_MODE_DUPLICATE, 0, 0);
    module._free(dataPtr);

    return {
      ptr,
      destroy: () => module._hb_blob_destroy(ptr),
    };
  };

  const createFace = (blob: HarfBuzzObject, index: number): HarfBuzzObject => {
    const ptr = module._hb_face_create(blob.ptr, index);
    return {
      ptr,
      destroy: () => module._hb_face_destroy(ptr),
    };
  };

  const createFont = (face: HarfBuzzObject): HarfBuzzFont => {
    const ptr = module._hb_font_create(face.ptr);
    return {
      ptr,
      setScale: (xScale, yScale) => module._hb_font_set_scale(ptr, xScale, yScale),
      destroy: () => module._hb_font_destroy(ptr),
    };
  };

  const createBuffer = (): HarfBuzzBuffer => {
    const ptr = module._hb_buffer_create();

    return {
      ptr,
      addText(text) {
        const textPtr = module._malloc(text.length * 2);
        const textBuffer = module.HEAPU16.subarray(textPtr / 2, textPtr / 2 + text.length);
        for (let index = 0; index < text.length; index++) {
          textBuffer[index] = text.charCodeAt(index);
        }
        module._hb_buffer_add_utf16(ptr, textPtr, text.length, 0, text.length);
        module._free(textPtr);
      },
      guessSegmentProperties: () => module._hb_buffer_guess_segment_properties(ptr),
      setDirection: (direction) =>
        module._hb_buffer_set_direction(ptr, directionValues[direction] ?? 0),
      setLanguage(language) {
        const languagePtr = allocateAscii(language);
        module._hb_buffer_set_language(ptr, module._hb_language_from_string(languagePtr, -1));
        module._free(languagePtr);
      },
      setScript(script) {
        const scriptPtr = allocateAscii(script);
        module._hb_buffer_set_script(ptr, module._hb_script_from_string(scriptPtr, -1));
        module._free(scriptPtr);
      },
      json() {
        const length = module._hb_buffer_get_length(ptr);
        const infosPtr = module._hb_buffer_get_glyph_infos(ptr, 0);
        const positionsPtr = module._hb_buffer_get_glyph_positions(ptr, 0);
        const glyphs: HarfBuzzGlyph[] = [];

        for (let index = 0; index < length; index++) {
          const infoPtr = infosPtr + index * 20;
          const infoIndex = infoPtr / 4;
          const positionIndex = positionsPtr / 4 + index * 5;
          glyphs.push({
            g: module.HEAPU32[infoIndex],
            cl: module.HEAPU32[infoIndex + 2],
            ax: module.HEAP32[positionIndex],
            ay: module.HEAP32[positionIndex + 1],
            dx: module.HEAP32[positionIndex + 2],
            dy: module.HEAP32[positionIndex + 3],
            flags: module._hb_glyph_info_get_glyph_flags(infoPtr),
          });
        }

        return glyphs;
      },
      destroy: () => module._hb_buffer_destroy(ptr),
    };
  };

  const shape = (font: HarfBuzzFont, buffer: HarfBuzzBuffer, features?: string) => {
    let featuresPtr = 0;
    let featuresLength = 0;

    if (features) {
      const featureValues = features.split(",");
      featuresPtr = module._malloc(16 * featureValues.length);
      for (const feature of featureValues) {
        const featurePtr = allocateAscii(feature);
        if (module._hb_feature_from_string(featurePtr, -1, featuresPtr + featuresLength * 16)) {
          featuresLength++;
        }
        module._free(featurePtr);
      }
    }

    module._hb_shape(font.ptr, buffer.ptr, featuresPtr, featuresLength);
    if (featuresPtr) module._free(featuresPtr);
  };

  return { createBlob, createFace, createFont, createBuffer, shape };
}

const harfbuzz = createHarfBuzz({
  instantiateWasm(imports, receiveInstance) {
    const instance = new WebAssembly.Instance(harfbuzzWasm, imports);
    receiveInstance(instance, harfbuzzWasm);
    return instance.exports;
  },
}).then(createBindings);

export default harfbuzz;
