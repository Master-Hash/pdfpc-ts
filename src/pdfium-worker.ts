import type { PDFiumDocument, PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import type { Setter } from "solid-js";

import { PDFiumLibrary } from "@hyzyla/pdfium";
import module from "@hyzyla/pdfium/pdfium.wasm?url";
import { expose } from "comlink";

import type { setDocImagesWrapper } from "./App.tsx";

import init, { bitmap_to_png } from "../pkg/bitmap_to_png.js";

const [pdfium, _] = await Promise.all([
  PDFiumLibrary.init({
    wasmUrl: module,
  }),
  init(),
]);

postMessage({
  type: "worker-ready",
});

async function renderFunction(
  options: PDFiumPageRenderOptions,
): Promise<Uint8Array> {
  const { data, height, width } = options;

  const png = bitmap_to_png(data, width, height);
  return png;
}

// console.log("Vips version", vips.version());

let doc: PDFiumDocument | undefined = undefined;

export class obj {
  static ready = (setIsReady: Setter<boolean>) => {
    setIsReady(true);
  };
  static loadPDF = async (file: Uint8Array) => {
    doc = await pdfium.loadDocument(file);
    console.log("Loaded PDF document in worker:", doc);
  };
  static pageCount = (): number => {
    if (!doc) {
      throw new Error("Document not loaded");
    }
    return doc.getPageCount();
  };
  static renderPDF = async function (
    // target: SetStoreFunction<(string | undefined)[]>,
    pageIndex: number,
    target: typeof setDocImagesWrapper,
    // target: (string | undefined)[],
  ) {
    if (!doc) {
      throw new Error("Document not loaded");
    }
    // for (const page of doc.pages()) {
    const page = doc.getPage(pageIndex);
    console.log(`${page.number} - rendering...`);

    // Render PDF page to PNG image
    const image = await page.render({
      scale: 3, // 3x scale (72 DPI is the default)
      render: renderFunction, // sharp function to convert raw bitmap data to PNG
    });

    // Save the PNG image to the output folder
    // await fs.writeFile(`output/${page.number}.png`, Buffer.from(image.data));

    // const b = image.data.toBase64();
    // console.image("data:image/png;base64," + b, 150);
    const blob = new Blob([image.data], { type: "image/png" });
    const imgUrl = URL.createObjectURL(blob);
    target(page.number, imgUrl);
    // target[page.number] = imgUrl;
    // target(
    //   produce((state) => {
    //     state[page.number] = imgUrl;
    //   }),
    // );
    // }
  };
}

expose(obj);
