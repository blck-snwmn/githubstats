import { Hono } from "hono";
import { generateLanguageStatsSVG } from "./lib/language-stats-svg";
import { generateRecentReposSVG } from "./lib/recent-repos-svg";
import { generateRecentLanguagesSVG } from "./lib/recent-languages-svg";
import { handleCachedRequest } from "./lib/cache-handler";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/stats/language", async (c) => {
  return handleCachedRequest(c, {
    generateContent: async () => {
      const username = c.env.GITHUB_USERNAME;
      return generateLanguageStatsSVG({
        username,
        githubToken: c.env.GITHUB_TOKEN,
      });
    },
    contentType: "image/svg+xml",
    name: "language stats SVG",
  });
});

app.get("/stats/recent-repos", async (c) => {
  return handleCachedRequest(c, {
    generateContent: async () => {
      const username = c.env.GITHUB_USERNAME;
      return generateRecentReposSVG({
        username,
        githubToken: c.env.GITHUB_TOKEN,
      });
    },
    contentType: "image/svg+xml",
    name: "recent repos SVG",
  });
});

app.get("/stats/recent-languages", async (c) => {
  return handleCachedRequest(c, {
    generateContent: async () => {
      const username = c.env.GITHUB_USERNAME;
      return generateRecentLanguagesSVG({
        username,
        githubToken: c.env.GITHUB_TOKEN,
      });
    },
    contentType: "image/svg+xml",
    name: "recent languages SVG",
  });
});

export default app;
