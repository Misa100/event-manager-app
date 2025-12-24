
export type UserRole = 'admin' | 'client' | 'service_provider' | 'venue_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  bookingHistory: Booking[];
  communicationLogs: CommunicationLog[];
  createdAt: string;
}

export interface CommunicationLog {
  id: string;
  clientId: string;
  date: string;
  type: 'email' | 'phone' | 'meeting' | 'message';
  notes: string;
}

export type ServiceType = 'photographer' | 'videographer' | 'drone_operator' | 'audio_provider' | 'dj' | 'caterer' | 'decorator';

export interface ServiceProvider {
  id: string;
  name: string;
  serviceType: ServiceType;
  description: string;
  portfolio: string[];
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  availability: AvailabilitySlot[];
  reviews: Review[];
  rating: number;
  phone: string;
  email: string;
  location: string;
}

export interface AvailabilitySlot {
  date: string;
  available: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  photos: string[];
  capacity: number;
  pricing: {
    perHour?: number;
    perDay?: number;
    currency: string;
  };
  location: string;
  amenities: string[];
  availability: AvailabilitySlot[];
  bookings: Booking[];
  rating: number;
  reviews: Review[];
}

export interface Event {
  id: string;
  title: string;
  type: 'wedding' | 'birthday' | 'corporate' | 'other';
  clientId: string;
  venueId?: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  budget: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  assignedProviders: {
    providerId: string;
    serviceType: ServiceType;
  }[];
  tasks: Task[];
  timeline: TimelineItem[];
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  assignedTo?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  clientId: string;
  providerId?: string;
  venueId?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  notes?: string;
}
