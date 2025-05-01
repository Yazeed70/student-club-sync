
import { UserRole } from "@/contexts/AuthContext";

export interface Club {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  leaderId: string;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  createdBy: string;
}

export interface Membership {
  id: string;
  userId: string;
  clubId: string;
  joinedAt: string;
}

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Approval {
  id: string;
  eventId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}

export interface Report {
  id: string;
  clubId: string;
  type: 'member' | 'event';
  data: any;
  generatedAt: string;
  generatedBy: string;
}

// Mock data for initial state
export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Tech Society',
    description: 'A club for tech enthusiasts to learn and share knowledge about the latest technologies.',
    logo: 'https://via.placeholder.com/150',
    createdAt: '2023-01-15T10:30:00Z',
    leaderId: '2',
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'For students interested in photography, from beginners to experts.',
    logo: 'https://via.placeholder.com/150',
    createdAt: '2023-02-10T14:45:00Z',
    leaderId: '2',
  },
  {
    id: '3',
    name: 'Drama Club',
    description: 'Express yourself through acting and performance arts.',
    logo: 'https://via.placeholder.com/150',
    createdAt: '2023-03-05T09:15:00Z',
    leaderId: '2',
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    clubId: '1',
    title: 'Web Development Workshop',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    location: 'Computer Lab 101',
    startDate: '2023-08-20T13:00:00Z',
    endDate: '2023-08-20T15:00:00Z',
    status: 'approved',
    createdAt: '2023-08-01T10:30:00Z',
    createdBy: '2',
  },
  {
    id: '2',
    clubId: '2',
    title: 'Photography Exhibition',
    description: 'Annual exhibition showcasing student photography work.',
    location: 'Art Gallery',
    startDate: '2023-09-15T10:00:00Z',
    endDate: '2023-09-17T18:00:00Z',
    status: 'approved',
    createdAt: '2023-08-10T14:45:00Z',
    createdBy: '2',
  },
  {
    id: '3',
    clubId: '3',
    title: 'Auditions for Fall Play',
    description: 'Casting for the fall semester theatrical production.',
    location: 'Theater Room',
    startDate: '2023-08-25T16:00:00Z',
    endDate: '2023-08-25T19:00:00Z',
    status: 'pending',
    createdAt: '2023-08-15T09:15:00Z',
    createdBy: '2',
  },
];

export const mockMemberships: Membership[] = [
  {
    id: '1',
    userId: '1',
    clubId: '1',
    joinedAt: '2023-08-02T10:30:00Z',
  },
];

export const mockEventRegistrations: EventRegistration[] = [
  {
    id: '1',
    userId: '1',
    eventId: '1',
    registeredAt: '2023-08-05T15:30:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'You have successfully joined Tech Society',
    read: false,
    createdAt: '2023-08-02T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    message: 'You have registered for Web Development Workshop',
    read: false,
    createdAt: '2023-08-05T15:30:00Z',
  },
];

export const mockApprovals: Approval[] = [
  {
    id: '1',
    eventId: '1',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: '2023-08-03T11:45:00Z',
    comment: 'Approved',
  },
  {
    id: '2',
    eventId: '2',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: '2023-08-12T16:30:00Z',
    comment: 'Approved',
  },
  {
    id: '3',
    eventId: '3',
    status: 'pending',
  },
];
