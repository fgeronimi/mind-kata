import { defineConfig } from "vitest/config";

export default defineConfig({
  // Même alias que tsconfig.json : « @/lib/… » part de la racine de l'application.
  resolve: { alias: { "@": import.meta.dirname } },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
