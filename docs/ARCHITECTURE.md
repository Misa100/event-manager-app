# Architecture

## 1. Stack

| Domaine | Choix |
|---|---|
| Framework | Expo SDK 54, React Native 0.81 (nouvelle architecture activée), React 19 |
| Routing | expo-router 6 (routes basées sur les fichiers, routes typées) |
| Langage | TypeScript (`strict: true`) |
| Web | react-native-web, bundler Metro, service worker généré par Workbox |
| Backend | Supabase (Auth + Postgres) via `@supabase/supabase-js` |
| Animations / UI | react-native-reanimated, expo-blur, expo-glass-effect, expo-symbols, `@expo/vector-icons` |
| Build natif | EAS (`eas.json` : `development`, `preview`, `production`) |
| Lint | ESLint (config Expo + TypeScript + React) |

Identité : « Event Manager » (voir `CHANGELOG.md` ; à la v0 le projet portait aussi les noms `Eventide Celebrations` et `Natively`).

## 2. Arborescence

```
app/                         Routes (expo-router)
├── _layout.tsx              Racine : <AuthProvider> + Stack avec garde de route (Stack.Protected)
├── (tabs)/
│   ├── _layout.tsx          Web/Android : Stack + FloatingTabBar maison
│   ├── _layout.ios.tsx      iOS : NativeTabs (barre d'onglets native)
│   ├── (home)/
│   │   ├── _layout.tsx      Stack du groupe Home
│   │   ├── index.tsx        Accueil web/Android (stats + actions rapides)
│   │   └── index.ios.tsx    Accueil iOS (écran de démo du template)
│   ├── clients.tsx          Liste + détail des clients
│   ├── providers.tsx        Liste + filtre par type + détail des prestataires
│   ├── venues.tsx           Liste + détail des lieux
│   ├── events.tsx           Liste + détail des événements
│   └── profile.tsx          Profil de l'utilisateur connecté (6ᵉ onglet)
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── reset-password.tsx       Cible du lien e-mail de réinitialisation
├── email-confirmed.tsx      Cible du lien e-mail de confirmation
├── modal.tsx                Démos de modales (template)
├── formsheet.tsx
└── transparent-modal.tsx

components/                  Composants partagés (voir §6), dont AuthUI.tsx (écrans d'auth)
contexts/                    AuthContext (utilisé), WidgetContext (template, inutilisé)
hooks/                       useAuth + hooks de données Supabase (voir DATA_MODEL.md)
lib/config.ts                Variables d'environnement EXPO_PUBLIC_*
lib/auth.ts                  Rôles, validation, messages d'erreur d'auth
lib/supabase/                client.ts (instance Supabase), types.ts (types générés)
types/index.ts               Types métier côté UI (camelCase, objets imbriqués)
data/mockData.ts             Données factices alimentant les écrans métier
styles/commonStyles.ts       Palette `Colors` + styles communs (utilisés par les écrans)
constants/Colors.ts          Palette du template (thèmes clair/sombre), peu utilisée
utils/errorLogger.ts         Logger d'erreurs du template (non importé)
babel-plugins/               Plugins « edit mode » de l'outil Natively (dev uniquement)
public/                      index.html, manifest PWA, icônes
supabase/config.toml         Seulement le project_id (pas de migrations versionnées)
```

Point d'entrée : `index.ts` → `expo-router/entry`.

## 3. Navigation

