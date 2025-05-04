import { UserRole } from "@/contexts/AuthContext";

export interface Club {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  leaderId: string;
  category: string;
  status?: 'pending' | 'approved' | 'rejected';
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
  image?: string;
  capacity?: number;
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
    name: 'Technology Club',
    description: 'Explore cutting-edge tech trends, participate in hackathons, and develop practical skills through workshops and collaborative projects.',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-01-15T10:30:00Z',
    leaderId: '2',
    category: 'Technology',
    status: 'approved'
  },
  {
    id: '2',
    name: 'Cinema Club',
    description: 'For students passionate about filmmaking, cinematography, and film analysis. Organize screenings and discussions.',
    logo: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-02-10T14:45:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved'
  },
  {
    id: '3',
    name: 'Management and Leadership Club',
    description: 'Develop leadership skills through workshops, case studies, and guest speakers from industry leaders.',
    logo: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-03-05T09:15:00Z',
    leaderId: '2',
    category: 'Business',
    status: 'approved'
  },
  {
    id: '4',
    name: 'Scientific Advancement Club',
    description: 'Engage in scientific experiments, research projects, and discussions on the latest scientific breakthroughs.',
    logo: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4760?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-03-10T11:20:00Z',
    leaderId: '3',
    category: 'Science',
    status: 'approved'
  },
  {
    id: '5',
    name: 'Communication and Languages Club',
    description: 'Improve language skills through conversation practice, cultural exchanges, and language-focused activities.',
    logo: 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-04-15T13:40:00Z',
    leaderId: '4',
    category: 'Languages',
    status: 'approved'
  },
  {
    id: '6',
    name: 'Law Club',
    description: 'Study legal concepts, participate in mock trials, and explore legal implications of current events.',
    logo: 'https://images.unsplash.com/photo-1589994965851-a7f82d10cc1a?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-05-05T15:30:00Z',
    leaderId: '2',
    category: 'Law',
    status: 'approved'
  },
  {
    id: '7',
    name: 'Economics Club',
    description: 'Analyze economic trends, debate policies, and understand financial markets through discussions and projects.',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-06-12T10:45:00Z',
    leaderId: '3',
    category: 'Business',
    status: 'approved'
  },
  {
    id: '8',
    name: 'Skills Club',
    description: 'Develop practical skills across various disciplines through hands-on workshops and peer learning.',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-07-20T14:20:00Z',
    leaderId: '4',
    category: 'Personal Development',
    status: 'approved'
  },
  {
    id: '9',
    name: 'Creativity and Innovation Club',
    description: 'Foster creative thinking and innovative problem-solving through design challenges and collaborative projects.',
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-08-18T11:10:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved'
  },
  {
    id: '10',
    name: 'Media Club',
    description: 'Create digital content, learn multimedia production, and explore various media platforms and techniques.',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-09-07T09:50:00Z',
    leaderId: '3',
    category: 'Media',
    status: 'approved'
  },
  {
    id: '11',
    name: 'Entrepreneurship Club',
    description: 'Develop business plans, pitch ideas, and learn from successful entrepreneurs through networking events.',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-10-15T16:30:00Z',
    leaderId: '4',
    category: 'Business',
    status: 'approved'
  },
  {
    id: '12',
    name: 'Arabic Calligraphy Club',
    description: 'Learn the art of Arabic calligraphy through guided practice sessions and cultural appreciation.',
    logo: 'https://images.unsplash.com/photo-1588769356221-9a40b13066d4?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-11-22T13:15:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved'
  },
  {
    id: '13',
    name: 'Reading Club',
    description: 'Expand literary horizons through book discussions, author studies, and shared reading experiences.',
    logo: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=150&h=150&auto=format&fit=crop',
    createdAt: '2023-12-10T11:00:00Z',
    leaderId: '3',
    category: 'Literature',
    status: 'approved'
  }
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
