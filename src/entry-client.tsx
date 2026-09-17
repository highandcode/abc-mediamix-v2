import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

const container = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// `npm run build`'s prerender step fills #root with real server-rendered
// markup, so that build must hydrate against it. The plain `vite` dev
// server never runs that step — #root is empty on every dev load — so
// hydrating there mismatches immediately. React silently recovers on the
// very first paint, but the recovery leaves the fiber tree in a state
// that then throws (and unmounts the whole root, i.e. a blank page) the
// first time a client-side route change unmounts something, e.g. via
// AnimatePresence. Render fresh instead whenever there's nothing to
// hydrate against.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
