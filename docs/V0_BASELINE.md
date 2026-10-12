# Baseline v0

Photographie de l'app avant perfectionnement. Rien ici n'est une décision : ce sont des constats et des pistes pour avancer étape par étape.

## 1. Ce qui fonctionne

| Zone | État |
|---|---|
| Inscription / connexion / déconnexion / mot de passe oublié (hook) | Branchés sur Supabase Auth |
| Écran Profil (web/Android) | Affiche l'utilisateur connecté (e-mail, nom, rôle, date de création) ; déconnexion |
| Home | Statistiques et actions rapides **calculées sur les données factices** |
| Clients | Liste, recherche (nom, e-mail), détail — données factices |
| Providers | Liste, recherche, filtre par type, détail — données factices |
| Venues | Liste, recherche (nom, lieu), détail — données factices |
| Events | Liste, recherche (titre), détail (client, lieu, prestataires, timeline, tâches, notes) — données factices |

## 2. Ce qui n'existe pas encore

- **Aucune écriture** depuis l'UI : pas de formulaire de création / édition / suppression. Les boutons « New Event » et « Add Client » de l'accueil ne font que changer d'onglet.
- **Aucun écran ne lit Supabase** : les hooks `useClients`, `useEvents`, `useServiceProviders`, `useVenues`, `useReviews` ne sont importés par aucun écran.
- **Pas de garde d'authentification** : l'app s'ouvre sur les onglets sans connexion.
- **Pas d'accès à login / register / profil** depuis l'UI : l'écran Profil n'est pas dans la barre d'onglets, et rien ne renvoie vers `auth/*`.
- **Pas de route de détail** : le détail est un état local de l'écran (pas d'URL partageable).
- **Tâches, timeline, réservations, disponibilités, journal de communication, avis** : modélisés en base, affichés (en partie) depuis les mocks, mais sans écran de gestion.
- **Pas de tests**, pas de CI dans le repo.

## 3. Code hérité du template (à trier)

| Élément | Constat |
|---|---|
| `app/modal.tsx`, `formsheet.tsx`, `transparent-modal.tsx` | Démos de modales, accessibles seulement depuis l'accueil iOS |
| `(tabs)/(home)/index.ios.tsx`, `components/DemoCard.tsx`, `HeaderButtons.tsx`, `homeData.ts` | Écran de démo (« Building the app… ») qui remplace l'accueil sur iOS |
| `(tabs)/profile.ios.tsx` | Profil statique « John Doe » |
| `contexts/WidgetContext.tsx` | Non utilisé ; identifiant de groupe factice (`group.com.<user_name>.<app_name>`) |
| `components/ListItem.tsx`, `IconCircle.tsx`, `button.tsx`, `BodyScrollView.tsx` | Non utilisés par les écrans |
| `utils/errorLogger.ts` | Non importé |
| `constants/Colors.ts` | Palette de template (dont une longue liste d'emojis) |
| `babel-plugins/` | Outillage de l'éditeur Natively, actif seulement avec `EXPO_PUBLIC_ENABLE_EDIT_MODE` |

## 4. Écarts de configuration et de documentation

- **Noms et identifiants** : `Natively` (package.json, manifest PWA), `Eventide Celebrations` (app.json), `Event Manager` (UI). Bundle ID / package : `com.anonymous.Natively`. Le champ `scheme` racine d'`app.json` contient un espace (`"Eventide Celebrations"`), alors que `expo.scheme` vaut `natively`.
- **Clés Supabase** : URL et clé publique codées en dur dans `lib/supabase/client.ts`. Une clé « anon » est faite pour le client, mais sa sécurité repose entièrement sur les politiques RLS. Passer par des variables `EXPO_PUBLIC_*` faciliterait les environnements dev / prod.
- **Chemin du client Supabase** : `BACKEND_IMPLEMENTATION.md` cite `app/integrations/supabase/client.ts` ; le fichier réel est `lib/supabase/client.ts`. Le commentaire dans le client cite lui aussi `@/integrations/supabase/client`.
- **README racine** : généré, décrit une structure `src/ pages/ services/` inexistante et ne mentionne pas Supabase.
- **Migrations Supabase** absentes : seul `supabase/config.toml` (project_id) est versionné.
- **URL de redirection e-mail** vers `natively.dev` à remplacer par le vrai domaine.
- **Alias** : `@style` (Babel) pointe vers un dossier inexistant ; seul `@/*` est connu de TypeScript.
- **Dépendances** : `@react-native-community/picker` (dépréciée) et `@react-native-picker/picker` sont toutes deux installées ; `react-router-dom`, `workbox-webpack-plugin`, `webpack-cli` et le paquet `eas` ne semblent pas servir avec expo-router + Metro (à confirmer avant de retirer).
- **Thème** : `userInterfaceStyle: "automatic"` mais les écrans métier sont en clair uniquement.
- **Logs** : les hooks écrivent beaucoup de `console.log` (dont des e-mails d'utilisateurs) ; à nettoyer avant toute mise en production.

## 5. Pistes d'étapes (à valider une par une)

Ordre proposé, chaque étape livrable seule. Aucune n'est lancée.

1. **Figer la base v0** : poser un tag git (`v0`) sur l'état documenté ici.
2. **Assainir la config** : noms/identifiants uniques, variables d'environnement pour Supabase, alias, README et `BACKEND_IMPLEMENTATION.md` corrigés.
3. **Versionner le backend** : exporter les migrations et politiques RLS dans `supabase/migrations/` et les relire.
4. **Auth de bout en bout** : garde de route, accès login / register / profil depuis l'UI, gestion du rôle.
5. **Couche de mapping** base ↔ UI (`snake_case` → `camelCase`, prix imbriqués, relations).
6. **Brancher les lectures** écran par écran (Clients → Venues → Providers → Events → Home), avec états de chargement et d'erreur.
7. **Ajouter les écritures** (formulaires création / édition / suppression), puis tâches, timeline, réservations.
8. **Routes de détail** (`/events/[id]`, etc.) pour avoir des URL partageables et le retour navigateur.
9. **Nettoyer le code du template** et unifier les composants et le thème.
10. **Préparer le mobile** : aligner Home et Profile iOS sur le web, tester sur appareil, passer en revue le build EAS.
