import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    // Aucun test tant qu'il n'y a pas de logique à tester : les premiers arrivent
    // avec les schémas de contenu (lot 1).
    passWithNoTests: true,
  },
});
