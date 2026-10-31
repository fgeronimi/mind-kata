# syntax=docker/dockerfile:1

FROM node:26-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /depot

# Node 25+ ne fournit plus Corepack : pnpm est installé à la version figée dans
# le champ packageManager, pour ne pas la dupliquer ici.
FROM base AS pnpm
COPY package.json ./
RUN npm install --global "$(node -p 'require("./package.json").packageManager')"

# Seuls les manifestes : cette couche reste en cache tant que les dépendances
# ne changent pas, même si le code change.
FROM pnpm AS dependances
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM dependances AS build
COPY . .
RUN pnpm --filter @mind-kata/web build

FROM base AS execution
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=8080
COPY --from=build --chown=node:node /depot/apps/web/.next/standalone ./
# Le serveur autonome ne copie pas les ressources statiques : elles sont ajoutées
# à l'emplacement où server.js les cherche.
COPY --from=build --chown=node:node /depot/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 8080
CMD ["node", "apps/web/server.js"]
