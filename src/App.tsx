import { render } from "@solidjs/web";
import { cx } from "classix";
import { proxy, transfer, wrap } from "comlink";
import { createSignal, For, onCleanup, onSettled, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import { DropZone } from "./DropZone.tsx";
import type { obj } from "./pdfium-worker.ts";

import _styles from "./main.css?inline";

const mainStyles = new window.CSSStyleSheet();
mainStyles.replaceSync(_styles);
window.document.adoptedStyleSheets.push(mainStyles);

const _worker = new Worker(new URL("./pdfium-worker.ts", import.meta.url), {
  type: "module",
  name: "pdfium-worker",
});

const viewClasses = [
  "[view-transition-name:left-0]",
  "[view-transition-name:left-1]",
  "[view-transition-name:left-2]",
  "[view-transition-name:left-3]",
  "[view-transition-name:left-4]",
  "[view-transition-name:left-5]",
  "[view-transition-name:left-6]",
  "[view-transition-name:left-7]",
  "[view-transition-name:left-8]",
  "[view-transition-name:left-9]",
  "[view-transition-name:left-10]",
  "[view-transition-name:left-11]",
  "[view-transition-name:left-12]",
  "[view-transition-name:left-13]",
  "[view-transition-name:left-14]",
  "[view-transition-name:left-15]",
  "[view-transition-name:left-16]",
  "[view-transition-name:left-17]",
  "[view-transition-name:left-18]",
  "[view-transition-name:left-19]",
  "[view-transition-name:left-20]",
  "[view-transition-name:left-21]",
  "[view-transition-name:left-22]",
  "[view-transition-name:left-23]",
  "[view-transition-name:left-24]",
  "[view-transition-name:left-25]",
  "[view-transition-name:left-26]",
  "[view-transition-name:left-27]",
  "[view-transition-name:left-28]",
  "[view-transition-name:left-29]",
  "[view-transition-name:left-30]",
  "[view-transition-name:left-31]",
  "[view-transition-name:left-32]",
  "[view-transition-name:left-33]",
  "[view-transition-name:left-34]",
  "[view-transition-name:left-35]",
  "[view-transition-name:left-36]",
  "[view-transition-name:left-37]",
  "[view-transition-name:left-38]",
  "[view-transition-name:left-39]",
  "[view-transition-name:left-40]",
  "[view-transition-name:left-41]",
  "[view-transition-name:left-42]",
  "[view-transition-name:left-43]",
  "[view-transition-name:left-44]",
  "[view-transition-name:left-45]",
  "[view-transition-name:left-46]",
  "[view-transition-name:left-47]",
  "[view-transition-name:left-48]",
  "[view-transition-name:left-49]",
  "[view-transition-name:left-50]",
  "[view-transition-name:left-51]",
  "[view-transition-name:left-52]",
  "[view-transition-name:left-53]",
  "[view-transition-name:left-54]",
  "[view-transition-name:left-55]",
  "[view-transition-name:left-56]",
  "[view-transition-name:left-57]",
  "[view-transition-name:left-58]",
  "[view-transition-name:left-59]",
  "[view-transition-name:left-60]",
  "[view-transition-name:left-61]",
  "[view-transition-name:left-62]",
  "[view-transition-name:left-63]",
  "[view-transition-name:left-64]",
  "[view-transition-name:left-65]",
  "[view-transition-name:left-66]",
  "[view-transition-name:left-67]",
  "[view-transition-name:left-68]",
  "[view-transition-name:left-69]",
  "[view-transition-name:left-70]",
  "[view-transition-name:left-71]",
  "[view-transition-name:left-72]",
  "[view-transition-name:left-73]",
  "[view-transition-name:left-74]",
  "[view-transition-name:left-75]",
  "[view-transition-name:left-76]",
  "[view-transition-name:left-77]",
  "[view-transition-name:left-78]",
  "[view-transition-name:left-79]",
  "[view-transition-name:left-80]",
  "[view-transition-name:left-81]",
  "[view-transition-name:left-82]",
  "[view-transition-name:left-83]",
  "[view-transition-name:left-84]",
  "[view-transition-name:left-85]",
  "[view-transition-name:left-86]",
  "[view-transition-name:left-87]",
  "[view-transition-name:left-88]",
  "[view-transition-name:left-89]",
  "[view-transition-name:left-90]",
  "[view-transition-name:left-91]",
  "[view-transition-name:left-92]",
  "[view-transition-name:left-93]",
  "[view-transition-name:left-94]",
  "[view-transition-name:left-95]",
  "[view-transition-name:left-96]",
  "[view-transition-name:left-97]",
  "[view-transition-name:left-98]",
  "[view-transition-name:left-99]",
];

const worker = wrap<typeof obj>(_worker);

// import styles from "./side.css" with { type: "css" };

// 乐，React 搞不了多根的状态同步吧
const [globalCount, setGlobalCount] = createSignal(0);

let intervalId: number | null = null;
const [timer, setTimer] = createSignal<number>(0);

const resetTimer = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  setTimer(0);
  intervalId = null;
};

