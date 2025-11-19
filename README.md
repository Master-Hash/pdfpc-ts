# pdfpc-ts

README TRANSLATED BY LLM

Re-implementing a slideshow with presenter view in the browser, similar to Pympress and pdfpc, but with better performance.

## Usage

I assume the PDF used for presentations has a 16:9 aspect ratio. If there are notes, the convention is that the left half of each page is the main content, and the right half is the notes. For example:

![PDF Example](b43c7f99-c5f9-4084-aa70-c1561e8aafee.png)

↑ Image source: [Touying Documentation](https://touying-typ.github.io/zh/docs/external/pympress/)

I recommend using Typst + Touying to create presentation PDFs.

The interface usage should be self-explanatory. Generally speaking, there are three page states:

* Home page: select a file to enter overview
* Overview: upon entry, each page is rendered sequentially. Click a page to start presenting from that page, or click the button below to start from the beginning
* Presentation mode: the main window shows the current page, next page, and current page notes. A popup window will open; it's recommended to manually drag it to the desired location and display it in fullscreen.

During presentation, you can also switch between overview and presentation modes to quickly navigate pages. The popup window is not affected.

Supported keyboard shortcuts:

* ←→ to navigate pages

Theoretically supports fetching PDFs from the network. The PDF should be marked with Cross-Origin-Resource-Policy to allow requests. Currently, only example files from the same domain can be loaded because I was too lazy to modify the CSP.

## Limitations

This project is good enough for my own use; I don't want to create a second PowerPoint.

* Mobile UI is not optimized
* PDF format options are not as flexible as pdfpc
* No pen or laser pointer
* Does not support text selection, hyperlinks, etc., because I only render bitmaps
* Does not support the 'b' key for blacking out the screen
* Does not support videos
* Only supports very modern browsers. For example, I use the `using` keyword, which requires Chrome >= 134, Firefox >= 141. Safari is dead. Praying I can use my own computer for the next presentation...

## Known Issues

* wasm-vips consumes too much memory

## Demo

![](https://assets.hash.moe/pdfpc-ts-demo.mp4)

## Motivation

* Browsers have supported [multiple windows](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) from the beginning.
* [Chrome 100 added support for the Window Management API](https://developer.chrome.google.cn/docs/capabilities/web-apis/window-management), which helps create windows in appropriate positions. The official documentation mentions presenter view as one of the potential use cases, but I haven't found such a solution.
* I'm a pdfpc user and also responsible for packaging it for the msys2 platform. pdfpc has poor performance and always stutters when changing slides. I also don't like GTK 3, but I'm not capable of migrating it.
* RIIR (Rewrite It In Rust) is an alternative to migration, with significant advantages for cross-platform and even wasm platforms. Current native GUI frameworks like winit [have wrapped `window.open()`](https://github.com/rust-windowing/winit/pull/3801), but Rust GUI frameworks are generally immature at the moment. I only managed to get Hello World running with iced (Slint might work too, haven't tried). Avalonia is also promising, but wasm support is just getting started.
* So I returned to frontend development, which I'm most skilled at.

The framework choice is Solid, because React's data flows from root to leaves, and the state of two separately mounted components cannot communicate at all. With multiple windows, the window and document are independent and must be mounted separately. Solid is based on signals, making it very convenient to share global state.
