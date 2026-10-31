import path from "node:path";
import type { NextConfig } from "next";

const racineDuDepot = path.join(import.meta.dirname, "../..");

const nextConfig: NextConfig = {
  // Serveur autonome pour l'image Docker : seuls les fichiers réellement importés
  // sont copiés, sans node_modules complet.
  output: "standalone",
  // En monorepo, les dépendances vivent à la racine : le traçage doit partir de là.
  outputFileTracingRoot: racineDuDepot,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: racineDuDepot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
