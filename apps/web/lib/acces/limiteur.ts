// Limiteur en mémoire, propre à chaque instance : deviner un code de 80 bits est hors
// de portée de toute façon, il s'agit seulement de ne pas laisser un script marteler
// le formulaire. Un compteur partagé (Firestore) n'apporterait rien de plus ici.
export const creerLimiteur = ({
  tentatives,
  fenetreMs,
}: {
  tentatives: number;
  fenetreMs: number;
}) => {
  const echecs = new Map<string, number[]>();
  const recents = (cle: string, maintenant: number) =>
    (echecs.get(cle) ?? []).filter((date) => date > maintenant - fenetreMs);

  return {
    bloque(cle: string, maintenant: number): boolean {
      const dates = recents(cle, maintenant);
      // Les clés sans échec récent sont oubliées : la table ne grossit pas sans fin.
      if (dates.length === 0) echecs.delete(cle);
      else echecs.set(cle, dates);
      return dates.length >= tentatives;
    },
    echec(cle: string, maintenant: number): void {
      echecs.set(cle, [...recents(cle, maintenant), maintenant]);
    },
  };
};
