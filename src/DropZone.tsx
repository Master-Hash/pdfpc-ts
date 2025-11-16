import classNames from "classnames";
import { createSignal } from "solid-js";

type DropZoneProps = {
  type: "no-notes" | "notes-right";
  onFileSelect: (file: File) => void;
};
export function DropZone(props: DropZoneProps) {
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
          "bg-cat-surface0 outline-2": isDragging(),
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
