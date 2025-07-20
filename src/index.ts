import { Hono } from "hono";
import { generateLanguageStatsSVG } from "./lib/language-stats-svg";
import { generateRecentReposSVG } from "./lib/recent-repos-svg";
import { generateRecentLanguagesSVG } from "./lib/recent-languages-svg";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Cache revalidation threshold (1 hour)
const REVALIDATE_AFTER_MS = 60 * 60 * 1000;

app.get("/stats/language", async (c) => {
  const username = c.env.GITHUB_USERNAME;

  // Build cache key
  const cacheKey = new Request(c.req.url);
  const cache = caches.default;

  // Try to get from cache
  const cachedResponse = await cache.match(cacheKey);

  // Check cache age (even if no cache exists)
  const cachedAt = cachedResponse?.headers.get("X-Cached-At");
  const age = cachedAt ? Date.now() - new Date(cachedAt).getTime() : Infinity;

  // Always trigger background update if cache is stale or missing
  if (!cachedResponse || age >= REVALIDATE_AFTER_MS) {
    c.executionCtx.waitUntil(
      (async () => {
        try {
          console.info("Generating language stats SVG for:", username);
          const svg = await generateLanguageStatsSVG({
            username,
            githubToken: c.env.GITHUB_TOKEN,
          });

          const response = new Response(svg, {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml",
              "X-Cached-At": new Date().toISOString(),
            },
          });

          await cache.put(cacheKey, response);
        } catch (error) {
          console.error("Background cache generation failed:", error);
        }
      })(),
    );
  }

  // If we have cache, return it
  if (cachedResponse) {
    return cachedResponse;
  }

  // No cache available - return error
  return c.json(
    {
      error: "Stats are being generated. Please try again in a few seconds.",
      retry_after: 5,
    },
    503,
    {
      "Retry-After": "5",
    },
  );
});

app.get("/stats/recent-repos", async (c) => {
  const username = c.env.GITHUB_USERNAME;

  // Build cache key
  const cacheKey = new Request(c.req.url);
  const cache = caches.default;

  // Try to get from cache
  const cachedResponse = await cache.match(cacheKey);

  // Check cache age (even if no cache exists)
  const cachedAt = cachedResponse?.headers.get("X-Cached-At");
  const age = cachedAt ? Date.now() - new Date(cachedAt).getTime() : Infinity;

  // Always trigger background update if cache is stale or missing
  if (!cachedResponse || age >= REVALIDATE_AFTER_MS) {
    c.executionCtx.waitUntil(
      (async () => {
        try {
          console.info("Generating recent repos SVG for:", username);
          const svg = await generateRecentReposSVG({
            username,
            githubToken: c.env.GITHUB_TOKEN,
          });

          const response = new Response(svg, {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml",
              "X-Cached-At": new Date().toISOString(),
            },
          });

          await cache.put(cacheKey, response);
        } catch (error) {
          console.error("Background cache generation failed:", error);
        }
      })(),
    );
  }

  // If we have cache, return it
  if (cachedResponse) {
    return cachedResponse;
  }

  // No cache available - return error
  return c.json(
    {
      error: "Stats are being generated. Please try again in a few seconds.",
      retry_after: 5,
    },
    503,
    {
      "Retry-After": "5",
    },
  );
});

app.get("/stats/recent-languages", async (c) => {
  const username = c.env.GITHUB_USERNAME;

  // Build cache key
  const cacheKey = new Request(c.req.url);
  const cache = caches.default;

  // Try to get from cache
  const cachedResponse = await cache.match(cacheKey);

  // Check cache age (even if no cache exists)
  const cachedAt = cachedResponse?.headers.get("X-Cached-At");
  const age = cachedAt ? Date.now() - new Date(cachedAt).getTime() : Infinity;

  // Always trigger background update if cache is stale or missing
  if (!cachedResponse || age >= REVALIDATE_AFTER_MS) {
    c.executionCtx.waitUntil(
      (async () => {
        try {
          console.info("Generating recent languages SVG for:", username);
          const svg = await generateRecentLanguagesSVG({
            username,
            githubToken: c.env.GITHUB_TOKEN,
          });

          const response = new Response(svg, {
            status: 200,
            headers: {
              "Content-Type": "image/svg+xml",
              "X-Cached-At": new Date().toISOString(),
            },
          });

          await cache.put(cacheKey, response);
        } catch (error) {
          console.error("Background cache generation failed:", error);
        }
      })(),
    );
  }

  // If we have cache, return it
  if (cachedResponse) {
    return cachedResponse;
  }

  // No cache available - return error
  return c.json(
    {
      error: "Stats are being generated. Please try again in a few seconds.",
      retry_after: 5,
    },
    503,
    {
      "Retry-After": "5",
    },
  );
});

export default app;
