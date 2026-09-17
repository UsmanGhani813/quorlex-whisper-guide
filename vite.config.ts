// Uses @lovable.dev/vite-tanstack-config as a build-time helper that bundles
// TanStack Start + Nitro + Tailwind + tsconfigPaths + React and produces a
// Vercel-compatible output when NITRO_PRESET=vercel is set. It is a devDependency
// that runs only on the build server and does not ship any code, branding, or
// telemetry to the browser.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },
});
