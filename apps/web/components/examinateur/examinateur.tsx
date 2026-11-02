"use client";

import {
  type Chemin,
  type Domaine,
  type Evaluation,
  evaluer,
  ficheDeSeance,
  type Flashcard,
  reperer,
  verdict,
} from "@mind-kata/core/evaluation";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { ArbreRevele } from "@/components/exercices/arbre-revele";
import { LONGUEUR_MAX_MESSAGE } from "@/lib/examinateur/limites";
import type { Message } from "@/lib/ia/modele";
import { demanderTour } from "./appel";
import { FicheDeSeance } from "./fiche";
import { useDictee, useLecture } from "./voix";

const TAILLE_SEANCE = 10;

interface Props {
  domaine: Pick<Domaine, "id" | "niveaux">;
  cartes: Flashcard[];
  // Terme de chaque concept, pour les liens de la fiche de fin de séance.
  termes: Record<string, string>;
}

// « mots-cles » : l'IA n'est plus disponible (plafond atteint ou panne), la séance
// continue avec le rapprochement lexical des exercices éclair (ADR 0008).
type Source = "ia" | "mots-cles";

type Bulle =
  | { type: "question"; numero: number; texte: string }
  | { type: "candidat"; texte: string }
  | { type: "relance"; texte: string }
  | {
      type: "retour";
      carte: Flashcard;
      cites: Chemin[];
      evaluation: Evaluation;
      source: Source;
    }
  | { type: "info"; texte: string };

interface Resultat {
  carte: Flashcard;
  evaluation: Evaluation;
  source: Source;
}

type Etat =
  | { phase: "accueil" }
  | {
      phase: "seance";
      debut: Date;
      serie: Flashcard[];
      index: number;
      bulles: Bulle[];
      // Les échanges de la question en cours, envoyés à chaque tour : la séance vit
      // dans le navigateur, le serveur ne garde rien.
      echanges: Message[];
      resultats: Resultat[];
      source: Source;
      enAttente: boolean;
    }
  | { phase: "bilan"; debut: Date; bulles: Bulle[]; resultats: Resultat[] };

type Action =
  | { type: "commencer"; serie: Flashcard[]; debut: Date }
  | { type: "repondre"; texte: string }
  | { type: "relancer"; texte: string }
  | { type: "noter"; cites: Chemin[]; evaluation: Evaluation; source: Source }
  | { type: "basculer"; texte: string }
  | { type: "recommencer" };

const question = (serie: Flashcard[], index: number): Bulle => ({
  type: "question",
  numero: index + 1,
  texte: serie[index]?.situation ?? "",
});

function reduire(etat: Etat, action: Action): Etat {
  if (action.type === "recommencer") return { phase: "accueil" };
  if (action.type === "commencer") {
    return {
      phase: "seance",
      debut: action.debut,
      serie: action.serie,
      index: 0,
      bulles: [question(action.serie, 0)],
      echanges: [],
      resultats: [],
      source: "ia",
      enAttente: false,
    };
  }
  if (etat.phase !== "seance") return etat;

  switch (action.type) {
    case "repondre":
      return {
        ...etat,
        bulles: [...etat.bulles, { type: "candidat", texte: action.texte }],
        echanges: [...etat.echanges, { role: "candidat", texte: action.texte }],
        enAttente: true,
      };
    case "relancer":
      return {
        ...etat,
        bulles: [...etat.bulles, { type: "relance", texte: action.texte }],
        echanges: [
          ...etat.echanges,
          { role: "examinateur", texte: action.texte },
        ],
        enAttente: false,
      };
    case "basculer":
      return {
        ...etat,
        source: "mots-cles",
        bulles: [...etat.bulles, { type: "info", texte: action.texte }],
      };
    case "noter": {
      const carte = etat.serie[etat.index];
      if (!carte) return etat;
      const bulles: Bulle[] = [
        ...etat.bulles,
        {
          type: "retour",
          carte,
          cites: action.cites,
          evaluation: action.evaluation,
          source: action.source,
        },
      ];
      const resultats = [
        ...etat.resultats,
        { carte, evaluation: action.evaluation, source: action.source },
      ];
      const suivant = etat.index + 1;
      if (suivant >= etat.serie.length) {
        return { phase: "bilan", debut: etat.debut, bulles, resultats };
      }
      return {
        ...etat,
        index: suivant,
        bulles: [...bulles, question(etat.serie, suivant)],
        echanges: [],
        resultats,
        enAttente: false,
      };
    }
  }
}

