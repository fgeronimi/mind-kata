import { expect, test } from "@playwright/test";

test("une série de dix situations se joue de bout en bout", async ({
  page,
}) => {
  await page.goto("/system-design/exercices");
  await page.getByRole("button", { name: "Commencer la série" }).click();

  for (let i = 1; i <= 10; i++) {
    const titre = page.getByRole("heading", {
      name: `Situation ${String(i)} sur 10`,
    });
    await expect(titre).toBeFocused();
    await page.getByRole("textbox").fill("timeout, retry et idempotence");
    await page
      .getByRole("button", { name: "Révéler la réponse attendue" })
      .click();
    await expect(page.getByText(/^\d+ \/ \d+$/)).toBeVisible();
    await page
      .getByRole("button", { name: i % 2 === 0 ? "À revoir" : "Je savais" })
      .click();
  }

  await expect(
    page.getByRole("heading", { name: "Bilan de la série" }),
  ).toBeFocused();
  await expect(page.getByText("5 sur 10 marquées comme sues.")).toBeVisible();

  const progression = await page.evaluate(() =>
    window.localStorage.getItem("mind-kata:progression:system-design"),
  );
  expect(Object.keys(JSON.parse(progression ?? "{}") as object)).toHaveLength(
    10,
  );
});

test("le score suit la réponse, puis les corrections, règle du parent comprise", async ({
  page,
}) => {
  await page.goto("/system-design/exercices");
  // Une seule situation dans cette catégorie : le tirage devient déterministe.
  await page
    .getByLabel("Catégorie")
    .selectOption({ label: "Cache et performance" });
  await page.getByRole("button", { name: "Commencer la série" }).click();

  await page
    .getByRole("textbox")
    .fill("C'est une ruée sur le cache : je mets un VERROU.");
  await page
    .getByRole("button", { name: "Révéler la réponse attendue" })
    .click();

  // « ruée sur le cache » (synonyme) et « verrou » reconnus : 2 nœuds sur 4.
  await expect(page.getByText("2 / 4")).toBeVisible();
  await expect(page.getByText("Niveau atteint : Senior")).toBeVisible();
  await expect(page.getByLabel("verrou")).toBeChecked();

  // Correction : l'utilisateur ajoute un élément formulé autrement.
  await page.getByLabel("stale-while-revalidate").check();
  await expect(page.getByText("3 / 4")).toBeVisible();

  // Sans la racine, les enfants deviennent orphelins et ne comptent plus.
  await page.getByLabel("cache stampede").uncheck();
  await expect(page.getByText("0 / 4")).toBeVisible();
  await expect(
    page.getByText(/2 éléments cités sans le raisonnement qui y mène/),
  ).toBeVisible();
});
