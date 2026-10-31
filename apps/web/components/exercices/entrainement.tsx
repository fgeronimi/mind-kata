"use client";

import {
  type Chemin,
  type Domaine,
  evaluer,
  type Flashcard,
  parcourir,
  reperer,
} from "@mind-kata/core/evaluation";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { ArbreRevele } from "./arbre-revele";
import { enregistrer, type Resultat } from "./progression";

const TAILLE_SERIE = 10;

interface Props {
  domaine: Pick<Domaine, "id" | "niveaux" | "categories">;
  cartes: Flashcard[];
}

interface Reponse {
  carte: Flashcard;
  cites: Set<Chemin>;
  resultat: Resultat;
  points: number;
  maximum: number;
}

// Le déroulé d'une série, explicite : chaque action n'est possible que dans la phase
// qui l'autorise.
type Etat =
  | { phase: "choix"; categorie: string; niveau: string }
  | {
      phase: "question";
      serie: Flashcard[];
      index: number;
      reponses: Reponse[];
    }
  | {
      phase: "revelation";
      serie: Flashcard[];
      index: number;
      reponses: Reponse[];
      cites: Set<Chemin>;
    }
  | { phase: "bilan"; reponses: Reponse[] };

type Action =
  | { type: "filtrer"; categorie?: string; niveau?: string }
  | { type: "commencer"; serie: Flashcard[] }
  | { type: "repondre"; texte: string }
  | { type: "basculer"; chemin: Chemin }
  | { type: "noter"; resultat: Resultat; points: number; maximum: number }
  | { type: "recommencer" };

const etatInitial: Etat = { phase: "choix", categorie: "", niveau: "" };

