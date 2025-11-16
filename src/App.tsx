import { proxy, transfer, wrap } from "comlink";
import { createEffect, createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { DropZone } from "./DropZone.tsx";
import type { obj } from "./pdfium-worker.ts";

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
    <div>
      <p>{globalCount()}</p>
    </div>
  );
}

const handleFileSelect =
  (type: "no-notes" | "notes-right") => async (selectedFile: File) => {
    const u = await selectedFile.bytes();

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
    <Show
      when={filePageCount() <= 0}
      fallback={
        // <img src={imgTest()} />
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
      }
    >
      <header></header>
      <main class="mx-10 my-10">
        <h1 class="text-4xl font-extrabold">PDF Presenter View</h1>
        {/* 1 - Select your PDF file: */}

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
      </main>
      <button
        onclick={(e) => {
          console.log(e);
          if (!w) {
            w = window.open("", "", "left=100,top=100,width=320,height=320");
            console.log(w);

            // todo: when does vite support css import attributes?
            // w?.document.adoptedStyleSheets?.push(styles);
            render(() => <PopupRoot />, w!.document!.querySelector("body")!);

            // const n = w!.document.createElement("a");
            // n.innerText = "fuck";
            // w?.document.querySelector("body")?.appendChild(n);
            // w!.window.console.log(g[0]);
          }
        }}
      />
      <button
        onclick={() => {
          setGlobalCount((v) => v + 1);
        }}
      />
      <footer></footer>
    </Show>
  );
}

export default App;
