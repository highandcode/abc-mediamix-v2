import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { caseStudies } from "./data/work";
import { articles } from "./data/insights";
import { getRouteMeta, buildHeadHtml } from "./lib/seo";

export { caseStudies, articles };

export function render(url: string) {
  const appHtml = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  const meta = getRouteMeta(url, { caseStudies, articles });
  const headHtml = buildHeadHtml(meta);

  return { appHtml, headHtml };
}
