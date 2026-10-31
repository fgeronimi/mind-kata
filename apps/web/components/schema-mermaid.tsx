"use client";

import { useEffect, useId, useState } from "react";

// Mermaid ne sait dessiner que dans un navigateur (il mesure le texte dans le DOM) :
// c'est le seul composant client du contenu. La bibliothèque est chargée à la demande,
// uniquement sur les pages qui contiennent un schéma.
export function SchemaMermaid({ code }: { code: string }) {
  const id = `mermaid-${useId().replace(/:/g, "")}`;
  const [svg, setSvg] = useState<string>();
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let annule = false;
    const sombre = window.matchMedia("(prefers-color-scheme: dark)").matches;

    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: sombre ? "dark" : "neutral",
          securityLevel: "strict",
          fontFamily: "inherit",
        });
        const rendu = await mermaid.render(id, code);
        if (!annule) setSvg(rendu.svg);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    return () => {
      annule = true;
    };
  }, [code, id]);

  // Tant que le schéma n'est pas dessiné (ou s'il est invalide), on montre sa source :
  // elle reste lisible, et c'est ce que voient les moteurs et les lecteurs sans JS.
  if (!svg) {
    return (
      <figure>
        <pre aria-busy={!erreur}>
          <code>{code}</code>
        </pre>
        {erreur && (
          <figcaption className="text-sm text-muted">
            Schéma impossible à dessiner : source affichée.
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure
      className="flex justify-center overflow-x-auto rounded-lg border border-border p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
