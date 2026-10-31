import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Règles qui s'appuient sur les types : elles voient les promesses non attendues,
  // les conditions toujours vraies, les any implicites venus d'une dépendance.
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Retirer un champ par déstructuration ({ champ: _, ...reste }) est un usage voulu.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
    },
  },
  { files: ["**/*.mjs"], extends: [tseslint.configs.disableTypeChecked] },
  // En dernier : désactive les règles de mise en forme, laissées à Prettier.
  prettier,
]);
