import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
// import { standardCssModules } from 'vite-plugin-standard-css-modules';

export default defineConfig({
  plugins: [
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
    },
  },
  optimizeDeps: {
    exclude: ["wasm-vips"],
  },
  build: {
    // sourcemap: true,
    // minify: "oxc",
    // cssMinify: "lightningcss",
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
});
