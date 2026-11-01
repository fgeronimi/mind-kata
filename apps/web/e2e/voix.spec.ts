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

// Sans VOIX_FOURNISSEUR, la route répond « indisponible » : c'est la voix du
// navigateur qui lit.
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

test("la voix du serveur est jouée quand elle est disponible", async ({
  page,
}) => {
  const lus: string[] = [];
  await page.route("/api/examinateur/voix", async (route) => {
    lus.push((route.request().postDataJSON() as { texte: string }).texte);
    await route.fulfill({ contentType: "audio/mpeg", body: "mp3" });
  });
  // Le faux MP3 ne se décode pas : on note seulement que la lecture est lancée.
  await page.addInitScript(() => {
    const fenetre = window as unknown as Record<string, unknown>;
    fenetre["__jouees"] = 0;
    HTMLMediaElement.prototype.play = function () {
      (fenetre["__jouees"] as number)++;
      return Promise.resolve();
    };
  });

  await page.goto("/acces?suite=/system-design/examinateur");
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST);
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.getByRole("button", { name: "Commencer une séance" }).click();
  await page.getByLabel("Lire l'examinateur à voix haute").check();
  await page.getByLabel("Votre réponse").fill("une réponse");
  await page.getByRole("button", { name: "Répondre" }).click();

  await expect(page.getByText("Pouvez-vous préciser ?")).toBeVisible();
  await expect.poll(() => lus).toContain("Pouvez-vous préciser ?");
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { __jouees: number }).__jouees),
    )
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => (window as unknown as { __lectures: string[] }).__lectures,
    ),
  ).toEqual([]);
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