function reduire(etat: Etat, action: Action): Etat {
  switch (action.type) {
    case "filtrer":
      if (etat.phase !== "choix") return etat;
      return {
        ...etat,
        categorie: action.categorie ?? etat.categorie,
        niveau: action.niveau ?? etat.niveau,
      };
    case "commencer":
      return { phase: "question", serie: action.serie, index: 0, reponses: [] };
    case "repondre": {
      if (etat.phase !== "question") return etat;
      const carte = etat.serie[etat.index];
      if (!carte) return etat;
      return {
        ...etat,
        phase: "revelation",
        cites: reperer(carte.arbre, action.texte),
      };
    }
    case "basculer": {
      if (etat.phase !== "revelation") return etat;
      const cites = new Set(etat.cites);
      if (cites.has(action.chemin)) cites.delete(action.chemin);
      else cites.add(action.chemin);
      return { ...etat, cites };
    }
    case "noter": {
      if (etat.phase !== "revelation") return etat;
      const carte = etat.serie[etat.index];
      if (!carte) return etat;
      const reponses = [
        ...etat.reponses,
        {
          carte,
          cites: etat.cites,
          resultat: action.resultat,
          points: action.points,
          maximum: action.maximum,
        },
      ];
      const suivant = etat.index + 1;
      return suivant < etat.serie.length
        ? { phase: "question", serie: etat.serie, index: suivant, reponses }
        : { phase: "bilan", reponses };
    }
    case "recommencer":
      return etatInitial;
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

export function Entrainement({ domaine, cartes }: Props) {
  const [etat, envoyer] = useReducer(reduire, etatInitial);
  const libellesNiveaux = useMemo(
    () => Object.fromEntries(domaine.niveaux.map((n) => [n.id, n.libelle])),
    [domaine.niveaux],
  );

  // À chaque changement d'étape, le focus va au titre : au clavier ou au lecteur
  // d'écran, on sait immédiatement où l'on en est.
  const titre = useRef<HTMLHeadingElement>(null);
  const cleEtape =
    etat.phase === "question" || etat.phase === "revelation"
      ? `${etat.phase}-${String(etat.index)}`
      : etat.phase;
  useEffect(() => {
    titre.current?.focus();
  }, [cleEtape]);

  if (etat.phase === "choix") {
    const disponibles = cartes.filter(
      (c) =>
        (etat.categorie === "" || c.categorie === etat.categorie) &&
        (etat.niveau === "" ||
          parcourir(c.arbre).some((n) => n.noeud.niveau === etat.niveau)),
    );
    const categoriesPresentes = domaine.categories.filter((cat) =>
      cartes.some((c) => c.categorie === cat.id),
    );
    return (
      <section aria-labelledby="titre-etape">
        <h2
          id="titre-etape"
          ref={titre}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          Nouvelle série
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-muted">Catégorie</span>
            <select
              value={etat.categorie}
              onChange={(e) => {
                envoyer({ type: "filtrer", categorie: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border border-border bg-background p-2"
            >
              <option value="">Toutes</option>
              {categoriesPresentes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.libelle}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted">Niveau travaillé</span>
            <select
              value={etat.niveau}
              onChange={(e) => {
                envoyer({ type: "filtrer", niveau: e.target.value });
              }}
              className="mt-1 block w-full rounded-md border border-border bg-background p-2"
            >
              <option value="">Tous</option>
              {domaine.niveaux.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.libelle}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {disponibles.length} situation{disponibles.length > 1 ? "s" : ""}{" "}
          disponible{disponibles.length > 1 ? "s" : ""} ; une série en compte
          jusqu&apos;à {TAILLE_SERIE}.
        </p>
        <button
          type="button"
          disabled={disponibles.length === 0}
          onClick={() => {
            envoyer({
              type: "commencer",
              serie: melanger(disponibles).slice(0, TAILLE_SERIE),
            });
          }}
          className="mt-4 rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Commencer la série
        </button>
      </section>
    );
  }

  if (etat.phase === "bilan") {
    const su = etat.reponses.filter((r) => r.resultat === "su").length;
    return (
      <section aria-labelledby="titre-etape">
        <h2
          id="titre-etape"
          ref={titre}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          Bilan de la série
        </h2>
        <p className="mt-2">
          {su} sur {etat.reponses.length} marquée{su > 1 ? "s" : ""} comme sue
          {su > 1 ? "s" : ""}.
        </p>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {etat.reponses.map((r) => (
            <li
              key={r.carte.id}
              className="flex items-start justify-between gap-4 p-3"
            >
              <span>{r.carte.situation}</span>
              <span className="shrink-0 text-sm text-muted">
                {r.points}/{r.maximum} ·{" "}
                {r.resultat === "su" ? "su" : "à revoir"}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            envoyer({ type: "recommencer" });
          }}
          className="mt-6 rounded-md bg-accent px-4 py-2 font-semibold text-white"
        >
          Nouvelle série
        </button>
      </section>
    );
  }

  const carte = etat.serie[etat.index];
  if (!carte) return null;
  const position = `Situation ${String(etat.index + 1)} sur ${String(etat.serie.length)}`;

  if (etat.phase === "question") {
    return (
      <section aria-labelledby="titre-etape">
        <h2
          id="titre-etape"
          ref={titre}
          tabIndex={-1}
          className="text-sm text-muted outline-none"
        >
          {position}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const texte = new FormData(e.currentTarget).get("reponse");
            envoyer({ type: "repondre", texte: String(texte ?? "") });
          }}
        >
          <label htmlFor="reponse" className="mt-2 block text-lg font-semibold">
            {carte.situation}
          </label>
          <p id="aide-reponse" className="mt-1 text-sm text-muted">
            Répondez comme à l&apos;oral : la solution de base, puis ce qui la
            précise, et pourquoi.
          </p>
          <textarea
            id="reponse"
            name="reponse"
            rows={6}
            aria-describedby="aide-reponse"
            className="mt-3 block w-full rounded-md border border-border bg-background p-3"
          />
          <button
            type="submit"
            className="mt-4 rounded-md bg-accent px-4 py-2 font-semibold text-white"
          >
            Révéler la réponse attendue
          </button>
        </form>
      </section>
    );
  }

  const evaluation = evaluer(carte.arbre, etat.cites, domaine.niveaux);
  const noter = (resultat: Resultat) => {
    const trace = {
      resultat,
      points: evaluation.points,
      maximum: evaluation.maximum,
    };
    enregistrer(domaine.id, carte.id, {
      ...trace,
      date: new Date().toISOString(),
    });
    envoyer({ type: "noter", ...trace });
  };

  return (
    <section aria-labelledby="titre-etape">
      <h2
        id="titre-etape"
        ref={titre}
        tabIndex={-1}
        className="text-sm text-muted outline-none"
      >
        {position} : réponse attendue
      </h2>
      <p className="mt-2 text-lg font-semibold">{carte.situation}</p>

      <div
        aria-live="polite"
        className="mt-4 rounded-lg border border-border p-4"
      >
        <p className="text-2xl font-semibold">
          {evaluation.points} / {evaluation.maximum}
        </p>
        <p className="text-sm text-muted">
          {evaluation.niveauAtteint
            ? `Niveau atteint : ${libellesNiveaux[evaluation.niveauAtteint] ?? evaluation.niveauAtteint}`
            : "Aucun niveau atteint"}
          {evaluation.orphelins.length > 0 &&
            ` · ${String(evaluation.orphelins.length)} élément${evaluation.orphelins.length > 1 ? "s" : ""} cité${evaluation.orphelins.length > 1 ? "s" : ""} sans le raisonnement qui y mène`}
        </p>
      </div>

      <p className="mt-6 text-sm text-muted">
        Les éléments reconnus dans votre réponse sont cochés. Corrigez si un mot
        a été formulé autrement, ou reconnu à tort : le score suit.
      </p>
      <div className="mt-3">
        <ArbreRevele
          arbre={carte.arbre}
          cites={etat.cites}
          evaluation={evaluation}
          libellesNiveaux={libellesNiveaux}
          onBasculer={(chemin) => {
            envoyer({ type: "basculer", chemin });
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            noter("su");
          }}
          className="rounded-md bg-accent px-4 py-2 font-semibold text-white"
        >
          Je savais
        </button>
        <button
          type="button"
          onClick={() => {
            noter("a-revoir");
          }}
          className="rounded-md border border-border px-4 py-2 font-semibold"
        >
          À revoir
        </button>
      </div>
    </section>
  );
}
