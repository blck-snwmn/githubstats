import { Hono, type Context } from "hono";
import { generateLanguageStatsSVG } from "./features/language-stats/generator";
import { generateRecentReposSVG } from "./features/recent-repos/generator";
import { generateRecentLanguagesSVG } from "./features/recent-languages/generator";
import { generateWeeklyActivitySVG } from "./features/weekly-activity/generator";
import type { BaseSVGOptions } from "./types/svg-options";

const app = new Hono<{ Bindings: CloudflareBindings }>();
const SVG_CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=604800";

type SVGGenerator = (opts: BaseSVGOptions) => Promise<string>;

function isTracing(value: unknown): value is Tracing {
  return typeof value === "object" && value !== null && "enterSpan" in value;
}

function getTracing(ctx: unknown): Tracing | undefined {
  if (typeof ctx !== "object" || ctx === null) {
    return undefined;
  }

  if (!("tracing" in ctx)) {
    return undefined;
  }

  return isTracing(ctx.tracing) ? ctx.tracing : undefined;
}

async function generateSVGContent(
  c: Context<{ Bindings: CloudflareBindings }>,
  path: string,
  name: string,
  generator: SVGGenerator,
): Promise<string> {
  const username = c.env.GITHUB_USERNAME;
  const generate = () => generator({ username, githubToken: c.env.GITHUB_TOKEN });
  const tracing = getTracing(c.executionCtx);

  return (
    tracing?.enterSpan("githubstats.svg.generate", (span: Span) => {
      if (span.isTraced) {
        span.setAttribute("http.route", path);
        span.setAttribute("githubstats.svg.name", name);
      }

      return generate();
    }) ?? generate()
  );
}

function createSVGEndpoint(
  router: Hono<{ Bindings: CloudflareBindings }>,
  path: string,
  generator: SVGGenerator,
  name: string,
) {
  router.get(path, async (c) => {
    const content = await generateSVGContent(c, path, name, generator);

    return new Response(content, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": SVG_CACHE_CONTROL,
      },
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
createSVGEndpoint(app, "/stats/weekly-activity", generateWeeklyActivitySVG, "weekly activity SVG");

export default app;
