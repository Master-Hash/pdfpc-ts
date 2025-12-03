import { PublisherServer } from "@fastly/compute-js-static-publish";
/// <reference types="@fastly/js-compute" />
import { env } from "fastly:env";

import rc from "../static-publish.rc.js";
const publisherServer = PublisherServer.fromStaticPublishRc(rc);

// eslint-disable-next-line no-restricted-globals
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));
async function handleRequest(event) {
  console.log("FASTLY_SERVICE_VERSION", env("FASTLY_SERVICE_VERSION"));

  const request = event.request;

  const response = await publisherServer.serveRequest(request);
  response?.headers.append(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response?.headers.append("Alt-Svc", 'h3=":443"; ma=2592000');
  response?.headers.append("Cross-Origin-Embedder-Policy", "require-corp");
  response?.headers.append("Cross-Origin-Opener-Policy", "same-origin");
  response?.headers.append(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self' data: blob:; connect-src *;",
  );
  if (response != null) {
    return response;
  }

  // Do custom things here!
  // Handle API requests, serve non-static responses, etc.

  return new Response("Not found", { status: 404 });
}
