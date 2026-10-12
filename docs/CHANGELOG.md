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

## Étape 4 – Auth de bout en bout

Détails des parcours et de la configuration : [`AUTH.md`](./AUTH.md).

- **Garde de route** (`Stack.Protected`) : déconnecté → écrans d'auth, connecté → app. L'écran de démarrage reste affiché pendant le chargement de la session.
- **Accès** : onglet « Profile » ajouté (web/Android et iOS) ; `profile.ios.tsx` (contenu factice) supprimé, le profil réel sert toutes les plateformes ; déconnexion renvoie vers la connexion.
- **Nouveaux écrans** : mot de passe oublié, nouveau mot de passe (`/reset-password`), confirmation d'e-mail (`/email-confirmed`), état « Check your email » après inscription, renvoi de l'e-mail de confirmation.
- **Retours visibles sur le web** : les `Alert.alert` (sans effet sur le web) sont remplacés par des messages dans la page ; validations locales (e-mail, 8 caractères min., confirmation) ; erreurs Supabase traduites.
- **Rôles** : le rôle « Admin » n'est plus proposé à l'inscription ; rôle lu depuis la table `profiles` et exposé par `useAuthContext()` (`role`, `profile`). ⚠️ À verrouiller aussi côté base, voir `AUTH.md`.
- **Profil** : la ligne `profiles` est lue après connexion, et créée à partir des métadonnées si elle manque ; l'insertion faite pendant l'inscription (sans session, donc refusée par une RLS correcte) est supprimée.
- **Hygiène** : plus de `console.log` d'adresses e-mail dans `useAuth` ; `useAuth` renvoie des résultats typés (`AuthResult`) au lieu de `any`.
- **Vérification** : 20 scénarios joués dans Chromium contre un backend Supabase simulé (redirections du garde, erreurs, inscription, connexion, persistance au rechargement, déconnexion, réinitialisation). Non testé contre le vrai projet Supabase (domaine bloqué depuis l'environnement de développement).