- **Racine** (`app/_layout.tsx`) : un `Stack` sans en-tête, découpé par `Stack.Protected` : `(tabs)` et les trois modales (`modal`, `formsheet`, `transparent-modal`) pour les utilisateurs connectés ; `auth/*` pour les déconnectés ; `reset-password` et `email-confirmed` pour tous. Voir `AUTH.md`.
- **Onglets** : Home, Clients, Providers, Venues, Events, Profile.
  - Web/Android : le layout `(tabs)/_layout.tsx` est un `Stack` (`animation: 'none'`) sur lequel est posé le composant `FloatingTabBar` (barre flottante floutée, animée, qui calcule l'onglet actif depuis `usePathname()`).
  - iOS : `_layout.ios.tsx` utilise `NativeTabs` d'expo-router (API instable `unstable-native-tabs`) avec des icônes SF Symbols.
- **Écrans « liste → détail »** : Clients, Providers, Venues et Events n'ont pas de route de détail. Chaque écran garde un état local `selected…` et affiche soit la liste, soit le détail, avec un bouton « Back to … ». Conséquence : pas d'URL par élément, donc pas de lien direct ni de bouton retour navigateur.
- **Auth** : le garde de route renvoie les déconnectés vers `auth/login` et, après connexion, l'utilisateur est envoyé sur l'accueil.

## 4. Variantes par plateforme

Le résolveur Babel (`module-resolver`) et Metro choisissent les fichiers `.ios.tsx` avant `.tsx` :

| Fichier | iOS | Web / Android |
|---|---|---|
| `(tabs)/_layout` | `NativeTabs` | `Stack` + `FloatingTabBar` |
| `(tabs)/(home)/index` | démo du template (« Building the app… », liste des modales) | écran d'accueil réel |
| `components/IconSymbol` | `expo-symbols` (SF Symbols) | `MaterialIcons` |

À retenir pour le portage mobile : **l'iOS n'affiche pas aujourd'hui le même écran d'accueil que le web** (démo du template). Le profil, lui, est commun aux deux.

## 5. Authentification

Voir [`AUTH.md`](./AUTH.md) : parcours, garde de route, code, configuration Supabase, sécurité et limites.

## 6. Composants

| Composant | Rôle | Utilisé par |
|---|---|---|
| `FloatingTabBar` | Barre d'onglets flottante (web/Android) | `(tabs)/_layout.tsx` |
| `IconSymbol` (+ `.ios`) | Icône multiplateforme (SF Symbols / Material) | tous les écrans |
| `DemoCard`, `HeaderButtons`, `homeData` | Démo de modales du template | `index.ios.tsx` |
| `AuthUI` | Gabarit et briques des écrans d'authentification | `auth/*`, `reset-password`, `email-confirmed` |
| `ListItem`, `IconCircle`, `button`, `BodyScrollView` | Briques génériques du template | `ListItem` → `IconCircle` ; les autres ne sont importées nulle part |

Les écrans métier ne réutilisent pas ces briques : chacun définit ses propres `StyleSheet` locaux.

## 7. Styles

- Palette unique dans `styles/commonStyles.ts` (`Colors` : primary `#007BFF`, accent `#28A745`, highlight `#FFC107`, etc.) + `commonStyles` / `buttonStyles`.
- Thème clair uniquement côté écrans métier (fond `#F5F5F5`), bien que `app.json` déclare `userInterfaceStyle: "automatic"`.
- `constants/Colors.ts` (thèmes clair/sombre du template) n'est pas utilisé par les écrans métier.

## 8. Configuration et build

- **Alias** : `@/…` → racine du projet (défini dans `tsconfig.json` et `babel.config.js`). C'est le seul alias.
- **Scripts** (`package.json`) : `dev` (Expo avec tunnel), `android`, `ios`, `web`, `build:web` (`expo export -p web` puis Workbox), `build:android` (`expo prebuild`), `lint`.
- **PWA** : `public/manifest.json` + `workbox-config.js` (stratégie `NetworkFirst` sur tout, `dist/sw.js`).
- **Mode édition** : `babel.config.js` active les plugins `babel-plugins/*` seulement si `EXPO_PUBLIC_ENABLE_EDIT_MODE=TRUE` en développement (outil Natively).
- **Configuration runtime** : `lib/config.ts` lit `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` et `EXPO_PUBLIC_SITE_URL` (voir `.env.example`), avec repli sur le projet actuel.
