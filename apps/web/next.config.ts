import path from "node:path";
import type { NextConfig } from "next";

const racineDuDepot = path.join(import.meta.dirname, "../..");

const nextConfig: NextConfig = {
  // Serveur autonome pour l'image Docker : seuls les fichiers réellement importés
  // sont copiés, sans node_modules complet.
  output: "standalone",
  // En monorepo, les dépendances vivent à la racine : le traçage doit partir de là.
  outputFileTracingRoot: racineDuDepot,
  // Une URL absente de generateStaticParams est rendue à l'exécution : les fichiers
  // des packs doivent donc aussi être dans l'image, pas seulement lus au build.
  outputFileTracingIncludes: {
    "/**": ["../../packages/content/*/**/*.{md,yaml}"],
  },
  // Les paquets du workspace exposent leurs sources TypeScript : Next les compile.
  transpilePackages: ["@mind-kata/core", "@mind-kata/content"],
  // Les clients Google chargent leurs définitions protobuf à l'exécution : empaquetés,
  // ils échouent à sérialiser (« toProto3JSON: don't know how to convert value »).
  // Laissés dans node_modules, copiés tels quels par le traçage.
  serverExternalPackages: ["@google-cloud/firestore", "@google/genai"],
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
