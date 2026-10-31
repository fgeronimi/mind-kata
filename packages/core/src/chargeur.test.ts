import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { chargerPack, ErreurDeContenu } from "./chargeur";

const domaine = `
id: cuisine
nom: Cuisine
langue: fr
description: Techniques de base de la cuisine professionnelle.
niveaux:
  - { id: commis, libelle: Commis }
  - { id: chef, libelle: Chef }
categories:
  - { id: sauces, libelle: Sauces }
types: [concept, architecture, guide]
`;

const concept = (id: string, liens: string[] = []) => `---
id: ${id}
terme: ${id}
categorie: sauces
liens: [${liens.join(", ")}]
niveaux:
  commis: Sait le réaliser.
  chef: Sait quand ne pas l'utiliser.
---
Corps du concept ${id}.
`;

const brigade = `---
id: brigade
titre: Brigade de cuisine
probleme: Servir cent couverts en même temps
briques: [chef, postes, passe]
concepts: [roux]
---
\`\`\`mermaid
graph LR
  chef --> postes --> passe
\`\`\`
`;

const dossiers: string[] = [];

// Écrit un pack dans un dossier temporaire ; chaque test décrit exactement son contenu.
const ecrirePack = (fichiers: Record<string, string>) => {
  const racine = mkdtempSync(path.join(tmpdir(), "mind-kata-"));
  dossiers.push(racine);
  const dossier = path.join(racine, "cuisine");
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    const complet = path.join(dossier, chemin);
    mkdirSync(path.dirname(complet), { recursive: true });
    writeFileSync(complet, contenu);
  }
  return dossier;
};

const erreursDe = (dossier: string): readonly string[] => {
  try {
    chargerPack(dossier);
  } catch (e) {
    if (e instanceof ErreurDeContenu) return e.erreurs;
    throw e;
  }
  throw new Error("le pack aurait dû être refusé");
};

afterEach(() => {
  for (const d of dossiers.splice(0))
    rmSync(d, { recursive: true, force: true });
});

describe("chargerPack", () => {
  it("charge un pack valide avec son corps Markdown", () => {
    const pack = chargerPack(
      ecrirePack({
        "domaine.yaml": domaine,
        "concepts/roux.md": concept("roux", ["bechamel"]),
        "concepts/bechamel.md": concept("bechamel", ["roux"]),
        "architectures/brigade.md": brigade,
      }),
    );
    expect(pack.domaine.id).toBe("cuisine");
    expect(pack.concepts.map((c) => c.id)).toEqual(["bechamel", "roux"]);
    expect(pack.concepts[1]?.corps).toBe("Corps du concept roux.");
    expect(pack.architectures[0]?.corps).toContain("```mermaid");
  });

  it("trie les guides selon leur ordre", () => {
    const guide = (id: string, ordre: number) =>
      `---\nid: ${id}\ntitre: ${id}\nresume: Résumé.\nordre: ${String(ordre)}\n---\nCorps.\n`;
    const pack = chargerPack(
      ecrirePack({
        "domaine.yaml": domaine,
        "guides/service.md": guide("service", 2),
        "guides/mise-en-place.md": guide("mise-en-place", 1),
      }),
    );
    expect(pack.guides.map((g) => g.id)).toEqual(["mise-en-place", "service"]);
  });

  it("accepte un pack sans dossier pour un type déclaré", () => {
    const pack = chargerPack(ecrirePack({ "domaine.yaml": domaine }));
    expect(pack.concepts).toEqual([]);
  });

  it("refuse un pack sans domaine.yaml", () => {
    expect(
      erreursDe(ecrirePack({ "concepts/roux.md": concept("roux") })),
    ).toEqual(["cuisine/domaine.yaml : fichier manquant"]);
  });

  it("indique le fichier et le champ fautifs", () => {
    const erreurs = erreursDe(
      ecrirePack({
        "domaine.yaml": domaine,
        "concepts/roux.md": concept("roux").replace(
          "categorie: sauces",
          "categorie: patisserie",
        ),
      }),
    );
    expect(erreurs).toHaveLength(1);
    expect(erreurs[0]).toMatch(/^cuisine\/concepts\/roux\.md : categorie — /);
  });

  it("remonte toutes les erreurs d'un coup", () => {
    const erreurs = erreursDe(
      ecrirePack({
        "domaine.yaml": domaine,
        "concepts/roux.md": concept("roux", ["veloute"]),
        "concepts/bechamel.md": "pas d'en-tête",
        "concepts/mayonnaise.md": concept("aioli"),
      }),
    );
    expect(erreurs).toEqual([
      "cuisine/concepts/bechamel.md : en-tête YAML manquant (bloc entre deux lignes ---)",
      "cuisine/concepts/mayonnaise.md : id « aioli » différent du nom de fichier « mayonnaise »",
      "cuisine/concepts/roux.md : lien vers le concept inconnu « veloute »",
    ]);
  });

  it("refuse une architecture qui cite un concept inconnu", () => {
    expect(
      erreursDe(
        ecrirePack({
          "domaine.yaml": domaine,
          "architectures/brigade.md": brigade,
        }),
      ),
    ).toEqual([
      "cuisine/architectures/brigade.md : lien vers le concept inconnu « roux »",
    ]);
  });

  it("refuse un dossier de contenu dont le type n'est pas déclaré", () => {
    const erreurs = erreursDe(
      ecrirePack({
        "domaine.yaml": domaine.replace(
          "types: [concept, architecture, guide]",
          "types: [concept]",
        ),
        "architectures/brigade.md": brigade,
      }),
    );
    expect(erreurs).toEqual([
      "cuisine/architectures : le domaine ne déclare pas le type « architecture » dans domaine.yaml",
    ]);
  });

  it("signale un YAML illisible", () => {
    const erreurs = erreursDe(
      ecrirePack({ "domaine.yaml": "niveaux: [ouvert" }),
    );
    expect(erreurs[0]).toMatch(/^cuisine\/domaine\.yaml : YAML illisible/);
  });
});
