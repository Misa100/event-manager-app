
import { Client, ServiceProvider, Venue, Event, Booking } from '@/types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    bookingHistory: [],
    communicationLogs: [
      {
        id: 'c1',
        clientId: '1',
        date: '2024-01-15',
        type: 'phone',
        notes: 'Discussed wedding venue options and budget',
      },
    ],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    bookingHistory: [],
    communicationLogs: [],
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    bookingHistory: [],
    communicationLogs: [],
    createdAt: '2024-01-14',
  },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Perfect Moments Photography',
    serviceType: 'photographer',
    description: 'Professional wedding and event photography with 10+ years of experience',
    portfolio: [
      'https://images.unsplash.com/photo-1519741497674-611481863552',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92',
    ],
    pricing: {
      min: 1500,
      max: 5000,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: true },
      { date: '2024-06-22', available: false },
    ],
    reviews: [
      {
        id: 'r1',
        clientName: 'Sarah Johnson',
        rating: 5,
        comment: 'Amazing photographer! Captured every moment perfectly.',
        date: '2024-01-10',
      },
    ],
    rating: 4.8,
    phone: '+1 (555) 111-2222',
    email: 'info@perfectmoments.com',
    location: 'New York, NY',
  },
  {
    id: 'sp2',
    name: 'Elite Videography',
    serviceType: 'videographer',
    description: 'Cinematic wedding and event videography',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
    ],
    pricing: {
      min: 2000,
      max: 6000,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: true },
    ],
    reviews: [],
    rating: 4.9,
    phone: '+1 (555) 222-3333',
    email: 'contact@elitevideo.com',
    location: 'Los Angeles, CA',
  },
  {
    id: 'sp3',
    name: 'Sky View Drones',
    serviceType: 'drone_operator',
    description: 'Aerial photography and videography for events',
    portfolio: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
    ],
    pricing: {
      min: 500,
      max: 1500,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: true },
    ],
    reviews: [],
    rating: 4.7,
    phone: '+1 (555) 333-4444',
    email: 'fly@skyviewdrones.com',
    location: 'Miami, FL',
  },
  {
    id: 'sp4',
    name: 'Gourmet Catering Co.',
    serviceType: 'caterer',
    description: 'Full-service catering for all types of events',
    portfolio: [
      'https://images.unsplash.com/photo-1555244162-803834f70033',
    ],
    pricing: {
      min: 3000,
      max: 15000,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: true },
    ],
    reviews: [
      {
        id: 'r2',
        clientName: 'Michael Chen',
        rating: 5,
        comment: 'Food was incredible! Guests loved everything.',
        date: '2024-01-05',
      },
    ],
    rating: 4.9,
    phone: '+1 (555) 444-5555',
    email: 'events@gourmetcatering.com',
    location: 'Chicago, IL',
  },
  {
    id: 'sp5',
    name: 'DJ Beats Entertainment',
    serviceType: 'dj',
    description: 'Professional DJ services for weddings and parties',
    portfolio: [],
    pricing: {
      min: 800,
      max: 2500,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: false },
    ],
    reviews: [],
    rating: 4.6,
    phone: '+1 (555) 555-6666',
    email: 'book@djbeats.com',
    location: 'Austin, TX',
  },
  {
    id: 'sp6',
    name: 'Elegant Decor Studio',
    serviceType: 'decorator',
    description: 'Custom event decoration and design services',
    portfolio: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    ],
    pricing: {
      min: 1000,
      max: 8000,
      currency: 'USD',
    },
    availability: [
      { date: '2024-06-15', available: true },
    ],
    reviews: [],
    rating: 4.8,
    phone: '+1 (555) 666-7777',
    email: 'design@elegantdecor.com',
    location: 'Seattle, WA',
  },
];

export const mockVenues: Venue[] = [
  {
    id: 'v1',
    name: 'Grand Ballroom Hotel',
    description: 'Elegant ballroom perfect for weddings and large celebrations',
    photos: [
      'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    ],
    capacity: 300,
    pricing: {
      perDay: 5000,
      currency: 'USD',
    },
    location: 'New York, NY',
    amenities: ['Parking', 'Catering Kitchen', 'Sound System', 'Stage', 'Bridal Suite'],
    availability: [
      { date: '2024-06-15', available: true },
      { date: '2024-06-22', available: false },
    ],
    bookings: [],
    rating: 4.7,
    reviews: [
      {
        id: 'rv1',
        clientName: 'Sarah Johnson',
        rating: 5,
        comment: 'Beautiful venue with excellent service!',
        date: '2024-01-08',
      },
    ],
  },
  {
    id: 'v2',
    name: 'Garden Paradise',
    description: 'Outdoor garden venue with stunning natural beauty',
    photos: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330',
    ],
    capacity: 150,
    pricing: {
      perDay: 3000,
      currency: 'USD',
    },
    location: 'Los Angeles, CA',
    amenities: ['Garden', 'Gazebo', 'Parking', 'Restrooms'],
    availability: [
      { date: '2024-06-15', available: true },
    ],
    bookings: [],
    rating: 4.9,
    reviews: [],
  },
  {
    id: 'v3',
    name: 'Skyline Rooftop',
    description: 'Modern rooftop venue with city views',
    photos: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    ],
    capacity: 100,
    pricing: {
      perHour: 500,
      currency: 'USD',
    },
    location: 'Chicago, IL',
    amenities: ['Bar', 'Lounge Area', 'City Views', 'Climate Control'],
    availability: [
      { date: '2024-06-15', available: false },
    ],
    bookings: [],
    rating: 4.8,
    reviews: [],
  },
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Sarah & John Wedding',
    type: 'wedding',
    clientId: '1',
    venueId: 'v1',
    date: '2024-06-15',
    startTime: '16:00',
    endTime: '23:00',
    guestCount: 200,
    budget: 25000,
    status: 'planning',
    assignedProviders: [
      { providerId: 'sp1', serviceType: 'photographer' },
      { providerId: 'sp4', serviceType: 'caterer' },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Send invitations',
        dueDate: '2024-05-01',
        completed: false,
      },
      {
        id: 't2',
        title: 'Finalize menu',
        dueDate: '2024-05-15',
        completed: false,
      },
    ],
    timeline: [
      {
        id: 'tl1',
        title: 'Ceremony',
        date: '2024-06-15',
        time: '16:00',
        description: 'Wedding ceremony',
      },
      {
        id: 'tl2',
        title: 'Reception',
        date: '2024-06-15',
        time: '18:00',
        description: 'Dinner and dancing',
      },
    ],
    notes: 'Outdoor ceremony weather permitting',
  },
  {
    id: 'e2',
    title: 'Michael\'s 40th Birthday',
    type: 'birthday',
    clientId: '2',
    venueId: 'v3',
    date: '2024-07-20',
    startTime: '19:00',
    endTime: '23:00',
    guestCount: 80,
    budget: 8000,
    status: 'confirmed',
    assignedProviders: [
      { providerId: 'sp5', serviceType: 'dj' },
    ],
    tasks: [],
    timeline: [],
  },
];
