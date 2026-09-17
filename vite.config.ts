import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssr: {
    // gsap/ScrollTrigger's CJS export shape isn't reliably interop-able by
    // Node's native ESM loader when left external — bundle it so Rollup
    // handles the CJS<->ESM interop instead.
    noExternal: ["gsap"],
  },
});
