---
id: hebergement-souverain
terme: "Hébergement souverain"
alias: ["SecNumCloud", "cloud de confiance"]
categorie: secteur-public
liens: [chiffrement, masquage-des-donnees]
niveaux:
  confirme: "Sait que certaines données publiques sensibles doivent être hébergées chez un prestataire qualifié, protégé des lois extraterritoriales."
  senior: "Identifie les données concernées, choisit un hébergeur qualifié (SecNumCloud) et vérifie que chaque service managé utilisé l'est aussi."
  lead: "Intègre la contrainte dès le cadrage, car elle restreint le catalogue de services utilisables et pèse sur les coûts et les délais."
---

Pour les données sensibles de l'administration, l'hébergement doit être assuré par un
prestataire **qualifié** (SecNumCloud en France), qui garantit notamment l'immunité aux
lois extraterritoriales.

## Conséquences

- Le catalogue de services managés est plus restreint : chaque brique (base, file,
  stockage) doit être couverte.
- Un service managé d'un fournisseur non qualifié est à proscrire pour ces données, même
  pratique.

## Piège

S'en apercevoir après avoir conçu l'architecture autour de services non qualifiés.
