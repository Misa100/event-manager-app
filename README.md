# Event Manager

Application d'organisation d'événements (mariages, anniversaires, événements d'entreprise) : clients, prestataires, lieux et événements. Une seule base de code Expo / React Native pour le web, iOS et Android, avec Supabase comme backend.

> État actuel : baseline **v0**. L'authentification est complète (Supabase) ; les écrans métier utilisent encore des données factices. Détails dans [`docs/`](./docs/README.md).

## Démarrage

```bash
npm install
cp .env.example .env.local   # optionnel : sans variables, l'app utilise le projet Supabase actuel
npm run web                  # ou: npm run dev (tunnel Expo), npm run ios, npm run android
```

## Scripts

| Script | Rôle |
|---|---|
| `npm run dev` | Expo avec tunnel |
| `npm run web` / `ios` / `android` | Lance la plateforme visée |
| `npm run build:web` | Export web (`dist/`) + service worker Workbox |
| `npm run build:android` | `expo prebuild` Android |
| `npm run lint` | ESLint |

## Configuration

Variables optionnelles (voir [`.env.example`](./.env.example) et `lib/config.ts`) :
`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SITE_URL`.

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) : stack, arborescence, navigation, plateformes
- [`docs/AUTH.md`](./docs/AUTH.md) : authentification et garde de route
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) : schéma Supabase, types, hooks
- [`docs/V0_BASELINE.md`](./docs/V0_BASELINE.md) : état de la v0 et étapes proposées
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) : changements depuis la v0
- [`BACKEND_IMPLEMENTATION.md`](./BACKEND_IMPLEMENTATION.md) : guide du backend Supabase
