import type { PDFiumDocument, PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import { PDFiumLibrary } from "@hyzyla/pdfium";
import module from "@hyzyla/pdfium/pdfium.wasm?url";
import { expose } from "comlink";
import Vips from "wasm-vips";
import type { setDocImagesWrapper } from "./App.tsx";
import type { Setter } from "solid-js";

const pdfium = await PDFiumLibrary.init({
  wasmUrl: module,
});

// 我不理解为啥这玩意吃这么多内存……
const vips = await Vips({
  // Optimize startup time by disabling the dynamic modules
  // Also fix vite build. jxl wasm is not imported correctly.
  dynamicLibraries: [],

  onRuntimeInitialized() {
    console.log("Vips runtime initialized");
    postMessage({
      type: "vips-ready",
    });
  },
});

async function renderFunction(
  options: PDFiumPageRenderOptions,
): Promise<Uint8Array> {
  const { data, height, width } = options;

  using pngBuffer = vips.Image.newFromMemory(data, width, height, 4, 0);
  const png = pngBuffer.pngsaveBuffer();
  return png;
}

console.log("Vips version", vips.version());

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
