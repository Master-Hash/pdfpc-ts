/* @refresh reload */
// import "solid-devtools/setup";
import { render } from "@solidjs/web";

import App from "./App.tsx";

const root = document.getElementById("root");

render(() => <App />, root!);
