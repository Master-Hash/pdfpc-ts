import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
// import { standardCssModules } from 'vite-plugin-standard-css-modules';

const isBuild =
  process.argv[1]?.includes("vite") && process.argv[2]?.includes("build");

export default defineConfig({
  plugins: [
    !isBuild &&
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
      }),
    solid({
      dev: true,
    }),
    tailwindcss(),
    // standardCssModules({
    //   targetClient: "CSSStyleSheet",
    //   include: ["**/side.css"],
    //   log: false
    // }),
  ],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self' data: blob:; connect-src *;",
    },
  },
  optimizeDeps: {
    exclude: ["wasm-vips", "react/jsx-dev-runtime"],
  },
  build: {
    // sourcemap: true,
    minify: "oxc",
    cssMinify: "lightningcss",
    target: "esnext",
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    modulePreload: {
      polyfill: false,
    },
  },
  worker: {
    format: "es",
  },
  experimental: {
    enableNativePlugin: true,
  },
});
