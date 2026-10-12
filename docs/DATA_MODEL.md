# Modèle de données

Deux représentations coexistent :

1. **Base Supabase** (`lib/supabase/types.ts`, types générés) : `snake_case`, colonnes à plat.
2. **Types UI** (`types/index.ts`) : `camelCase`, objets imbriqués (ex. `pricing: { min, max, currency }`), relations embarquées (ex. `Event.tasks`).

Les écrans consomment les types UI. Les hooks lisent la base (avec les tables liées) et convertissent via `lib/mappers.ts` (voir §3 et §4).

## 1. Tables Supabase (schéma `public`)

Rôles applicatifs (`profiles.role`) : `admin`, `client`, `service_provider`, `venue_owner`. Aucune énumération Postgres : `role`, `status`, `type`, `service_type` sont des `string` libres, les valeurs autorisées ne sont donc pas contraintes par les types.

| Table | Colonnes principales | Liens |
|---|---|---|
| `profiles` | id, name, email, phone, avatar_url, role | `id` = id de l'utilisateur Auth |
| `clients` | id, name, email, phone, address | `user_id` (optionnel) |
| `communication_logs` | id, client_id, date, type, notes, created_by | → `clients` |
| `service_providers` | id, name, service_type, description, portfolio (json), pricing_min / pricing_max / pricing_currency, rating, email, phone, location | `user_id` (optionnel) |
| `venues` | id, name, description, photos (json), capacity, pricing_per_hour / pricing_per_day / pricing_currency, location, amenities (json), rating | `user_id` (optionnel) |
| `availability_slots` | id, date, available | → `service_providers` **ou** `venues` |
| `reviews` | id, client_name, rating, comment, date | → `service_providers` ou `venues`, `client_id` |
| `events` | id, title, type, client_id, venue_id, date, start_time, end_time, guest_count, budget, status, notes | → `clients`, `venues` |
| `event_providers` | id, event_id, provider_id, service_type | table de jonction événement ↔ prestataire |
| `tasks` | id, event_id, title, description, due_date, completed, assigned_to | → `events` |
| `timeline_items` | id, event_id, title, date, time, description | → `events` |
| `bookings` | id, event_id, client_id, provider_id, venue_id, date, status, amount, notes | → `events`, `clients`, et prestataire ou lieu |

Toutes les tables ont `created_at` ; `updated_at` n'existe que sur `profiles`, `clients`, `service_providers`, `venues`, `events`, `tasks` et `bookings`. Aucune vue, fonction ni enum n'est définie.

## 2. Types UI

| Type | Valeurs / forme |
|---|---|
| `UserRole` | `admin` · `client` · `service_provider` · `venue_owner` |
| `ServiceType` | `photographer` · `videographer` · `drone_operator` · `audio_provider` · `dj` · `caterer` · `decorator` |
| `Event.type` | `wedding` · `birthday` · `corporate` · `other` |
| `Event.status` | `planning` · `confirmed` · `completed` · `cancelled` |
| `Booking.status` | `pending` · `confirmed` · `cancelled` |
| `CommunicationLog.type` | `email` · `phone` · `meeting` · `message` |

Entités : `Client`, `ServiceProvider`, `Venue`, `Event`, `Task`, `TimelineItem`, `Booking`, `Review`, `AvailabilitySlot`, `CommunicationLog`, `User`.

## 3. Hooks de données (`hooks/`)

Tous suivent le même patron : état `{ données, loading, error }`, fetch au montage, et après chaque mutation un re-fetch complet. Les mutations retournent `{ success, data? , error? }`. Les logs sont préfixés `[useXxx]`.

**Lecture** : `useClients`, `useServiceProviders`, `useVenues` et `useEvents` retournent des **types UI** (`Client[]`, etc.), jointures incluses (une seule requête PostgREST par entité, voir les `*_SELECT` de `lib/mappers.ts`). Les **mutations** prennent encore des types de la base (`TablesInsert` / `TablesUpdate`) : elles seront alignées à l'étape des écritures. `useReviews` retourne toujours des lignes brutes (les avis des prestataires et lieux arrivent déjà par jointure).

| Hook | Lecture | Mutations |
|---|---|---|
| `useClients()` | `clients` + journal de communication + réservations (tri par `created_at` décroissant) | `createClient`, `updateClient`, `deleteClient` |
| `useServiceProviders()` | `providers` + avis + disponibilités (tri par `rating` décroissant, filtre `serviceType` optionnel) | create / update / delete |
| `useVenues()` | `venues` + avis + disponibilités + réservations | create / update / delete |
| `useEvents()` | `events` + prestataires assignés + tâches + timeline (tri par `date` croissante) | `createEvent`, `updateEvent`, `deleteEvent`, `assignProvider`, `removeProvider` |
| `useReviews(providerId?, venueId?)` | `reviews` filtrées | `createReview` |
| `useAuth()` | session, user, loading | `signUp`, `signIn`, `signOut`, `resetPassword` |

Non couvert par un hook : `tasks`, `timeline_items`, `bookings`, `availability_slots`, `communication_logs`, `profiles` (hors insertion à l'inscription).

## 4. Couche de mapping (`lib/mappers.ts`)

Convertit les lignes de la base en types UI. Règles appliquées :

| Sujet | Traitement |
|---|---|
| Casse | `client_id` → `clientId`, `start_time` → `startTime`, etc. |
| Prix | `pricing_min/max/currency` → `pricing: { min, max, currency }` ; `pricing_per_hour/per_day` → `pricing: { perHour?, perDay?, currency }` (devise par défaut `USD`) |
| Relations | Jointures PostgREST, puis tri : avis, journal et réservations par date décroissante ; tâches par échéance ; timeline par date puis heure |
| `null` | Texte → `''`, nombres → `0`, listes → `[]`, champs optionnels → `undefined`. Disponibilité `null` → `false` (on ne promet pas une disponibilité inconnue) |
| Heures | `time` Postgres `16:00:00` → `16:00` |
| JSON | `portfolio`, `photos`, `amenities` : seules les chaînes d'un tableau sont gardées, sinon `[]` |
| Valeurs libres | `Event.type` (repli `other`), `Event.status` (repli `planning`), `Booking.status` (repli `pending`), `CommunicationLog.type` (repli `message`). `serviceType` est conservé tel quel : un type inconnu s'affiche en clair (`wedding_florist` → « wedding florist ») |

Reste ouvert : `audio_provider` existe dans `ServiceType` mais pas comme filtre de l'écran Providers ; aucune contrainte en base sur les valeurs libres (à traiter avec les migrations).

## 5. Sécurité (d'après `BACKEND_IMPLEMENTATION.md`)

RLS activée sur toutes les tables, lecture ouverte aux utilisateurs authentifiés, écriture limitée aux propriétaires et aux admins, e-mail à vérifier à l'inscription. **Les migrations et politiques ne sont pas dans ce repo** : elles n'ont pas pu être relues pour rédiger cette doc.

## 6. Données factices

`data/mockData.ts` (3 clients, 6 prestataires, 3 lieux, 2 événements) a été retiré quand les écrans ont été branchés ; il reste consultable dans l'historique git (tag `v0`). **Une base vide donne des écrans vides** : il n'y a pas encore de formulaire de création ni de script de seed.
