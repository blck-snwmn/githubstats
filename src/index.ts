import { Hono } from "hono";
import { generateLanguageStatsSVG } from "./features/language-stats/generator";
import { generateRecentReposSVG } from "./features/recent-repos/generator";
import { generateRecentLanguagesSVG } from "./features/recent-languages/generator";
import { handleCachedRequest } from "./services/cache/handler";
import type { BaseSVGOptions } from "./types/svg-options";

const app = new Hono<{ Bindings: CloudflareBindings }>();

function createSVGEndpoint(
  app: Hono<{ Bindings: CloudflareBindings }>,
  path: string,
  generator: (opts: BaseSVGOptions) => Promise<string>,
  name: string,
) {
  app.get(path, async (c) => {
    return handleCachedRequest(c, {
      generateContent: async () => {
        const username = c.env.GITHUB_USERNAME;
        return generator({ username, githubToken: c.env.GITHUB_TOKEN });
      },
      contentType: "image/svg+xml",
      name,
    });
  });
}

createSVGEndpoint(app, "/stats/language", generateLanguageStatsSVG, "language stats SVG");
createSVGEndpoint(app, "/stats/recent-repos", generateRecentReposSVG, "recent repos SVG");
createSVGEndpoint(
  app,
  "/stats/recent-languages",
  generateRecentLanguagesSVG,
  "recent languages SVG",
);

export default app;
