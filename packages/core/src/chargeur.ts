import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { type Architecture, schemaArchitecture } from "./architecture";
import { type Concept, schemaConcept } from "./concept";
import { type Domaine, schemaDomaine } from "./domaine";
import { type Guide, schemaGuide } from "./guide";

// Les erreurs de contenu sont lues par les rédacteurs : dans leur langue.
z.config(z.locales.fr());

export interface Pack {
  domaine: Domaine;
  concepts: Concept[];
  architectures: Architecture[];
  guides: Guide[];
}

// Toutes les erreurs d'un pack sont remontées d'un coup : corriger un fichier, relancer,
// découvrir le suivant, c'est autant de builds perdus.
export class ErreurDeContenu extends Error {
  readonly erreurs: readonly string[];

  constructor(erreurs: readonly string[]) {
    super(
      `${String(erreurs.length)} erreur(s) dans le contenu :\n` +
        erreurs.map((e) => `  - ${e}`).join("\n"),
    );
    this.name = "ErreurDeContenu";
    this.erreurs = erreurs;
  }
}

const enTete = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// Lit un pack de domaine depuis le disque, le valide et vérifie les références croisées.
// Exécuté au build : un pack invalide fait échouer le build plutôt qu'une page.
export function chargerPack(dossier: string): Pack {
  const erreurs: string[] = [];
  const relatif = (fichier: string) =>
    path.join(path.basename(dossier), path.relative(dossier, fichier));

  const valider = <S extends z.ZodType>(
    schema: S,
    donnee: unknown,
    fichier: string,
  ): z.infer<S> | undefined => {
    const resultat = schema.safeParse(donnee);
    if (resultat.success) return resultat.data;
    for (const probleme of resultat.error.issues) {
      const champ = probleme.path.join(".") || "(racine)";
      erreurs.push(`${relatif(fichier)} : ${champ} — ${probleme.message}`);
    }
    return undefined;
  };

  const lireYaml = (fichier: string, texte: string): unknown => {
    try {
      const donnee: unknown = parse(texte);
      return donnee;
    } catch (e) {
      erreurs.push(`${relatif(fichier)} : YAML illisible — ${String(e)}`);
      return undefined;
    }
  };

  const fichierDomaine = path.join(dossier, "domaine.yaml");
  if (!existsSync(fichierDomaine)) {
    throw new ErreurDeContenu([
      `${relatif(fichierDomaine)} : fichier manquant`,
    ]);
  }
  const domaine = valider(
    schemaDomaine,
    lireYaml(fichierDomaine, readFileSync(fichierDomaine, "utf8")),
    fichierDomaine,
  );
  // Sans domaine valide, impossible de valider le reste : les schémas en dépendent.
  if (!domaine) throw new ErreurDeContenu(erreurs);

  const lireMarkdown = <S extends z.ZodType<{ id: string }>>(
    type: string,
    sousDossier: string,
    schema: S,
  ) => {
    const repertoire = path.join(dossier, sousDossier);
    if (!existsSync(repertoire)) return [];
    if (!(domaine.types as readonly string[]).includes(type)) {
      erreurs.push(
        `${relatif(repertoire)} : le domaine ne déclare pas le type « ${type} » dans domaine.yaml`,
      );
      return [];
    }

    const elements: (z.infer<S> & { corps: string })[] = [];
    for (const nom of readdirSync(repertoire)
      .filter((n) => n.endsWith(".md"))
      .sort()) {
      const fichier = path.join(repertoire, nom);
      const morceaux = enTete.exec(readFileSync(fichier, "utf8"));
      if (!morceaux) {
        erreurs.push(
          `${relatif(fichier)} : en-tête YAML manquant (bloc entre deux lignes ---)`,
        );
        continue;
      }
      const [, yaml = "", corps = ""] = morceaux;
      const donnee = valider(schema, lireYaml(fichier, yaml), fichier);
      if (!donnee) continue;

      // L'identifiant sert d'URL : le nom du fichier le rend visible et garantit
      // qu'il est unique dans le dossier.
      const attendu = path.basename(nom, ".md");
      if (donnee.id !== attendu) {
        erreurs.push(
          `${relatif(fichier)} : id « ${donnee.id} » différent du nom de fichier « ${attendu} »`,
        );
        continue;
      }
      elements.push({ ...donnee, corps: corps.trim() });
    }
    return elements;
  };

  const concepts: Concept[] = lireMarkdown(
    "concept",
    "concepts",
    schemaConcept(domaine),
  );
  const architectures: Architecture[] = lireMarkdown(
    "architecture",
    "architectures",
    schemaArchitecture,
  );
  const guides: Guide[] = lireMarkdown("guide", "guides", schemaGuide).sort(
    (a, b) => a.ordre - b.ordre,
  );

  const idsConcepts = new Set(concepts.map((c) => c.id));
  const verifierLiens = (sousDossier: string, id: string, cibles: string[]) => {
    const origine = relatif(path.join(dossier, sousDossier, `${id}.md`));
    for (const cible of cibles) {
      if (!idsConcepts.has(cible)) {
        erreurs.push(`${origine} : lien vers le concept inconnu « ${cible} »`);
      }
    }
  };
  for (const c of concepts) verifierLiens("concepts", c.id, c.liens);
  for (const a of architectures)
    verifierLiens("architectures", a.id, a.concepts);

  if (erreurs.length > 0) throw new ErreurDeContenu(erreurs);
  return { domaine, concepts, architectures, guides };
}
