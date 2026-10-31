---
id: url-signee
terme: "URL signée"
alias: ["signed URL"]
categorie: securite
liens: [chiffrement]
niveaux:
  confirme: "Sait qu'une URL signée donne un accès temporaire à un fichier précis."
  senior: "L'utilise pour l'envoi direct vers le stockage objet et le téléchargement privé, avec une durée courte et un type et une taille contrôlés."
  lead: "L'impose pour que les fichiers ne transitent jamais par les serveurs d'application."
---

Une URL qui porte sa propre autorisation, **limitée dans le temps** et à un fichier.

- **Envoi** : le navigateur envoie directement vers le stockage objet, sans passer par
  l'application.
- **Téléchargement** : un fichier privé accessible quelques minutes.

## Piège

Contrôler type et taille, et analyser les fichiers reçus (antivirus).
