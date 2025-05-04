
// Import all types and mock data here
import { ReactNode } from 'react';

// Status types
export type StatusType = 'approved' | 'pending' | 'rejected';

// Club type
export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  leaderId: string;
  status: StatusType;
  createdAt: string;
}

// Event type
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  clubId: string;
  image?: string;
  status: StatusType;
  createdAt: string;
  createdBy: string;
  capacity?: number;
}

// Membership type
export interface Membership {
  id: string;
  userId: string;
  clubId: string;
  joinedAt: string;
}

// Event Registration type
export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
}

// Notification type
export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Approval type
export interface Approval {
  id: string;
  eventId: string;
  status: StatusType;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}

// Report type
export interface Report {
  id: string;
  clubId: string;
  type: 'member' | 'event';
  data: any;
  generatedAt: string;
  generatedBy: string;
}

// Mock data
export const mockClubs: Club[] = [
  {
    id: "1",
    name: "Cinema Club",
    description: "Explore the world of cinema through screenings, discussions, and film production activities.",
    category: "Arts & Culture",
    logo: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Management and Leadership Club",
    description: "Develop leadership skills and management techniques through workshops and mentorship programs.",
    category: "Business",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "approved",
    createdAt: "2023-10-02T11:30:00Z"
  },
  {
    id: "3",
    name: "Scientific Advancement Club",
    description: "Explore scientific discoveries and conduct experiments across various fields of science.",
    category: "Science",
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-03T09:15:00Z"
  },
  {
    id: "4",
    name: "Communication and Languages Club",
    description: "Practice and improve language skills through conversation, writing, and cultural exchange.",
    category: "Languages",
    logo: "https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "approved",
    createdAt: "2023-10-04T14:45:00Z"
  },
  {
    id: "5",
    name: "Law Club",
    description: "Discuss legal concepts, participate in mock trials, and explore the field of law.",
    category: "Law",
    logo: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-05T16:30:00Z"
  },
  {
    id: "6",
    name: "Economics Club",
    description: "Analyze economic theories and current events through discussions and guest speakers.",
    category: "Business",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "approved",
    createdAt: "2023-10-06T13:20:00Z"
  },
  {
    id: "7",
    name: "Technology Club",
    description: "Explore new technologies, coding, and digital innovation through projects and workshops.",
    category: "Technology",
    logo: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-07T11:00:00Z"
  },
  {
    id: "8",
    name: "Skills Club",
    description: "Develop practical life skills through hands-on workshops and training sessions.",
    category: "Skills",
    logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "pending",
    createdAt: "2023-10-08T10:45:00Z"
  },
  {
    id: "9",
    name: "Creativity and Innovation Club",
    description: "Foster creative thinking and innovative solutions to modern challenges.",
    category: "Arts & Innovation",
    logo: "https://images.unsplash.com/photo-1459499362902-55a20553e082?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "pending",
    createdAt: "2023-10-09T15:30:00Z"
  },
  {
    id: "10",
    name: "Media Club",
    description: "Explore various forms of media including journalism, photography, and digital content creation.",
    category: "Media & Communications",
    logo: "https://images.unsplash.com/photo-1534856966153-c86d43d9d0e1?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "rejected",
    createdAt: "2023-10-10T09:00:00Z"
  },
  {
    id: "11",
    name: "Entrepreneurship Club",
    description: "Develop business plans and entrepreneurial skills through mentorship and competitions.",
    category: "Business",
    logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-11T12:15:00Z"
  },
  {
    id: "12",
    name: "Arabic Calligraphy Club",
    description: "Learn and practice the beautiful art of Arabic calligraphy.",
    category: "Arts & Culture",
    logo: "https://images.unsplash.com/photo-1528459801416-a9241982e8c4?q=80&w=1000&auto=format&fit=crop",
    leaderId: "2",
    status: "approved",
    createdAt: "2023-10-12T14:00:00Z"
  },
  {
    id: "13",
    name: "Reading Club",
    description: "Share and discuss books across various genres and topics.",
    category: "Literature",
    logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1000&auto=format&fit=crop",
    leaderId: "1",
    status: "approved",
    createdAt: "2023-10-13T16:45:00Z"
  }
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Film Festival",
    description: "A weekend showcasing student films and discussions with industry professionals.",
    location: "Main Auditorium",
    startDate: "2024-06-15T18:00:00Z",
    endDate: "2024-06-17T22:00:00Z",
    clubId: "1", // Cinema Club
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
    status: "approved",
    createdAt: "2023-11-01T08:30:00Z",
    createdBy: "1",
    capacity: 200
  },
  {
    id: "2",
    title: "Leadership Workshop",
    description: "Learn essential leadership skills from industry experts.",
    location: "Conference Room B",
    startDate: "2024-06-20T14:00:00Z",
    endDate: "2024-06-20T17:00:00Z",
    clubId: "2", // Management and Leadership Club
    image: "https://images.unsplash.com/photo-1546953304-5d96f43c2e94?q=80&w=1000&auto=format&fit=crop",
    status: "approved",
    createdAt: "2023-11-05T10:45:00Z",
    createdBy: "2",
    capacity: 50
  },
  {
    id: "3",
    title: "Science Fair",
    description: "Showcase your scientific projects and compete for prizes.",
    location: "Science Building",
    startDate: "2024-06-25T09:00:00Z",
    endDate: "2024-06-25T18:00:00Z",
    clubId: "3", // Scientific Advancement Club
    image: "https://images.unsplash.com/photo-1563207153-f403bf289096?q=80&w=1000&auto=format&fit=crop",
    status: "pending",
    createdAt: "2023-11-10T09:15:00Z",
    createdBy: "1",
    capacity: 100
  },
  {
    id: "4",
    title: "Language Exchange",
    description: "Practice different languages with native speakers.",
    location: "Student Center",
    startDate: "2024-06-22T16:00:00Z",
    endDate: "2024-06-22T19:00:00Z",
    clubId: "4", // Communication and Languages Club
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1000&auto=format&fit=crop",
    status: "approved",
    createdAt: "2023-11-15T13:20:00Z",
    createdBy: "2",
    capacity: 40
  }
];

