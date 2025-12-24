
# Backend Implementation Guide

## Overview

This document describes the backend functionality implemented for the Event Management Application using Supabase.

## Database Schema

### Tables Created

1. **profiles** - User profiles extending auth.users
   - Fields: id, name, email, phone, avatar_url, role, created_at, updated_at
   - Roles: admin, client, service_provider, venue_owner

2. **clients** - Client information
   - Fields: id, user_id, name, email, phone, address, created_at, updated_at

3. **communication_logs** - Communication history with clients
   - Fields: id, client_id, date, type, notes, created_by, created_at

4. **service_providers** - Service provider profiles
   - Fields: id, user_id, name, service_type, description, portfolio, pricing, rating, contact info

5. **availability_slots** - Availability for providers and venues
   - Fields: id, provider_id, venue_id, date, available, created_at

6. **reviews** - Reviews for providers and venues
   - Fields: id, provider_id, venue_id, client_id, client_name, rating, comment, date

7. **venues** - Venue information
   - Fields: id, user_id, name, description, photos, capacity, pricing, location, amenities, rating

8. **events** - Event details
   - Fields: id, title, type, client_id, venue_id, date, times, guest_count, budget, status, notes

9. **event_providers** - Junction table for event-provider relationships
   - Fields: id, event_id, provider_id, service_type

10. **tasks** - Event tasks
    - Fields: id, event_id, title, description, due_date, completed, assigned_to

11. **timeline_items** - Event timeline
    - Fields: id, event_id, title, date, time, description

12. **bookings** - Booking records
    - Fields: id, event_id, client_id, provider_id, venue_id, date, status, amount, notes

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **SELECT**: Most tables allow authenticated users to view all records
- **INSERT**: Users can create records they own or have permission for
- **UPDATE**: Users can update their own records; admins have broader access
- **DELETE**: Restricted to record owners and admins

### Key Security Features

- User authentication required for all operations
- Role-based access control using profiles table
- Optimized policies with indexes on filtered columns
- Performance-optimized using `(select auth.uid())` pattern

## API Hooks

### Authentication (`hooks/useAuth.ts`)

- `signUp(email, password, name, role)` - Register new user
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `resetPassword(email)` - Request password reset

### Data Management Hooks

1. **useClients** - Client CRUD operations
2. **useServiceProviders** - Service provider CRUD operations
3. **useVenues** - Venue CRUD operations
4. **useEvents** - Event CRUD operations with provider assignment
5. **useReviews** - Review creation and fetching

Each hook provides:
- Automatic data fetching on mount
- Loading and error states
- CRUD operations (create, read, update, delete)
- Automatic refetching after mutations

## Authentication Flow

1. User registers with email/password and role
2. Email verification required before sign in
3. Profile automatically created in profiles table
4. Session managed by Supabase Auth
5. Auth state available throughout app via AuthContext

## Usage Examples

### Sign Up

```typescript
const { signUp } = useAuthContext();
await signUp('user@example.com', 'password123', 'John Doe', 'client');
```

### Fetch Clients

```typescript
const { clients, loading, error } = useClients();
```

### Create Event

```typescript
const { createEvent } = useEvents();
await createEvent({
  title: 'Wedding',
  type: 'wedding',
  client_id: 'client-uuid',
  date: '2024-06-15',
  start_time: '16:00',
  end_time: '23:00',
  guest_count: 200,
  budget: 25000,
  status: 'planning',
});
```

### Assign Provider to Event

```typescript
const { assignProvider } = useEvents();
await assignProvider('event-uuid', 'provider-uuid', 'photographer');
```

## Next Steps

To integrate the backend with your existing UI:

1. Replace mock data imports with hook calls
2. Add authentication screens to navigation
3. Implement loading and error states in UI
4. Add forms for creating/editing records
5. Implement real-time updates using Supabase subscriptions (optional)

## Environment Variables

The Supabase URL and anon key are already configured in:
- `app/integrations/supabase/client.ts`

## Database Migrations

All migrations have been applied to your Supabase project. To view them:

```bash
# List migrations
supabase db list

# View specific migration
supabase db show <migration_name>
```

## Security Considerations

1. Email verification required for new accounts
2. All database operations protected by RLS
3. Passwords hashed by Supabase Auth
4. JWT tokens used for authentication
5. Role-based access control implemented

## Performance Optimizations

1. Indexes created on frequently queried columns
2. RLS policies optimized with `(select auth.uid())` pattern
3. Efficient query patterns to minimize joins
4. Proper use of foreign keys and cascading deletes

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Review RLS policies for permission errors
3. Check browser console for client-side errors
4. Use `console.log` statements in hooks for debugging
