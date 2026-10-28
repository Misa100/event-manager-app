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

## Étapes 5 et 6 – Mapping base ↔ UI et branchement des lectures

Détails : [`DATA_MODEL.md`](./DATA_MODEL.md) §3 et §4.

- **`lib/mappers.ts`** : conversion des lignes Supabase en types UI (casse, prix imbriqués, `null`, heures, JSON, valeurs libres) et chaînes `select` avec jointures (une requête par entité).
- **Hooks de lecture** (`useClients`, `useServiceProviders`, `useVenues`, `useEvents`) : retournent des types UI avec leurs relations. Les mutations restent typées « base » (étape des écritures).
- **Écrans branchés** : Home (statistiques et « Upcoming Events » = événements à venir, planning/confirmés, dans la limite de 3), Clients, Providers, Venues, Events (détail avec client, lieu et prestataires retrouvés par identifiant).
- **États** : nouveau `components/DataStatus.tsx` — spinner au premier chargement, message + « Try again » en cas d'échec, messages de liste vide. Un échec de rafraîchissement garde les données déjà affichées.
- **Affichage** : type de prestataire inconnu affiché en clair ; lieu sans tarif → « Pricing on request ».
- **Suppression** de `data/mockData.ts` (plus utilisé).
- **Vérification** : 19 scénarios dans Chromium contre un backend simulé au format PostgREST (jointures imbriquées, colonnes `null`, valeurs inconnues, tri, erreur puis nouvel essai, liste vide). Non testé contre le vrai projet Supabase (domaine inaccessible depuis l'environnement de développement) : les noms de colonnes et les relations viennent de `lib/supabase/types.ts`.
- **À savoir** : base vide = écrans vides ; les lectures dépendent des politiques RLS (lecture ouverte aux utilisateurs authentifiés d'après `BACKEND_IMPLEMENTATION.md`, non vérifié).

## Correctif – installation et démarrage

- `babel-preset-expo` déclaré en `devDependencies` : `babel.config.js` l'utilise, mais il n'était présent que comme dépendance indirecte d'`expo`, et selon l'arbre npm il n'était pas résolu (« Cannot find module 'babel-preset-expo' »).
- Versions alignées sur celles qu'attend Expo SDK 54 (`react-native` 0.81.5, `react-native-gesture-handler`, `react-native-maps`, `react-native-safe-area-context`, `react-native-webview`, `@react-native-picker/picker`, `@react-native-community/datetimepicker`) : les anciens `^` installaient des versions plus récentes que celles validées par Expo.