const startTimer = () => {
  const startTimestamp = Date.now();
  if (intervalId !== null) {
    return;
  }
  intervalId = window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    setTimer(elapsed);
  }, 1000);
};

const secondsToMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const [filePageCount, setFilePageCount] = createSignal(-1);

// let doc: PDFiumDocument | undefined = undefined;

const [docImages, setDocImages] = createSignal<Array<string | undefined>>([]);

const [isReady, setIsReady] = createSignal(false);

const [w, setW] = createSignal<WindowProxy | null>(null);

const OVERVIEW = 0,
  PRESENTER = 1;

const [viewMode, setViewMode] = createSignal(OVERVIEW);

export function setDocImagesWrapper(index: number, url: string) {
  setDocImages((prev) => {
    const newArr = [...prev];
    newArr[index] = url;
    return newArr;
  });
}

_worker.addEventListener("message", (event) => {
  if (event.data.type === "worker-ready") {
    setIsReady(true);
  }
});

const data = await fetchPDF();

const handler = (e: KeyboardEvent) => {
  console.log("global key:", e.key);
  switch (e.key) {
    case "ArrowRight":
    case " ":
      nextPage();
      break;
    case "ArrowLeft":
      previousPage();
      break;
    case "Escape":
      if (w()) {
        closePopup();
      }
      break;
    default:
      break;
  }
};

function PopupRoot() {
  onSettled(() => {
    w()?.window.addEventListener("keydown", handler);
  });
  onCleanup(() => w()?.window.removeEventListener("keydown", handler));
  return (
    <div class="aspect-video">
      <div class="overflow-hidde h-[min(100vh,calc(100vw*9/16))] w-[min(100vw,calc(100vh*16/9))]">
        <Show when={docImages()[globalCount()]}>
          <img
            src={docImages()[globalCount()]}
            alt="slide"
            class="h-full w-auto object-cover object-left"
          />
        </Show>
      </div>
    </div>
  );
}

const handleFileSelect =
  (_type: "no-notes" | "notes-right") => async (selectedFile: File) => {
    console.log("Selected file:", selectedFile);
    const u =
      "bytes" in Blob.prototype
        ? await selectedFile.bytes()
        : await selectedFile.arrayBuffer().then((buf) => new Uint8Array(buf));

    try {
      await worker.loadPDF(transfer(u, [u.buffer]));
      const c = await worker.pageCount();
      setFilePageCount(c);
      for (let i = 0; i < c; i++) {
        await worker.renderPDF(i, proxy(setDocImagesWrapper));
      }
      console.log(docImages());
    } catch (error) {
      console.error("Failed to process PDF:", error);
    } finally {
    }
  };

const nextPage = () => {
  document.startViewTransition(() => {
    if (filePageCount() <= 0) return;
    setGlobalCount((prev) => Math.min(prev + 1, filePageCount() - 1));
    console.log("Current page:", globalCount());
  });
};

const previousPage = () => {
  document.startViewTransition(() => {
    if (filePageCount() <= 0) return;
    setGlobalCount((prev) => Math.max(0, prev - 1));
    console.log("Current page:", globalCount());
  });
};

function popup() {
  const _w = window.open("", "", "left=100,top=100,width=320,height=180");
  setW(_w);
  console.log(_w);

  // todo: when does vite support css import attributes?
  // @ts-expect-error 误报
  const styles = new _w.CSSStyleSheet();
  styles.replaceSync(_styles);
  _w?.document.adoptedStyleSheets?.push(styles);
  _w?.addEventListener("beforeunload", () => {
    setW(null);
    resetTimer();
  });
  startTimer();
  render(() => <PopupRoot />, _w!.document!.querySelector("body")!);
}

function closePopup() {
  w()?.close();
  setW(null);
}

