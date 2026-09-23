import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { campaigns } from "./data/campaigns";
import { articles } from "./data/insights";
import { getRouteMeta, buildHeadHtml } from "./lib/seo";

export { campaigns, articles };

export function render(url: string) {
  const appHtml = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  const meta = getRouteMeta(url, { campaigns, articles });
  const headHtml = buildHeadHtml(meta);

  return { appHtml, headHtml };
}
