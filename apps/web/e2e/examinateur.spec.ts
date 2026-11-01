import { expect, type Page, test } from "@playwright/test";
import { CODE_DE_TEST } from "../playwright.config";

const entrer = async (page: Page) => {
  await page.goto("/acces?suite=/system-design/examinateur");
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST);
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.getByRole("button", { name: "Commencer une séance" }).click();
};

const repondre = async (page: Page, texte: string) => {
  const saisie = page.getByLabel("Votre réponse");
  await expect(saisie).toBeFocused();
  await saisie.fill(texte);
  await page.getByRole("button", { name: "Répondre" }).click();
};

const retours = (page: Page) => page.getByText(/^\d+ \/ \d+ · niveau/);

// L'examinateur simulé relance toujours la première réponse, puis rattache la
// suivante à la racine de l'arbre.
test("une séance de dix questions, relances comprises, se termine par un verdict", async ({
  page,
}) => {
  await entrer(page);

  for (let i = 1; i <= 10; i++) {
    await expect(page.getByText(`Question ${String(i)} sur 10`)).toBeVisible();
    await repondre(page, "Une première idée.");
    await expect(page.getByText("Pouvez-vous préciser ?")).toHaveCount(i);
    await repondre(page, "Je précise.");
    await expect(retours(page)).toHaveCount(i);
  }

  await expect(
    page.getByRole("heading", { name: /^Verdict : / }),
  ).toBeVisible();
  await expect(page.getByText(/réponses? évaluées? par mots-clés/)).toHaveCount(
    0,
  );
});

test("quand l'IA tombe en panne, la séance continue par mots-clés", async ({
  page,
}) => {
  await entrer(page);

  await repondre(page, "panne");
  await expect(page.getByText(/L'examinateur IA ne répond pas/)).toBeVisible();
  await expect(page.getByText("Évalué par mots-clés.")).toHaveCount(1);

  // Plus d'appel à l'IA : pas de relance, la réponse est notée tout de suite.
  await expect(page.getByText("Question 2 sur 10")).toBeVisible();
  await repondre(page, "Une réponse.");
  await expect(page.getByText("Évalué par mots-clés.")).toHaveCount(2);
  await expect(page.getByText("Pouvez-vous préciser ?")).toHaveCount(0);
});
