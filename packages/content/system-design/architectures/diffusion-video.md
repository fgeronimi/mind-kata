---
id: diffusion-video
titre: Diffusion de vidéos
probleme: Mettre en ligne et diffuser des vidéos à grande échelle
briques:
  - upload en plusieurs morceaux
  - transcodage asynchrone
  - segments et manifeste (HLS, DASH)
  - CDN avec origin shield
  - URL signées
concepts: [idempotence, retry-backoff]
---

```mermaid
flowchart LR
  U["Créateur"] -->|"upload en morceaux"| S[("Stockage objet")]
  S --> F[["File"]] --> T["Transcodage en plusieurs qualités"]
  T --> SG[("Segments + manifeste")]
  SG --> OS["Origin shield"] --> CDN["CDN"]
  CDN -->|"débit adaptatif"| V["Spectateurs"]
```

## Quand

Des vidéos à mettre en ligne et à lire sur des réseaux et des écrans très variés.

## Points d'attention

- **Upload en plusieurs morceaux**, reprenable, directement vers le stockage objet.
- **Transcodage asynchrone** en plusieurs qualités ; segments de 2 à 6 secondes.
- **Débit adaptatif** : le lecteur choisit la qualité selon sa bande passante.
- La bande passante est le premier poste de coût ; origin shield et préchauffage du
  cache pour les pics d'audience.
- Construire ou acheter : une plateforme vidéo managée est souvent le bon choix.
- Direct à faible latence : variante basse latence de HLS ou WebRTC.
