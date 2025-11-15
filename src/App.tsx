import { createEffect, createSignal } from "solid-js";
import { render } from "solid-js/web";
import classNames from "classnames";

// 乐，React 搞不了多根的状态同步吧
const [globalCount, setGlobalCount] = createSignal(0);

function PopupRoot() {
  return (
    <div>
      <p>{globalCount()}</p>
    </div>
  );
}

type DropZoneProps = {
  type: "no-notes" | "notes-right";
  onFileSelect: (file: File) => void;
};

function DropZone(props: DropZoneProps) {
  const [isDragging, setIsDragging] = createSignal(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        props.onFileSelect(file);
      } else {
        alert("请上传 PDF 文件");
      }
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        props.onFileSelect(file);
      }
    };
    input.click();
  };

  return (
    <div
      class={classNames(
        "outline outline-cat-subtext0 outline-dashed grid place-items-center text-2xl relative cursor-pointer",
        {
          "bg-cat-surface0 outline-cat-sapphire outline-2": isDragging(),
        }
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div>
        {props.type === "no-notes" ? (
          <>
            <span class="font-zh">⬚</span> No speaker notes
          </>
        ) : (
          <>
            <span class="font-zh">⿰</span> Speaker notes on the right
          </>
        )}
      </div>
      <span class="absolute icon-[fluent--document-add-20-filled] bottom-2 right-2 text-8xl opacity-15" />
    </div>
  );
}

function App() {
  let w: WindowProxy | null = null;

  createEffect(() => { });

  const handleFileSelect =
    (type: "no-notes" | "notes-right") => (file: File) => {
      console.log(`Selected file for ${type}:`, file.name);
      // 在这里处理 PDF 文件
      // 例如：使用 FileReader 读取文件，或使用 pdfium 加载
    };

  return (
    <>
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
      {/* 选择？拖拽？二分拖拽？ */}
      <button
        onclick={(e) => {
          console.log(e);
          if (!w) {
            w = window.open("", "", "left=100,top=100,width=320,height=320");
            console.log(w);
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
      ></button>
      <footer></footer>
    </>
  );
}

export default App;
