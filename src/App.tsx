import { proxy, transfer, wrap } from "comlink";
import { createEffect, createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { DropZone } from "./DropZone.tsx";
import type { obj } from "./pdfium-worker.ts";
import _styles from "./main.css?inline";

const _worker = new Worker(new URL("./pdfium-worker.ts", import.meta.url), {
  type: "module",
  name: "pdfium-worker",
});

const worker = wrap<typeof obj>(_worker);

// import styles from "./side.css" with { type: "css" };

// 乐，React 搞不了多根的状态同步吧
const [globalCount, setGlobalCount] = createSignal(0);

const [filePageCount, setFilePageCount] = createSignal(-1);

// let doc: PDFiumDocument | undefined = undefined;

const [docImages, setDocImages] = createSignal<Array<string | undefined>>([]);

export function setDocImagesWrapper(index: number, url: string) {
  setDocImages((prev) => {
    const newArr = [...prev];
    newArr[index] = url;
    return newArr;
  });
}

function PopupRoot() {
  return (
    <div class="aspect-video">
      <div class="w-[min(100vw,calc(100vh*16/9))] h-[min(100vh,calc(100vw*9/16))] overflow-hidden">
        <Show when={docImages()[globalCount()]}>
          <img
            src={docImages()[globalCount()]}
            alt="slide"
            class="object-cover object-left h-full w-auto"
          />
        </Show>
      </div>
    </div>
  );
}

const handleFileSelect =
  (type: "no-notes" | "notes-right") => async (selectedFile: File) => {
    const u =
      "bytes" in Blob.prototype
        ? await selectedFile.bytes()
        : await selectedFile.arrayBuffer().then((buf) => new Uint8Array(buf));

    try {
      await worker.loadPDF(transfer(u, [u.buffer]));
      setFilePageCount(await worker.pageCount());
      for (let i = 0; i < filePageCount(); i++) {
        await worker.renderPDF(i, proxy(setDocImagesWrapper));
      }
      console.log(docImages());
    } catch (error) {
      console.error("Failed to process PDF:", error);
    } finally {
    }
  };

function App() {
  let w: WindowProxy | null = null;

  createEffect(() => {});

  return (
    <>
      <header></header>
      <main class="mx-10 my-10">
        <Show
          when={filePageCount() <= 0}
          fallback={
            <>
              <div class="grid grid-cols-3 gap-4 p-4">
                <For each={Array(filePageCount()).fill(0)}>
                  {(_, index) => (
                    <div class="aspect-video outline outline-cat-subtext0">
                      <Show when={docImages()[index()]}>
                        <img
                          src={docImages()[index()]}
                          class="w-full h-full object-contain"
                        />
                      </Show>
                    </div>
                  )}
                </For>
              </div>
              {/* Control buttons */}
              <div class="flex justify-between p-4 fixed bottom-4 left-4 gap-6 ">
                <div
                  class="h-8 w-8 place-items-center grid outline outline-cat-subtext0 text-cat-subtext0 rounded-full opacity-25 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    if (filePageCount() <= 0) return;
                    setGlobalCount((prev) => Math.max(0, prev - 1));
                    console.log("Current page:", globalCount());
                  }}
                >
                  <button
                    class="icon-[fluent--arrow-left-24-regular] cursor-pointer"
                    title="Previous page"
                  />
                </div>
                <div
                  class="h-8 w-8 place-items-center grid outline outline-cat-subtext0 text-cat-subtext0 rounded-full opacity-25 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    if (filePageCount() <= 0) return;
                    setGlobalCount((prev) =>
                      Math.min(prev + 1, filePageCount() - 1),
                    );
                    console.log("Current page:", globalCount());
                  }}
                >
                  <button
                    class="icon-[fluent--arrow-right-24-regular] cursor-pointer"
                    title="Next page"
                  />
                </div>
                <div
                  class="h-8 w-8 place-items-center grid outline outline-cat-subtext0 text-cat-subtext0 rounded-full opacity-25 hover:opacity-100 cursor-pointer"
                  onClick={() => {}}
                >
                  <button
                    class="icon-[fluent--grid-24-filled] cursor-pointer"
                    title="Slide grid"
                  />
                </div>
                <div
                  class="h-8 w-8 place-items-center grid outline outline-cat-subtext0 text-cat-subtext0 rounded-full opacity-25 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    if (!w) {
                      w = window.open(
                        "",
                        "",
                        "left=100,top=100,width=320,height=180",
                      );
                      console.log(w);

                      // todo: when does vite support css import attributes?
                      const styles = new w.CSSStyleSheet();
                      styles.replaceSync(_styles);
                      w?.document.adoptedStyleSheets?.push(styles);
                      render(
                        () => <PopupRoot />,
                        w!.document!.querySelector("body")!,
                      );
                    }
                  }}
                >
                  <button
                    class="icon-[fluent--open-24-filled] cursor-pointer"
                    title="Show slide"
                  />
                </div>
                <div
                  class="h-8 w-8 place-items-center grid outline outline-cat-subtext0 text-cat-subtext0 rounded-full opacity-25 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    w?.close();
                    w = null;
                  }}
                >
                  <button
                    class="icon-[fluent--share-screen-stop-24-filled] cursor-pointer"
                    title="Close slide"
                  />
                </div>
              </div>
              {/* ends */}
            </>
          }
        >
          <h1 class="text-4xl font-extrabold">PDF Presenter View</h1>
          <div class="mt-30 grid grid-cols-2 h-80 w-full px-30 gap-16">
            <DropZone
              type="no-notes"
              onFileSelect={handleFileSelect("no-notes")}
            />
            <DropZone
              type="notes-right"
              onFileSelect={handleFileSelect("notes-right")}
            />
          </div>
        </Show>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