// Mélange de Fisher-Yates : chaque ordre a la même probabilité.
function melanger<T>(elements: T[]): T[] {
  const copie = [...elements];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j] as T, copie[i] as T];
  }
  return copie;
}

const MESSAGES_REPLI = {
  budget:
    "Le plafond de consommation de l'IA est atteint. La séance continue avec la reconnaissance par mots-clés, sans relance.",
  indisponible:
    "L'examinateur IA ne répond pas. La séance continue avec la reconnaissance par mots-clés, sans relance.",
};

export function Examinateur({ domaine, cartes, termes }: Props) {
  const [etat, envoyer] = useReducer(reduire, { phase: "accueil" });
  const router = useRouter();
  const chemin = usePathname();
  const libellesNiveaux = useMemo(
    () => Object.fromEntries(domaine.niveaux.map((n) => [n.id, n.libelle])),
    [domaine.niveaux],
  );
  const libelle = (niveau: string | undefined) =>
    niveau === undefined ? "aucun" : (libellesNiveaux[niveau] ?? niveau);

  const saisie = useRef<HTMLTextAreaElement>(null);
  const fin = useRef<HTMLDivElement>(null);
  const nombreBulles = etat.phase === "accueil" ? 0 : etat.bulles.length;
  const enAttente = etat.phase === "seance" && etat.enAttente;
  // Chaque nouveau message reste visible, et la saisie reprend le focus dès que
  // l'examinateur a parlé : on enchaîne au clavier sans chercher où l'on en est.
  useEffect(() => {
    fin.current?.scrollIntoView({ block: "end" });
    if (!enAttente) saisie.current?.focus();
  }, [nombreBulles, enAttente]);

  const dictee = useDictee((texte) => {
    if (saisie.current)
      saisie.current.value = texte.slice(0, LONGUEUR_MAX_MESSAGE);
  });
  const lecture = useLecture();
  const { lire } = lecture;

  // Lit ce que l'examinateur vient de dire, une seule fois : les bulles déjà lues
  // sont comptées, et une nouvelle séance repart de zéro.
  const lues = useRef(0);
  useEffect(() => {
    const bulles = etat.phase === "accueil" ? [] : etat.bulles;
    if (bulles.length < lues.current) lues.current = 0;
    const nouvelles = bulles.slice(lues.current);
    lues.current = bulles.length;
    if (nouvelles.length === 0) return;
    const nom = (niveau: string | undefined) =>
      niveau === undefined ? "aucun" : (libellesNiveaux[niveau] ?? niveau);
    const textes = nouvelles.map((bulle) => {
      switch (bulle.type) {
        case "question":
          return `Question ${String(bulle.numero)}. ${bulle.texte}`;
        case "relance":
        case "info":
          return bulle.texte;
        case "retour":
          return `${String(bulle.evaluation.points)} sur ${String(bulle.evaluation.maximum)}, niveau ${nom(bulle.evaluation.niveauAtteint)}.`;
        case "candidat":
          return "";
      }
    });
    if (etat.phase === "bilan") {
      const { niveau } = verdict(
        etat.resultats.map((r) => r.evaluation.niveauAtteint),
        domaine.niveaux,
      );
      textes.push(`Verdict : ${nom(niveau)}.`);
    }
    const texte = textes.filter(Boolean).join(" ");
    if (texte !== "") lire(texte);
  }, [etat, lire, libellesNiveaux, domaine.niveaux]);

  const noterParMotsCles = (carte: Flashcard, echanges: Message[]) => {
    const texte = echanges
      .filter((m) => m.role === "candidat")
      .map((m) => m.texte)
      .join(" ");
    const cites = reperer(carte.arbre, texte);
    envoyer({
      type: "noter",
      cites: [...cites],
      evaluation: evaluer(carte.arbre, cites, domaine.niveaux),
      source: "mots-cles",
    });
  };

  const soumettre = async (texte: string) => {
    if (etat.phase !== "seance" || etat.enAttente || texte === "") return;
    const carte = etat.serie[etat.index];
    if (!carte) return;
    const echanges: Message[] = [...etat.echanges, { role: "candidat", texte }];
    envoyer({ type: "repondre", texte });
    if (etat.source === "mots-cles") {
      noterParMotsCles(carte, echanges);
      return;
    }

    const issue = await demanderTour(domaine.id, carte.id, echanges);
    switch (issue.type) {
      case "tour":
        if (issue.tour.relance) {
          envoyer({ type: "relancer", texte: issue.tour.relance });
        } else {
          envoyer({
            type: "noter",
            cites: issue.tour.cites,
            evaluation: issue.tour.evaluation,
            source: "ia",
          });
        }
        return;
      case "repli":
        envoyer({ type: "basculer", texte: MESSAGES_REPLI[issue.raison] });
        noterParMotsCles(carte, echanges);
        return;
      case "expire":
        router.push(`/acces?suite=${encodeURIComponent(chemin)}`);
        return;
    }
  };

  if (etat.phase === "accueil") {
    return (
      <section aria-label="Nouvelle séance">
        <p>
          {TAILLE_SEANCE} situations tirées au hasard. Répondez comme à
          l&apos;oral : l&apos;examinateur peut vous relancer deux fois, puis
          montre ce qui était attendu. Le niveau se lit à la fin de la séance.
        </p>
        <button
          type="button"
          disabled={cartes.length === 0}
          onClick={() => {
            envoyer({
              type: "commencer",
              serie: melanger(cartes).slice(0, TAILLE_SEANCE),
              debut: new Date(),
            });
          }}
          className="mt-4 rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Commencer une séance
        </button>
      </section>
    );
  }

  const reglageLecture = lecture.disponible && (
    <label className="mb-4 flex items-center gap-2 text-sm print:hidden">
      <input
        type="checkbox"
        checked={lecture.active}
        onChange={lecture.basculer}
        className="size-4 accent-accent"
      />
      Lire l&apos;examinateur à voix haute
    </label>
  );

  const fil = (
    <ol
      role="log"
      aria-label="Échanges avec l'examinateur"
      className="space-y-4 print:hidden"
    >
      {etat.bulles.map((bulle, i) => (
        <li key={i}>
          <BulleVue
            bulle={bulle}
            libelle={libelle}
            libellesNiveaux={libellesNiveaux}
            total={
              etat.phase === "seance"
                ? etat.serie.length
                : etat.resultats.length
            }
          />
        </li>
      ))}
    </ol>
  );

  if (etat.phase === "bilan") {
    const { niveau, repartition } = verdict(
      etat.resultats.map((r) => r.evaluation.niveauAtteint),
      domaine.niveaux,
    );
    const parMotsCles = etat.resultats.filter(
      (r) => r.source === "mots-cles",
    ).length;
    return (
      <>
        {reglageLecture}
        {fil}
        <section
          aria-labelledby="titre-verdict"
          className="mt-8 rounded-lg border-2 border-accent p-4 print:mt-0 print:border-0 print:p-0"
        >
          <p className="hidden text-sm text-muted print:block">
            Séance du{" "}
            {etat.debut.toLocaleDateString("fr-FR", { dateStyle: "long" })}
          </p>
          <h2 id="titre-verdict" className="text-xl font-semibold">
            Verdict : {libelle(niveau)}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Le niveau atteint ou dépassé sur au moins la moitié des questions.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {repartition.map((r) => (
              <li key={r.niveau}>
                {libelle(r.niveau)} : {r.questions} question
                {r.questions > 1 ? "s" : ""} sur {etat.resultats.length}
              </li>
            ))}
          </ul>
          {parMotsCles > 0 && (
            <p className="mt-3 text-sm text-muted">
              {parMotsCles} réponse{parMotsCles > 1 ? "s" : ""} évaluée
              {parMotsCles > 1 ? "s" : ""} par mots-clés, sans l&apos;IA.
            </p>
          )}
          <div className="mt-4 flex gap-3 print:hidden">
            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="rounded-md border border-border px-4 py-2 font-semibold"
            >
              Imprimer la fiche
            </button>
            <button
              type="button"
              onClick={() => {
                envoyer({ type: "recommencer" });
              }}
              className="rounded-md bg-accent px-4 py-2 font-semibold text-white"
            >
              Nouvelle séance
            </button>
          </div>
        </section>
        <FicheDeSeance
          fiche={ficheDeSeance(etat.resultats)}
          domaine={domaine.id}
          termes={termes}
          libelle={libelle}
        />
      </>
    );
  }

  return (
    <>
      {reglageLecture}
      {fil}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const champ = e.currentTarget.elements.namedItem("reponse");
          if (!(champ instanceof HTMLTextAreaElement)) return;
          dictee.arreter();
          const texte = champ.value.trim();
          champ.value = "";
          void soumettre(texte);
        }}
        className="mt-6"
      >
        <label htmlFor="reponse" className="sr-only">
          Votre réponse
        </label>
        <textarea
          ref={saisie}
          id="reponse"
          name="reponse"
          rows={4}
          maxLength={LONGUEUR_MAX_MESSAGE}
          disabled={etat.enAttente}
          className="block w-full rounded-md border border-border bg-background p-3 disabled:opacity-50"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={etat.enAttente}
            className="rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            Répondre
          </button>
          {dictee.disponible && (
            <button
              type="button"
              aria-pressed={dictee.ecoute}
              disabled={etat.enAttente}
              onClick={() => {
                if (dictee.ecoute) {
                  dictee.arreter();
                  return;
                }
                // Le micro ne doit pas entendre la synthèse vocale.
                lecture.arreter();
                dictee.demarrer(saisie.current?.value.trim() ?? "");
              }}
              className={`rounded-md border px-4 py-2 font-semibold disabled:opacity-50 ${
                dictee.ecoute
                  ? "border-red-600 text-red-700 dark:text-red-400"
                  : "border-border"
              }`}
            >
              {dictee.ecoute ? "Arrêter la dictée" : "Parler"}
            </button>
          )}
          <span aria-live="polite" className="text-sm text-muted">
            {etat.enAttente
              ? "L'examinateur lit votre réponse…"
              : dictee.ecoute
                ? "Je vous écoute… Arrêtez la dictée, relisez, puis répondez."
                : ""}
          </span>
        </div>
        {dictee.erreur && (
          <p
            role="alert"
            className="mt-2 text-sm text-red-700 dark:text-red-400"
          >
            {dictee.erreur}
          </p>
        )}
        {dictee.disponible && (
          <p className="mt-2 text-xs text-muted">
            Selon le navigateur, la dictée peut passer par les serveurs de son
            éditeur (Google pour Chrome).
          </p>
        )}
      </form>
      <div ref={fin} />
    </>
  );
}

