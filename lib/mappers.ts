// Database rows (snake_case, nullable columns, flat) -> UI types (camelCase, nested).
// The hooks fetch each entity together with its children using the select strings
// below, then convert with these functions. See docs/DATA_MODEL.md.

import type { Json, Tables } from './supabase/types';
import type {
  AvailabilitySlot,
  Booking,
  Client,
  CommunicationLog,
  Event,
  Review,
  ServiceProvider,
  ServiceType,
  Task,
  TimelineItem,
  Venue,
} from '../types';

// --- select strings (PostgREST embedding follows the foreign keys) -----------------

export const CLIENT_SELECT = '*, communication_logs(*), bookings(*)';
export const PROVIDER_SELECT = '*, reviews(*), availability_slots(*)';
export const VENUE_SELECT = '*, reviews(*), availability_slots(*), bookings(*)';
export const EVENT_SELECT = '*, event_providers(*), tasks(*), timeline_items(*)';

export type ClientRow = Tables<'clients'> & {
  communication_logs: Tables<'communication_logs'>[];
  bookings: Tables<'bookings'>[];
};
export type ProviderRow = Tables<'service_providers'> & {
  reviews: Tables<'reviews'>[];
  availability_slots: Tables<'availability_slots'>[];
};
export type VenueRow = Tables<'venues'> & {
  reviews: Tables<'reviews'>[];
  availability_slots: Tables<'availability_slots'>[];
  bookings: Tables<'bookings'>[];
};
export type EventRow = Tables<'events'> & {
  event_providers: Tables<'event_providers'>[];
  tasks: Tables<'tasks'>[];
  timeline_items: Tables<'timeline_items'>[];
};

// --- helpers -------------------------------------------------------------------------

/** The database stores these as free text: keep known values, fall back otherwise. */
function oneOf<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** `jsonb` column holding a list of strings (photos, portfolio, amenities). */
function stringList(value: Json | null): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

/** Postgres `time` comes back as HH:MM:SS; the UI shows HH:MM. */
function hhmm(time: string): string {
  return time.slice(0, 5);
}

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

// --- leaf entities ---------------------------------------------------------------------

export function mapReview(row: Tables<'reviews'>): Review {
  return {
    id: row.id,
    clientName: row.client_name,
    rating: row.rating,
    comment: row.comment ?? '',
    date: row.date ?? row.created_at?.slice(0, 10) ?? '',
  };
}

export function mapAvailability(row: Tables<'availability_slots'>): AvailabilitySlot {
  return { date: row.date, available: row.available ?? false };
}

export function mapBooking(row: Tables<'bookings'>): Booking {
  return {
    id: row.id,
    eventId: row.event_id,
    clientId: row.client_id,
    providerId: row.provider_id ?? undefined,
    venueId: row.venue_id ?? undefined,
    date: row.date,
    status: oneOf(row.status, ['pending', 'confirmed', 'cancelled'], 'pending'),
    amount: row.amount ?? 0,
    notes: row.notes ?? undefined,
  };
}

export function mapCommunicationLog(row: Tables<'communication_logs'>): CommunicationLog {
  return {
    id: row.id,
    clientId: row.client_id,
    date: row.date ?? row.created_at?.slice(0, 10) ?? '',
    type: oneOf(row.type, ['email', 'phone', 'meeting', 'message'], 'message'),
    notes: row.notes ?? '',
  };
}

export function mapTask(row: Tables<'tasks'>): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    dueDate: row.due_date ?? '',
    completed: row.completed ?? false,
    assignedTo: row.assigned_to ?? undefined,
  };
}

export function mapTimelineItem(row: Tables<'timeline_items'>): TimelineItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: hhmm(row.time),
    description: row.description ?? undefined,
  };
}

// --- main entities ---------------------------------------------------------------------

export function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? '',
    address: row.address ?? undefined,
    bookingHistory: row.bookings.map(mapBooking).sort(byDateDesc),
    communicationLogs: row.communication_logs.map(mapCommunicationLog).sort(byDateDesc),
    createdAt: row.created_at ?? '',
  };
}

export function mapServiceProvider(row: ProviderRow): ServiceProvider {
  return {
    id: row.id,
    name: row.name,
    // Free text in the database: unknown values are shown as-is by the screens.
    serviceType: row.service_type as ServiceType,
    description: row.description ?? '',
    portfolio: stringList(row.portfolio),
    pricing: {
      min: row.pricing_min ?? 0,
      max: row.pricing_max ?? 0,
      currency: row.pricing_currency ?? 'USD',
    },
    availability: row.availability_slots.map(mapAvailability),
    reviews: row.reviews.map(mapReview).sort(byDateDesc),
    rating: row.rating ?? 0,
    phone: row.phone ?? '',
    email: row.email,
    location: row.location ?? '',
  };
}

export function mapVenue(row: VenueRow): Venue {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    photos: stringList(row.photos),
    capacity: row.capacity ?? 0,
    pricing: {
      perHour: row.pricing_per_hour ?? undefined,
      perDay: row.pricing_per_day ?? undefined,
      currency: row.pricing_currency ?? 'USD',
    },
    location: row.location ?? '',
    amenities: stringList(row.amenities),
    availability: row.availability_slots.map(mapAvailability),
    bookings: row.bookings.map(mapBooking).sort(byDateDesc),
    rating: row.rating ?? 0,
    reviews: row.reviews.map(mapReview).sort(byDateDesc),
  };
}

export function mapEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    type: oneOf(row.type, ['wedding', 'birthday', 'corporate', 'other'], 'other'),
    clientId: row.client_id,
    venueId: row.venue_id ?? undefined,
    date: row.date,
    startTime: hhmm(row.start_time),
    endTime: hhmm(row.end_time),
    guestCount: row.guest_count ?? 0,
    budget: row.budget ?? 0,
    status: oneOf(row.status, ['planning', 'confirmed', 'completed', 'cancelled'], 'planning'),
    assignedProviders: row.event_providers.map((ep) => ({
      providerId: ep.provider_id,
      serviceType: ep.service_type as ServiceType,
    })),
    tasks: row.tasks.map(mapTask).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    timeline: row.timeline_items
      .map(mapTimelineItem)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    notes: row.notes ?? undefined,
  };
}
