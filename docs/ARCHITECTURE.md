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

Identité : le projet porte plusieurs noms selon le fichier – `Event Manager` (UI et README), `Eventide Celebrations` (`app.json`), `Natively` (`package.json`, manifest PWA, bundle ID `com.anonymous.Natively`). Voir `V0_BASELINE.md`.

## 2. Arborescence

```
app/                         Routes (expo-router)
├── _layout.tsx              Racine : <AuthProvider> + Stack
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
│   ├── profile.tsx          Profil de l'utilisateur connecté (non listé dans les onglets)
│   └── profile.ios.tsx      Profil iOS (contenu statique du template)
├── auth/
│   ├── login.tsx
│   └── register.tsx
├── modal.tsx                Démos de modales (template)
├── formsheet.tsx
└── transparent-modal.tsx

components/                  Composants partagés (voir §6)
contexts/                    AuthContext (utilisé), WidgetContext (template, inutilisé)
hooks/                       useAuth + hooks de données Supabase (voir DATA_MODEL.md)
lib/supabase/                client.ts (instance Supabase), types.ts (types générés)
types/index.ts               Types métier côté UI (camelCase, objets imbriqués)
data/mockData.ts             Données factices alimentant les écrans métier
styles/commonStyles.ts       Palette `Colors` + styles communs (utilisés par les écrans)
constants/Colors.ts          Palette du template (thèmes clair/sombre), peu utilisée
utils/errorLogger.ts         Logger d'erreurs du template (non importé)
babel-plugins/               Plugins « edit mode » de l'outil Natively (dev uniquement)
public/                      index.html, manifest PWA, icônes
supabase/config.toml         Seulement le project_id (pas de migrations versionnées)
scripts/generate-readme.js   Génère le README racine depuis package.json
```

Point d'entrée : `index.ts` → `expo-router/entry`.

## 3. Navigation

- **Racine** (`app/_layout.tsx`) : un `Stack` sans en-tête qui déclare `(tabs)`, `auth/login`, `auth/register` et trois modales (`modal`, `formsheet`, `transparent-modal`).
- **Onglets** : Home, Clients, Providers, Venues, Events.
  - Web/Android : le layout `(tabs)/_layout.tsx` est un `Stack` (`animation: 'none'`) sur lequel est posé le composant `FloatingTabBar` (barre flottante floutée, animée, qui calcule l'onglet actif depuis `usePathname()`).
  - iOS : `_layout.ios.tsx` utilise `NativeTabs` d'expo-router (API instable `unstable-native-tabs`) avec des icônes SF Symbols.
- **Écrans « liste → détail »** : Clients, Providers, Venues et Events n'ont pas de route de détail. Chaque écran garde un état local `selected…` et affiche soit la liste, soit le détail, avec un bouton « Back to … ». Conséquence : pas d'URL par élément, donc pas de lien direct ni de bouton retour navigateur.
- **Auth** : `auth/login` redirige vers `/(tabs)` après connexion. Aucun écran n'y renvoie aujourd'hui et il n'y a pas de garde de route (l'app s'ouvre sans login).

## 4. Variantes par plateforme

Le résolveur Babel (`module-resolver`) et Metro choisissent les fichiers `.ios.tsx` avant `.tsx` :

| Fichier | iOS | Web / Android |
|---|---|---|
| `(tabs)/_layout` | `NativeTabs` | `Stack` + `FloatingTabBar` |
| `(tabs)/(home)/index` | démo du template (« Building the app… », liste des modales) | écran d'accueil réel |
| `(tabs)/profile` | contenu statique (« John Doe ») | profil réel via `useAuthContext` |
| `components/IconSymbol` | `expo-symbols` (SF Symbols) | `MaterialIcons` |

À retenir pour le portage mobile : **l'iOS n'affiche pas aujourd'hui les mêmes écrans que le web** pour Home et Profile.

## 5. Authentification

- `hooks/useAuth.ts` encapsule Supabase Auth : `getSession()` au montage, abonnement `onAuthStateChange`, et les actions `signUp`, `signIn`, `signOut`, `resetPassword`. Les retours utilisateur passent par `Alert.alert`.
- `signUp` envoie `name` et `role` dans les métadonnées Supabase, puis insère une ligne dans `profiles`.
- `contexts/AuthContext.tsx` expose le hook via `AuthProvider` / `useAuthContext()` (monté à la racine).
- La session est persistée avec AsyncStorage (`lib/supabase/client.ts`).
- Les URL de redirection e-mail (`emailRedirectTo`, `redirectTo`) pointent vers `natively.dev`.

## 6. Composants

| Composant | Rôle | Utilisé par |
|---|---|---|
| `FloatingTabBar` | Barre d'onglets flottante (web/Android) | `(tabs)/_layout.tsx` |
| `IconSymbol` (+ `.ios`) | Icône multiplateforme (SF Symbols / Material) | tous les écrans |
| `DemoCard`, `HeaderButtons`, `homeData` | Démo de modales du template | `index.ios.tsx` |
| `ListItem`, `IconCircle`, `button`, `BodyScrollView` | Briques génériques du template | `ListItem` → `IconCircle` ; les autres ne sont importées nulle part |

Les écrans métier ne réutilisent pas ces briques : chacun définit ses propres `StyleSheet` locaux.

## 7. Styles

- Palette unique dans `styles/commonStyles.ts` (`Colors` : primary `#007BFF`, accent `#28A745`, highlight `#FFC107`, etc.) + `commonStyles` / `buttonStyles`.
- Thème clair uniquement côté écrans métier (fond `#F5F5F5`), bien que `app.json` déclare `userInterfaceStyle: "automatic"`.
- `constants/Colors.ts` (thèmes clair/sombre du template) n'est pas utilisé par les écrans métier.

## 8. Configuration et build

- **Alias** : `@/…` → racine du projet (défini dans `tsconfig.json` et `babel.config.js`). Les autres alias Babel (`@components`, `@hooks`, `@types`, `@contexts`, `@style`) ne sont pas déclarés dans `tsconfig.json` ; `@style` vise un dossier `./style` qui n'existe pas (le dossier réel est `styles/`).
- **Scripts** (`package.json`) : `dev` (Expo avec tunnel), `android`, `ios`, `web`, `build:web` (`expo export -p web` puis Workbox), `build:android` (`expo prebuild`), `lint`, `readme`.
- **PWA** : `public/manifest.json` + `workbox-config.js` (stratégie `NetworkFirst` sur tout, `dist/sw.js`).
- **Mode édition** : `babel.config.js` active les plugins `babel-plugins/*` seulement si `EXPO_PUBLIC_ENABLE_EDIT_MODE=TRUE` en développement (outil Natively).
- **Supabase** : URL et clé publique (anon) sont écrites en dur dans `lib/supabase/client.ts`.