function App() {
  // const params = new URLSearchParams(window.location.search);
  // const fileUrl = params.get("file");
  // console.log(params, fileUrl);
  // if (fileUrl) {
  //   const f = createResource(async () => {
  //     const res = await fetch(fileUrl);
  //     if (!res.ok) {
  //       throw new Error(`Failed to fetch file: ${res.statusText}`);
  //     }
  //     const blob = await res.blob();
  //     const fileName = fileUrl.split("/").pop() || "downloaded.pdf";
  //     const file = new File([blob], fileName, { type: blob.type });
  //     console.log(res);
  //     return file;
  //   });
  //   console.log(f);
  // }

  onSettled(() => {
    // I don't know why but ...
    // if url has ?file=..., load that file
    console.log("onSettled called ???");
  });

  onSettled(() => {
    window.addEventListener("keydown", handler);
    onCleanup(() => window.removeEventListener("keydown", handler));
  });

  return (
    <Layout>
      <Show when={filePageCount() > 0} fallback={<SelectFile />}>
        <Show
          when={viewMode() === PRESENTER}
          fallback={
            <div class="mb-20 grid grid-cols-3 gap-4 p-4">
              <For each={Array(filePageCount()).fill(0)}>
                {(_, index) => (
                  <div
                    class={cx(
                      "aspect-video cursor-pointer outline transition-all",
                      index() === globalCount() && "outline-4 outline-cat-teal",
                      index() !== globalCount() &&
                        "outline-cat-surface2 hover:outline-4",
                    )}
                    onClick={() => setGlobalCount(index())}
                  >
                    <Show when={docImages()[index()]}>
                      <img
                        src={docImages()[index()]}
                        class={cx(
                          "h-full object-cover object-left",
                          viewClasses[index()],
                        )}
                      />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          }
        >
          {/* Left: hint */}
          {/* Right Top: Current page */}
          {/* Right Bottom: Next page */}
          <div class="grid h-full grid-cols-21 gap-4">
            <div class="col-span-13 flex items-center justify-center">
              <div class="relative aspect-video w-full">
                <Show when={docImages()[globalCount()]}>
                  <img
                    src={docImages()[globalCount()]}
                    alt="current slide note"
                    class="aspect-video h-full object-cover object-right"
                  />
                  <div class="absolute -top-8 font-mono">
                    {secondsToMMSS(timer())}
                  </div>
                  <div class="absolute -top-8 right-0 font-mono">
                    {globalCount() + 1}/{filePageCount()}
                  </div>
                </Show>
              </div>
            </div>
            <div class="col-span-8 flex flex-col items-center justify-center gap-4">
              <div class="aspect-video w-full overflow-hidden">
                <Show when={docImages()[globalCount()]}>
                  <img
                    src={docImages()[globalCount()]}
                    alt="current slide"
                    id="presenter-current-left"
                    class={cx(
                      "aspect-video h-full object-cover object-left",
                      viewClasses[globalCount()],
                    )}
                  />
                </Show>
              </div>
              <div class="aspect-video w-full overflow-hidden">
                <Show when={docImages()[globalCount() + 1]}>
                  <img
                    src={docImages()[globalCount() + 1]}
                    alt="next slide"
                    class={cx(
                      "aspect-video h-full cursor-pointer object-cover object-left opacity-50",
                      viewClasses[globalCount() + 1],
                    )}
                    onClick={nextPage}
                  />
                </Show>
              </div>
            </div>
          </div>
          {/* Bottom: notes */}
        </Show>
        {/* Control buttons */}
        <div class="pointer-events-none fixed bottom-4 left-4 flex justify-between gap-6 p-4 [view-transition-name:anything]">
          <CircleButton
            onClick={previousPage}
            classIcon="icon-[fluent--arrow-left-24-regular]"
            title="Previous page"
          />
          <CircleButton
            onClick={nextPage}
            classIcon="icon-[fluent--arrow-right-24-regular]"
            title="Next page"
          />
          <div
            class="pointer-events-auto relative flex h-8 w-20 cursor-pointer place-content-between place-items-center rounded-full bg-cat-surface0/50 text-cat-subtext0/50 outline outline-cat-subtext0/50 transition-all hover:bg-cat-surface0/80 hover:outline-cat-subtext0 dark:bg-cat-surface0/70"
            onClick={() => {
              document.startViewTransition(() => {
                setViewMode((prev) =>
                  prev === OVERVIEW ? PRESENTER : OVERVIEW,
                );
              });
            }}
          >
            <div
              class={cx(
                "z-20 grid aspect-square h-full place-items-center rounded-full",
                viewMode() === OVERVIEW &&
                  "text-cat-surface0/70 hover:text-cat-surface0 hover:outline-cat-subtext0",
              )}
            >
              <button class="pointer-events-none icon-[fluent--grid-24-filled] aspect-square h-full" />
            </div>
            <div
              class={cx(
                "z-20 grid aspect-square h-full place-items-center rounded-full",
                viewMode() !== OVERVIEW &&
                  "text-cat-surface0/70 hover:text-cat-surface0 hover:outline-cat-subtext0",
              )}
            >
              <button class="pointer-events-none icon-[fluent--content-view-gallery-24-filled] aspect-square h-full" />
            </div>
            <div
              class={cx(
                "absolute z-10 aspect-square h-full rounded-full border-4 border-transparent bg-cat-subtext0/50 bg-clip-padding text-cat-surface0/70 transition-all ease-in hover:bg-cat-subtext0/80",
                viewMode() === OVERVIEW ? "left-0" : "left-0 translate-x-12",
              )}
            />
          </div>
          <CircleButton
            onClick={() => {
              if (!w()) {
                popup();
              } else {
                closePopup();
              }
            }}
            // iconClass="icon-[fluent--window-new-24-filled]"
            classIcon="icon-[mdi--projector] scale-125"
            toggled={!!w()}
            title="Show slide in new window"
            toggledTitle="Close slide window"
          />
        </div>
        {/* ends */}
      </Show>
    </Layout>
  );
}

function Loading() {
  onCleanup(() => {
    if (data) {
      void handleFileSelect("no-notes")(data);
    }
    console.log("Loading unmounted");
  });
  return <p>Loading...</p>;
}

function Layout(props: { children: JSX.Element }) {
  return (
    <Show when={isReady()} fallback={<Loading />}>
      <header></header>
      <main class="mx-10 my-10">{props.children}</main>
      <footer></footer>
    </Show>
  );
}

async function fetchPDF(url?: string): Promise<File | undefined> {
  console.log(url);
  const params = url
    ? new URLSearchParams(new URL(url, window.location).search)
    : new URLSearchParams(window.location.search);
  const fileUrl = params.get("file");
  console.log(params, fileUrl);
  if (fileUrl) {
    // fetch
    // and convert to File
    const res = await fetch(fileUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${res.statusText}`);
    }
    const blob = await res.blob();
    const fileName = fileUrl.split("/").pop() || "downloaded.pdf";
    const file = new File([blob], fileName, { type: blob.type });
    console.log(res);
    return file;
  }
}

function CircleButton(props: {
  onClick: () => void;
  classIcon: string;
  title: string;
  toggled?: boolean;
  toggledTitle?: string;
}) {
  return (
    <div
      class={cx(
        "pointer-events-auto grid h-8 w-8 cursor-pointer place-items-center rounded-full outline transition-all",
        props.toggled
          ? "bg-cat-subtext0/50 text-cat-surface0/70 outline-cat-subtext0/50 hover:bg-cat-subtext0/80 hover:text-cat-surface0 hover:outline-cat-subtext0"
          : "bg-cat-surface0/50 text-cat-subtext0/50 outline-cat-subtext0/50 hover:bg-cat-surface0/80 hover:text-cat-subtext0 hover:outline-cat-subtext0 dark:bg-cat-surface0/70",
      )}
      onClick={props.onClick}
    >
      <button
        class={cx(props.classIcon, "cursor-pointer")}
        title={props.toggled ? props.toggledTitle : props.title}
      />
    </div>
  );
}

function SelectFile() {
  return (
    <>
      <h1 class="text-4xl font-extrabold">PDF Presenter View</h1>
      <div class="mt-30 grid h-80 w-full grid-cols-2 gap-16 px-10 lg:px-20">
        <DropZone type="no-notes" onFileSelect={handleFileSelect("no-notes")} />
        <DropZone
          type="notes-right"
          onFileSelect={handleFileSelect("notes-right")}
        />
      </div>
      <div>
        <p>Example:</p>
        <ul>
          <li class="ml-4 list-disc underline">
            <a
              href="/?file=example.pdf"
              onClick={(e) => {
                // If holding Ctrl or Cmd, open in new tab
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                  return;
                }
                e.preventDefault();
                void fetchPDF("/?file=example.pdf").then((file) => {
                  if (file) {
                    void handleFileSelect("no-notes")(file);
                  }
                });
              }}
            >
              Touying Metropolis demo
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
