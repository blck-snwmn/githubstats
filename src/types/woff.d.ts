// Bundled as Data modules (see the `rules` in wrangler.config.ts)
declare module "*.woff" {
  const data: ArrayBuffer;

  export default data;
}
