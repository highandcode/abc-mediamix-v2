import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const SITE_URL = "https://abcmediamix.com";

const { render, campaigns, articles } = await import(
  path.join(ssrDir, "entry-server.js")
);

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const staticRoutes = ["/", "/work", "/approach", "/about", "/insights", "/contact"];
const workRoutes = campaigns.map((c) => `/work/${c.slug}`);
const insightRoutes = articles.map((a) => `/insights/${a.slug}`);
const routes = [...staticRoutes, ...workRoutes, ...insightRoutes];

function pageOutPath(route) {
  return route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.slice(1), "index.html");
}

function renderToFile(route, outPath) {
  const { appHtml, headHtml } = render(route);
  const html = template
    .replace("<!--ssr-head-->", headHtml)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

for (const route of routes) {
  renderToFile(route, pageOutPath(route));
  console.log(`prerendered ${route}`);
}

// A path that matches no route so the app tree renders its "*" NotFound page.
// Vercel serves this file automatically (with a real 404 status) for any
// unmatched path — no rewrite/fallback config needed.
renderToFile("/__not_found__", path.join(distDir, "404.html"));
console.log("prerendered 404.html");

const sitemapUrls = routes.map((route) => `${SITE_URL}${route === "/" ? "" : route}`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`wrote sitemap.xml (${sitemapUrls.length} urls)`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log("cleaned up dist-ssr");
