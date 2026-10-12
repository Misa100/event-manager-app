# Documentation – Event Manager (v0 web)

Cette documentation décrit l'app **telle qu'elle est aujourd'hui** (baseline « v0 »). Elle sert de point de départ commun pour perfectionner la version web, puis pour porter l'app en mobile.

> Principe : on décrit ce qui existe réellement dans le code. Ce qui est prévu ou à corriger est isolé dans [`V0_BASELINE.md`](./V0_BASELINE.md).

| Document | Contenu |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Stack, arborescence, routing, variantes par plateforme, auth, styles, configuration |
| [`AUTH.md`](./AUTH.md) | Parcours d'authentification, garde de route, configuration Supabase, sécurité |
| [`DATA_MODEL.md`](./DATA_MODEL.md) | Schéma Supabase, types côté UI, écarts entre les deux, hooks de données |
| [`V0_BASELINE.md`](./V0_BASELINE.md) | État figé de la v0 (tag `v0`), code template/mort, écarts de config, pistes d'étapes |
| [`CHANGELOG.md`](./CHANGELOG.md) | Ce qui a changé depuis la v0, étape par étape |

## En une phrase

App d'organisation d'événements (mariages, anniversaires, corporate) construite avec Expo / React Native / expo-router, ciblant web, iOS et Android depuis une seule base de code, avec Supabase comme backend. L'auth est branchée ; les écrans métier tournent encore sur des données factices.

## Autres fichiers à la racine

- `README.md` : démarrage rapide et liens.
- `BACKEND_IMPLEMENTATION.md` : guide du backend Supabase (schéma, RLS, hooks).
