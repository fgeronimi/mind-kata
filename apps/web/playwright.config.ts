import { defineConfig, devices } from "@playwright/test";

const port = 3100;

// Les parcours tournent contre le serveur de production (sortie standalone, comme dans
// l'image Docker) : lancer `make build` avant `make test-e2e`.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: `http://localhost:${String(port)}`,
    trace: "retain-on-failure",
  },
  // Un seul navigateur : le parcours ne dépend d'aucune particularité de moteur, et
  // chaque navigateur ajouté coûte une installation en CI.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Comme le Dockerfile : le serveur autonome a besoin des ressources statiques à côté.
    command: `cp -R .next/static .next/standalone/apps/web/.next/ && PORT=${String(port)} node .next/standalone/apps/web/server.js`,
    port,
    reuseExistingServer: !process.env["CI"],
  },
});