function BulleVue({
  bulle,
  libelle,
  libellesNiveaux,
  total,
}: {
  bulle: Bulle;
  libelle: (niveau: string | undefined) => string;
  libellesNiveaux: Record<string, string>;
  total: number;
}) {
  switch (bulle.type) {
    case "question":
      return (
        <div className="rounded-lg bg-black/5 p-4 dark:bg-white/10">
          <p className="text-sm text-muted">
            Question {bulle.numero} sur {total}
          </p>
          <p className="mt-1 font-semibold">{bulle.texte}</p>
        </div>
      );
    case "relance":
      return (
        <div className="rounded-lg bg-black/5 p-4 dark:bg-white/10">
          <p className="text-sm text-muted">Relance</p>
          <p className="mt-1">{bulle.texte}</p>
        </div>
      );
    case "candidat":
      return (
        <div className="ml-8 rounded-lg border border-border p-4">
          <p className="text-sm text-muted">Vous</p>
          <p className="mt-1 whitespace-pre-wrap">{bulle.texte}</p>
        </div>
      );
    case "info":
      return (
        <p
          role="status"
          className="rounded-lg border border-amber-500 p-3 text-sm"
        >
          {bulle.texte}
        </p>
      );
    case "retour":
      return (
        <div className="rounded-lg border-l-4 border-l-accent bg-black/5 p-4 dark:bg-white/10">
          <p className="font-semibold">
            {bulle.evaluation.points} / {bulle.evaluation.maximum} · niveau{" "}
            {libelle(bulle.evaluation.niveauAtteint)}
          </p>
          {bulle.source === "mots-cles" && (
            <p className="text-sm text-muted">Évalué par mots-clés.</p>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-accent">
              Réponse attendue
            </summary>
            <div className="mt-3">
              <ArbreRevele
                arbre={bulle.carte.arbre}
                cites={new Set(bulle.cites)}
                evaluation={bulle.evaluation}
                libellesNiveaux={libellesNiveaux}
              />
            </div>
          </details>
        </div>
      );
  }
}
