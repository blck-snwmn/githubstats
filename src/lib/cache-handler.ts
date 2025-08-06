import type { Context } from "hono";

// Cache revalidation threshold (1 hour)
const REVALIDATE_AFTER_MS = 60 * 60 * 1000;

interface CacheHandlerOptions {
  generateContent: () => Promise<string>;
  contentType: string;
  name: string;
}

interface CachedData {
  content: string;
  cachedAt: string;
  contentType: string;
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

  // Build cache key from URL
  const url = new URL(c.req.url);
  const cacheKey = `svg:${url.pathname}`;
  const kv = c.env.SVG_CACHE;

  // Try to get from KV cache
  const cachedData = await kv.get<CachedData>(cacheKey, "json");

  // Check cache age (even if no cache exists)
  const age = cachedData ? Date.now() - new Date(cachedData.cachedAt).getTime() : Infinity;

  // Always trigger background update if cache is stale or missing
  if (!cachedData || age >= REVALIDATE_AFTER_MS) {
    console.info("Cache miss or stale - generating new content");
    c.executionCtx.waitUntil(
      (async () => {
        try {
          console.info(`Generating ${name} for:`, username);
          const content = await generateContent();

          const dataToCache: CachedData = {
            content,
            cachedAt: new Date().toISOString(),
            contentType,
          };

          // Store in KV without TTL (permanent cache)
          await kv.put(cacheKey, JSON.stringify(dataToCache));
        } catch (error) {
          console.error("Background cache generation failed:", error);
        }
      })(),
    );
  }

  // If we have cache, return it
  if (cachedData) {
    console.info("cache hit - returning cached content");
    return new Response(cachedData.content, {
      status: 200,
      headers: {
        "Content-Type": cachedData.contentType,
        "X-Cached-At": cachedData.cachedAt,
        "Cache-Control": "public, max-age=300", // 5 min browser cache
      },
    });
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
