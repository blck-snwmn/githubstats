import { Hono } from "hono";
import { generateLanguageStatsSVG } from "./lib/language-stats-svg";
import { generateRecentReposSVG } from "./lib/recent-repos-svg";
import { generateRecentLanguagesSVG } from "./lib/recent-languages-svg";
import { handleCachedRequest } from "./lib/cache-handler";
import type { BaseSVGOptions } from "./types/svg-options";

const app = new Hono<{ Bindings: CloudflareBindings }>();

function createSVGEndpoint(
  app: Hono<{ Bindings: CloudflareBindings }>,
  path: string,
  generator: (opts: BaseSVGOptions) => Promise<string>,
  name: string
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
createSVGEndpoint(app, "/stats/recent-languages", generateRecentLanguagesSVG, "recent languages SVG");

export default app;
