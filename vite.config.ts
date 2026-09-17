import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Expose VITE_* env vars to the client + server bundles.
  const env = loadEnv(mode, process.cwd(), "");
  const define: Record<string, string> = {};
  for (const key of Object.keys(env)) {
    if (key.startsWith("VITE_")) {
      define[`import.meta.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  return {
    define,
    resolve: {
      dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
    },
    plugins: [
      tsConfigPaths(),
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
      }),
      react(),
    ],
    server: {
      host: true,
      strictPort: false,
    },
  };
});
