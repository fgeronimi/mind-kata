import { expect, test } from "@playwright/test";
import { CODE_DE_TEST } from "../playwright.config";

test("l'examinateur demande le code d'accès, puis ouvre la page", async ({
  page,
}) => {
  await page.goto("/system-design/examinateur");
  await expect(page).toHaveURL(
    /\/acces\?suite=%2Fsystem-design%2Fexaminateur$/,
  );

  await page.getByLabel("Code d'accès").fill("pas-le-bon-code");
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page.getByText("Code incorrect.")).toBeVisible();

  // Saisi comme affiché : en groupes et en majuscules.
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST.toUpperCase());
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page).toHaveURL(/\/system-design\/examinateur$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Examinateur" }),
  ).toBeVisible();
  await expect(page.getByText("L'examinateur arrive bientôt.")).toBeVisible();
});

test("l'API de l'examinateur refuse une requête sans code", async ({
  request,
}) => {
  const reponse = await request.post("/api/examinateur");
  expect(reponse.status()).toBe(401);
});

test("un lien piégé ne renvoie pas vers un autre site", async ({ page }) => {
  await page.goto("/acces?suite=//exemple.org");
  await page.getByLabel("Code d'accès").fill(CODE_DE_TEST);
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
});
