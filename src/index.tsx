/* @refresh reload */
import "solid-devtools/setup";
import { render } from "solid-js/web";
import App from "./App.tsx";

const root = document.getElementById("root");

render(() => <App />, root!);
