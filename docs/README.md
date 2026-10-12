# Documentation – Event Manager (v0 web)

Cette documentation décrit l'app **telle qu'elle est aujourd'hui** (baseline « v0 »). Elle sert de point de départ commun pour perfectionner la version web, puis pour porter l'app en mobile.

> Principe : on décrit ce qui existe réellement dans le code. Ce qui est prévu ou à corriger est isolé dans [`V0_BASELINE.md`](./V0_BASELINE.md).

| Document | Contenu |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Stack, arborescence, routing, variantes par plateforme, auth, styles, configuration |
| [`DATA_MODEL.md`](./DATA_MODEL.md) | Schéma Supabase, types côté UI, écarts entre les deux, hooks de données |
| [`V0_BASELINE.md`](./V0_BASELINE.md) | État fonctionnel de la v0, code template/mort, écarts de config, pistes d'étapes |

## En une phrase

App d'organisation d'événements (mariages, anniversaires, corporate) construite avec Expo / React Native / expo-router, ciblant web, iOS et Android depuis une seule base de code, avec Supabase comme backend. L'auth est branchée ; les écrans métier tournent encore sur des données factices.

## Autres fichiers à la racine

- `README.md` : généré par `scripts/generate-readme.js`, très générique (ne reflète pas le projet).
- `BACKEND_IMPLEMENTATION.md` : guide du backend Supabase (schéma, RLS, hooks). Voir les écarts relevés dans `V0_BASELINE.md`.
