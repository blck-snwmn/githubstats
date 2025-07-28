import type { Context } from "hono";

// Cache revalidation threshold (1 week)
const REVALIDATE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

interface CacheHandlerOptions {
  generateContent: () => Promise<string>;
  contentType: string;
  name: string;
}

/**
 * Handles cached requests with stale-while-revalidate pattern
 * @param c - Hono context
 * @param options - Cache handler options
 * @returns Response with cached or error content
 */
export async function handleCachedRequest(
  c: Context<{ Bindings: CloudflareBindings }>,
  options: CacheHandlerOptions,
): Promise<Response> {
  const { generateContent, contentType, name } = options;
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
          console.info(`Generating ${name} for:`, username);
          const content = await generateContent();

          const response = new Response(content, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "X-Cached-At": new Date().toISOString(),
              "Cache-Control": "public, max-age=300, s-maxage=86400", // 5 min browser, 24 hours CDN cache
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
}
