import { expect, test } from "@playwright/test";
import { CODE_DE_TEST } from "../playwright.config";

// Pas de micro ni de haut-parleur en test : la reconnaissance vocale renvoie un texte
// fixe, et la synthèse note ce qu'on lui demande de lire.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const fenetre = window as unknown as Record<string, unknown>;
    const lectures: string[] = [];
    fenetre["__lectures"] = lectures;
    class FausseReconnaissance {
      lang = "";
      continuous = false;
      interimResults = false;
      onresult: ((e: unknown) => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        setTimeout(() => {
          this.onresult?.({ results: [[{ transcript: "réponse dictée" }]] });
        }, 20);
      }
      stop() {
        setTimeout(() => this.onend?.(), 10);
      }
    }
    fenetre["SpeechRecognition"] = FausseReconnaissance;
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (enonce: { text: string }) => lectures.push(enonce.text),
        cancel: () => undefined,
        getVoices: () => [],
      },
    });
  });
});

test("on dicte sa réponse, et l'examinateur est lu à voix haute", async ({
  page,
}) => {
  await page.goto("/acces?suite=/system-design/examinateur");
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST);
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.getByRole("button", { name: "Commencer une séance" }).click();
  await page.getByLabel("Lire l'examinateur à voix haute").check();

  await page.getByRole("button", { name: "Parler" }).click();
  await expect(page.getByText(/^Je vous écoute/)).toBeVisible();
  await expect(page.getByLabel("Votre réponse")).toHaveValue("réponse dictée");
  await page.getByRole("button", { name: "Arrêter la dictée" }).click();
  await expect(page.getByRole("button", { name: "Parler" })).toBeVisible();

  await page.getByRole("button", { name: "Répondre" }).click();
  await expect(page.getByText("réponse dictée", { exact: true })).toBeVisible();
  await expect(page.getByText("Pouvez-vous préciser ?")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { __lectures: string[] }).__lectures,
      ),
    )
    .toContain("Pouvez-vous préciser ?");
});

test("la préférence de lecture est gardée d'une visite à l'autre", async ({
  page,
}) => {
  await page.goto("/acces?suite=/system-design/examinateur");
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST);
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.getByRole("button", { name: "Commencer une séance" }).click();
  await page.getByLabel("Lire l'examinateur à voix haute").check();

  await page.reload();
  await page.getByRole("button", { name: "Commencer une séance" }).click();
  await expect(
    page.getByLabel("Lire l'examinateur à voix haute"),
  ).toBeChecked();
});
