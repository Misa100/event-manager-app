# Changements depuis la v0

`V0_BASELINE.md` décrit l'état figé au tag `v0` et n'est plus modifié. Les évolutions sont consignées ici.

## Étape 2 – Assainir la config

- **Nom unique « Event Manager »** : `app.json` (nom, slug `event-manager`), `package.json` (`event-manager`), manifest PWA.
- **Identifiants** : bundle ID iOS et package Android `com.anonymous.eventmanager`, `scheme` `eventmanager`. Le second `scheme` mal placé (avec espace) à la racine d'`app.json` est supprimé. ⚠️ `com.anonymous` est un espace réservé : à remplacer par un vrai nom de domaine inversé avant toute publication sur les stores.
- **Thème** : `userInterfaceStyle` passe à `light`, ce qui correspond aux écrans actuels (clair uniquement).
- **Supabase** : URL et clé lues depuis `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` via `lib/config.ts`, avec repli sur le projet actuel. Ajout de `.env.example`.
- **Liens d'e-mails d'auth** : base `EXPO_PUBLIC_SITE_URL` (repli temporaire `https://natively.dev`, à remplacer par le vrai domaine).
- **Alias Babel** : seul `@/` est conservé (les autres n'étaient utilisés nulle part, et `@style` visait un dossier inexistant).
- **Dépendances** : retrait de `@react-native-community/picker` (dépréciée, doublon de `@react-native-picker/picker`, seul utilisé).
- **Documentation** : `README.md` réécrit, `BACKEND_IMPLEMENTATION.md` corrigé (chemin du client, variables). Le script `readme` et `scripts/generate-readme.js` sont supprimés : ils auraient écrasé le README.

Non traité volontairement : renommage des fichiers d'icône `natively-dark.png` (le visuel est probablement celui de l'outil Natively et sera à remplacer), dépendances « à confirmer » de `V0_BASELINE.md`.
