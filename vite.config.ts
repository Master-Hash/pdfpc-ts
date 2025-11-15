import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solid({
      dev: true,
    }),
    tailwindcss(),
  ],
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
});
