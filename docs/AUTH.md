# Authentification

Authentification par e-mail + mot de passe via Supabase Auth, avec garde de route, confirmation d'e-mail, réinitialisation du mot de passe et profil.

## Parcours

| Parcours | Écrans / fichiers | Comportement |
|---|---|---|
| Inscription | `app/auth/register.tsx` | Validation locale (champs, e-mail, 8 caractères min., confirmation). Rôle au choix parmi `client`, `service_provider`, `venue_owner` (jamais `admin`). Si Supabase exige la confirmation d'e-mail, l'écran passe à « Check Your Email » ; sinon la session est ouverte et le garde envoie vers l'app. |
| Confirmation d'e-mail | `app/email-confirmed.tsx` | Cible du lien `${SITE_URL}/email-confirmed`. Accessible connecté ou non. |
| Connexion | `app/auth/login.tsx` | Messages d'erreur dans la page. Si le compte n'est pas confirmé : lien « Resend confirmation email ». Après succès : atterrissage sur l'accueil. |
| Mot de passe oublié | `app/auth/forgot-password.tsx` | Envoie le lien de réinitialisation. Le message de succès est volontairement neutre (« si un compte existe… »). |
| Nouveau mot de passe | `app/reset-password.tsx` | Cible du lien `${SITE_URL}/reset-password`. Sans session valide : « Link Expired ». Sinon formulaire, puis retour à l'accueil. |
| Profil / déconnexion | `app/(tabs)/profile.tsx` | 6ᵉ onglet (web/Android et iOS). Affiche nom, e-mail, rôle, date de création. Déconnexion → retour à la connexion. |
| Session | `lib/supabase/client.ts` | Persistée (AsyncStorage). Web : lecture des jetons dans l'URL (`detectSessionInUrl`). Mobile : rafraîchissement du jeton seulement quand l'app est au premier plan. |

## Garde de route

`app/_layout.tsx` utilise `Stack.Protected` :

- **Connecté** : `(tabs)` et les modales.
- **Déconnecté** : `auth/login`, `auth/register`, `auth/forgot-password`.
- **Toujours accessibles** : `reset-password` et `email-confirmed` (cibles des liens d'e-mail, qui peuvent connecter l'utilisateur à l'arrivée).

Pendant le chargement de la session, l'écran de démarrage reste affiché (`expo-splash-screen`) pour éviter un flash de l'écran de connexion.

## Code

| Fichier | Rôle |
|---|---|
| `hooks/useAuth.ts` | Session, profil, `signUp`, `signIn`, `signOut`, `resetPassword`, `updatePassword`, `resendConfirmation`. Aucune alerte native : chaque action renvoie `{ success, error?, needsEmailConfirmation? }` (`Alert.alert` est sans effet sur le web). |
| `contexts/AuthContext.tsx` | Expose le hook à toute l'app (`useAuthContext()`). |
| `lib/auth.ts` | Rôles (`SELF_SERVICE_ROLES`, `ROLE_LABELS`), validation, traduction des codes d'erreur Supabase. |
| `components/AuthUI.tsx` | Gabarit et briques communes des écrans d'auth (champ, bouton, lien, message). |

**Profil** : après connexion, `useAuth` lit la ligne `profiles` de l'utilisateur. Si elle n'existe pas, elle est créée à partir des métadonnées d'inscription (le rôle est ramené à un rôle libre-service). L'ancienne insertion faite pendant l'inscription est supprimée : à ce moment l'utilisateur n'a pas encore de session, donc une politique RLS correcte la refuserait.

## À configurer côté Supabase (tableau de bord)

1. **Authentication → URL Configuration** : définir *Site URL* et ajouter dans *Redirect URLs* `<SITE_URL>/email-confirmed` et `<SITE_URL>/reset-password`.
2. Définir `EXPO_PUBLIC_SITE_URL` avec cette même URL (le repli actuel `https://natively.dev` n'héberge pas l'app : les liens des e-mails n'aboutiraient pas).
3. Vérifier les modèles d'e-mail (confirmation, réinitialisation) et le réglage « Confirm email ».

## Sécurité : à faire côté serveur

Le choix du rôle est filtré dans l'UI **et** dans `useAuth`, mais cela ne protège pas contre un appel direct à l'API : n'importe qui peut envoyer `role: 'admin'` dans les métadonnées d'inscription ou dans une insertion sur `profiles`. Il faut l'interdire côté base. Proposition à relire et appliquer lors de l'étape « versionner le backend » (non appliquée) :

- une fonction/trigger `SECURITY DEFINER` sur `auth.users` qui crée la ligne `profiles` en ramenant le rôle à `client`, `service_provider` ou `venue_owner` ;
- une politique RLS (ou un trigger `BEFORE UPDATE`) empêchant un non-admin de modifier `profiles.role`, et un `WITH CHECK` empêchant l'insertion d'un profil `admin` ;
- ne jamais déduire un droit d'accès du rôle lu côté client : les droits reposent sur les politiques RLS.

## Limites connues

- **Rôles** : affichés dans le profil mais pas encore utilisés pour adapter la navigation ou les droits.
- **Profil** : les boutons « Edit Profile », « Notifications » et « Settings » sont des maquettes.
- **Mobile natif** : les liens d'e-mail ouvrent l'URL web (pas de lien profond vers l'app).
- **URL** : un utilisateur déjà connecté qui ouvre directement `/auth/login` est redirigé vers un onglet de l'app (pas toujours l'accueil).
- **Vérification** : testé dans Chromium avec un backend Supabase simulé (le domaine Supabase n'est pas joignable depuis l'environnement de développement), pas contre le vrai projet.
