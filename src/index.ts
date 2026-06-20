import { Hono, type Context } from "hono";
import { generateLanguageStatsSVG } from "./features/language-stats/generator";
import { generateRecentReposSVG } from "./features/recent-repos/generator";
import { generateRecentLanguagesSVG } from "./features/recent-languages/generator";
import { generateWeeklyActivitySVG } from "./features/weekly-activity/generator";
import { handleCachedRequest } from "./services/cache/handler";
import type { BaseSVGOptions } from "./types/svg-options";

const app = new Hono<{ Bindings: CloudflareBindings }>();

type SVGGenerator = (opts: BaseSVGOptions) => Promise<string>;

async function generateSVGContent(
  c: Context<{ Bindings: CloudflareBindings }>,
  path: string,
  name: string,
  generator: SVGGenerator,
): Promise<string> {
  const username = c.env.GITHUB_USERNAME;
  const generate = () => generator({ username, githubToken: c.env.GITHUB_TOKEN });
  const executionCtx: ExecutionContext & { tracing?: Tracing } = c.executionCtx;

  return (
    executionCtx.tracing?.enterSpan("githubstats.svg.generate", (span: Span) => {
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
    return handleCachedRequest(c, {
      generateContent: () => generateSVGContent(c, path, name, generator),
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
createSVGEndpoint(app, "/stats/weekly-activity", generateWeeklyActivitySVG, "weekly activity SVG");

export default app;