// Mock memberships data
export const mockMemberships: Membership[] = [
  {
    id: "1",
    userId: "1",
    clubId: "1", // Cinema Club
    joinedAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    userId: "2",
    clubId: "2", // Management and Leadership Club
    joinedAt: "2023-10-16T14:45:00Z"
  },
  {
    id: "3",
    userId: "1",
    clubId: "3", // Scientific Advancement Club
    joinedAt: "2023-10-17T09:20:00Z"
  },
  {
    id: "4",
    userId: "2",
    clubId: "4", // Communication and Languages Club
    joinedAt: "2023-10-18T16:15:00Z"
  }
];

// Mock event registrations data
export const mockEventRegistrations: EventRegistration[] = [
  {
    id: "1",
    userId: "1",
    eventId: "1", // Annual Film Festival
    registeredAt: "2023-11-20T11:30:00Z"
  },
  {
    id: "2",
    userId: "2",
    eventId: "2", // Leadership Workshop
    registeredAt: "2023-11-22T15:45:00Z"
  },
  {
    id: "3",
    userId: "1",
    eventId: "4", // Language Exchange
    registeredAt: "2023-11-25T10:15:00Z"
  }
];

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    message: "Your club 'Cinema Club' has been approved!",
    read: false,
    createdAt: "2023-10-05T09:30:00Z"
  },
  {
    id: "2",
    userId: "2",
    message: "Your club 'Management and Leadership Club' has been approved!",
    read: true,
    createdAt: "2023-10-06T14:15:00Z"
  },
  {
    id: "3",
    userId: "1",
    message: "Your event 'Annual Film Festival' has been approved!",
    read: false,
    createdAt: "2023-11-05T10:45:00Z"
  },
  {
    id: "4",
    userId: "3", // Admin user
    message: "New club 'Creativity and Innovation Club' requires your approval",
    read: false,
    createdAt: "2023-10-10T08:30:00Z"
  }
];

// Mock approvals data
export const mockApprovals: Approval[] = [
  {
    id: "1",
    eventId: "1",
    status: "approved",
    reviewedBy: "3", // Admin user
    reviewedAt: "2023-11-03T11:30:00Z",
    comment: "Approved"
  },
  {
    id: "2",
    eventId: "2",
    status: "approved",
    reviewedBy: "3", // Admin user
    reviewedAt: "2023-11-08T14:45:00Z",
    comment: "Approved"
  },
  {
    id: "3",
    eventId: "3",
    status: "pending"
  },
  {
    id: "4",
    eventId: "4",
    status: "approved",
    reviewedBy: "3", // Admin user
    reviewedAt: "2023-11-17T09:30:00Z",
    comment: "Approved"
  }
];
