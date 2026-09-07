import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Registered at the top of each component-test file and never unregistered by
// hand — teardown races React's scheduler: a render queued after the last
// assertion finds `window` already gone and kills the run at exit 1 with every
// test passing.
//
// These shims are NOT contained to this file: GlobalRegistrator's globals leak
// into other files in the same worker. Its fetch-spec Request silently drops
// the Cookie header (a forbidden header in browsers), which failed the
// edge-cloudflare suite on order-dependent seeds — so the test script runs
// with --isolate to give every file a fresh global object.
//
// Registering here rather than in preload still matters: preload runs in every
// file's context, and happy-dom's ReadableStream/WritableStream shims break
// server-side libraries other suites exercise (@react-email/render's piping).

export function registerDom() {
  GlobalRegistrator.register();
}
