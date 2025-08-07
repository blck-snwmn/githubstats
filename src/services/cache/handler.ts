import type { Context } from "hono";

/**
 * Determines if cache should be updated using xfetch algorithm
 * @param age - Cache age in milliseconds
 * @param ttl - Time to live in milliseconds
 * @param beta - Beta parameter for update aggressiveness (default: 1.0)
 * @param random - Random value between 0 and 1 (default: Math.random())
 * @returns true if cache should be updated
 */
export function shouldUpdateCache(
  age: number,
  ttl: number,
  beta: number = 1.0,
  random: number = Math.random(),
): boolean {
  const delta = Math.max(0, ttl - age);
  const xfetch = delta * beta * -Math.log(random);
  return age + xfetch >= ttl;
}

/**
 * Cache configuration using xfetch algorithm (Optimal Probabilistic Cache Stampeding Prevention)
 *
 * Prevents cache stampeding by probabilistically updating entries before expiry:
 * - Reduces concurrent updates (prevents thundering herd)
 * - Users see fresh data (cache often updated before expiry)
 *
 * Algorithm: shouldUpdate = (age + delta * beta * -log(random())) >= TTL
 * where delta = TTL - age
 *
 * Reference: "Optimal Probabilistic Cache Stampede Prevention" by Facebook (2015)
 * https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf
 */
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
// Beta parameter controls update aggressiveness:
// - 0.5 = conservative (updates mostly near expiry)
// - 1.0 = standard (balanced updates throughout lifetime)
// - 2.0 = aggressive (early updates more likely)
const CACHE_BETA = 1.0;

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
 * Triggers background cache update
 */
function triggerBackgroundUpdate(
  c: Context,
  cacheKey: string,
  kv: KVNamespace,
  options: CacheHandlerOptions & { username: string },
) {
  const { generateContent, contentType, name, username } = options;

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

        // Store in KV without expiration
        await kv.put(cacheKey, JSON.stringify(dataToCache));
      } catch (error) {
        console.error("Background cache generation failed:", error);
      }
    })(),
  );
}

/**
 * Handles cached requests using xfetch probabilistic update algorithm
 * @param c - Hono context
 * @param options - Cache handler options
 * @returns Response with cached or fresh content
 */
export async function handleCachedRequest(
  c: Context<{ Bindings: CloudflareBindings }>,
  options: CacheHandlerOptions,
): Promise<Response> {
  const username = c.env.GITHUB_USERNAME;

  // Build cache key from URL
  const url = new URL(c.req.url);
  const cacheKey = `svg:${url.pathname}`;
  const kv = c.env.SVG_CACHE;

  // Try to get from KV cache
  const cachedData = await kv.get<CachedData>(cacheKey, "json");

  // Handle cache miss - early return
  if (!cachedData) {
    console.info("Cache miss - generating new content");

    // Trigger background update
    triggerBackgroundUpdate(c, cacheKey, kv, {
      ...options,
      username,
    });

    // Return error response
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

  // Cache exists - calculate age and check if update needed
  const age = Date.now() - new Date(cachedData.cachedAt).getTime();
  const ageInDays = age / (24 * 60 * 60 * 1000);

  // Apply xfetch algorithm for probabilistic cache update
  if (shouldUpdateCache(age, CACHE_TTL, CACHE_BETA)) {
    console.info(`Cache update triggered - age: ${ageInDays.toFixed(1)} days`);

    // Trigger background update
    triggerBackgroundUpdate(c, cacheKey, kv, {
      ...options,
      username,
    });
  } else {
    console.info(`Cache fresh enough - age: ${ageInDays.toFixed(1)} days`);
  }

  // Return cached content
  return new Response(cachedData.content, {
    status: 200,
    headers: {
      "Content-Type": cachedData.contentType,
      "X-Cached-At": cachedData.cachedAt,
      "Cache-Control": "public, max-age=300", // 5 min browser cache
    },
  });
}
