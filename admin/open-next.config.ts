import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The admin renders every page per request (no ISR), so it needs no cache bindings.
export default defineCloudflareConfig({});
