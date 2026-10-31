import { describe, expect, it } from "vitest";
import { normaliser } from "./normalisation";

describe("normaliser", () => {
  it("prépare une phrase complète", () => {
    expect(normaliser("Le Bus d'Événements, avec RabbitMQ !")).toBe(
      "le bus d evenements avec rabbitmq",
    );
  });

  it("met en minuscules, y compris les majuscules accentuées", () => {
    expect(normaliser("ÉTAT À TERME")).toBe("etat a terme");
  });

  it("retire les accents et développe les ligatures", () => {
    expect(normaliser("cœur, ex æquo, Straße")).toBe("coeur ex aequo strasse");
  });

  it("remplace ponctuation, tirets et barres par des espaces", () => {
    expect(normaliser("pub/sub, idempotency-key (clé)")).toBe(
      "pub sub idempotency key cle",
    );
  });

  it("réduit les espaces et retours à la ligne à une seule espace", () => {
    expect(normaliser("  outbox \n\n  et\tCDC  ")).toBe("outbox et cdc");
  });

  it("garde les chiffres", () => {
    expect(normaliser("Erreur 429, UUID v7")).toBe("erreur 429 uuid v7");
  });

  it("renvoie une chaîne vide pour un texte vide ou sans mot", () => {
    expect(normaliser("")).toBe("");
    expect(normaliser(" ?! ")).toBe("");
  });
});
