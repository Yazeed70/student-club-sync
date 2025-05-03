
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'club_leader' | 'administrator';
  clubs: Club[];
  events: Event[];
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  members: User[];
  leaders: User[];
  events: Event[];
  joinRequests: User[];
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  logo?: string;
  leaderId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  club: Club;
  attendees: User[];
  image?: string;
  category?: string;
  capacity: number;
  clubId: string;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add these new interfaces for the mock data
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

// Update mock clubs data with the new clubs
export const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Cinema Club',
    description: 'A club for cinema enthusiasts to discuss films, organize screenings, and explore film history and criticism.',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=150&auto=format',
    createdAt: '2023-01-15T10:30:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Management and Leadership Club',
    description: 'Developing future leaders through workshops, seminars, and practical leadership experiences.',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=150&auto=format',
    createdAt: '2023-02-10T14:45:00Z',
    leaderId: '2',
    category: 'Business',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-02-10T14:45:00Z',
  },
  {
    id: '3',
    name: 'Scientific Advancement Club',
    description: 'Promoting scientific research, innovation and experimentation across various scientific disciplines.',
    logo: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=150&auto=format',
    createdAt: '2023-03-05T09:15:00Z',
    leaderId: '2',
    category: 'Science',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-03-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Communication and Languages Club',
    description: 'Enhancing language skills and cultural understanding through conversation practice and language exchange.',
    logo: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=150&auto=format',
    createdAt: '2023-03-10T11:30:00Z',
    leaderId: '2',
    category: 'Languages',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-03-10T11:30:00Z',
  },
  {
    id: '5',
    name: 'Law Club',
    description: 'Engaging with legal concepts through mock trials, debates, and discussions with legal professionals.',
    logo: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=150&auto=format',
    createdAt: '2023-04-15T10:00:00Z',
    leaderId: '2',
    category: 'Law',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-04-15T10:00:00Z',
  },
  {
    id: '6',
    name: 'Economics Club',
    description: 'Analyzing economic trends and theories through discussions, guest speakers, and research projects.',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=150&auto=format',
    createdAt: '2023-05-20T13:45:00Z',
    leaderId: '2',
    category: 'Business',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-05-20T13:45:00Z',
  },
  {
    id: '7',
    name: 'Technology Club',
    description: 'Exploring cutting-edge technologies through hands-on projects, hackathons, and tech talks.',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=150&auto=format',
    createdAt: '2023-06-05T09:30:00Z',
    leaderId: '2',
    category: 'Technology',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-06-05T09:30:00Z',
  },
  {
    id: '8',
    name: 'Skills Club',
    description: 'Developing practical skills like public speaking, time management, and critical thinking.',
    logo: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=150&auto=format',
    createdAt: '2023-07-12T14:15:00Z',
    leaderId: '2',
    category: 'Personal Development',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-07-12T14:15:00Z',
  },
  {
    id: '9',
    name: 'Creativity and Innovation Club',
    description: 'Fostering creative thinking and innovative solutions to real-world problems.',
    logo: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=150&auto=format',
    createdAt: '2023-08-18T11:00:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-08-18T11:00:00Z',
  },
  {
    id: '10',
    name: 'Media Club',
    description: 'Creating and analyzing media content across platforms including journalism, broadcasting, and social media.',
    logo: 'https://images.unsplash.com/photo-1548391350-968f58dedaed?q=80&w=150&auto=format',
    createdAt: '2023-09-22T16:30:00Z',
    leaderId: '2',
    category: 'Media',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-09-22T16:30:00Z',
  },
  {
    id: '11',
    name: 'Entrepreneurship Club',
    description: 'Supporting student entrepreneurs with resources, mentorship, and networking opportunities.',
    logo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=150&auto=format',
    createdAt: '2023-10-14T13:15:00Z',
    leaderId: '2',
    category: 'Business',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-10-14T13:15:00Z',
  },
  {
    id: '12',
    name: 'Arabic Calligraphy Club',
    description: 'Preserving and exploring the art of Arabic calligraphy through workshops and exhibitions.',
    logo: 'https://images.unsplash.com/photo-1561046749-5483ffcfac55?q=80&w=150&auto=format',
    createdAt: '2023-11-20T10:45:00Z',
    leaderId: '2',
    category: 'Arts',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-11-20T10:45:00Z',
  },
  {
    id: '13',
    name: 'Reading Club',
    description: 'Sharing a love of literature through book discussions, author events, and reading challenges.',
    logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=150&auto=format',
    createdAt: '2023-12-05T15:00:00Z',
    leaderId: '2',
    category: 'Literature',
    status: 'approved',
    members: [],
    leaders: [],
    events: [],
    joinRequests: [],
    updatedAt: '2023-12-05T15:00:00Z',
  }
];

// Modified events with more details
export const mockEvents: Event[] = [
  {
    id: '1',
    clubId: '1',
    title: 'Web Development Workshop',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    location: 'Computer Lab 101',
    date: '2023-08-20',
    time: '13:00',
    startDate: '2023-08-20T13:00:00Z',
    endDate: '2023-08-20T15:00:00Z',
    status: 'approved',
    createdAt: '2023-08-01T10:30:00Z',
    createdBy: '2',
    club: {} as Club,
    attendees: [],
    capacity: 50,
  },
  {
    id: '2',
    clubId: '2',
    title: 'Photography Exhibition',
    description: 'Annual exhibition showcasing student photography work.',
    location: 'Art Gallery',
    date: '2023-09-15',
    time: '10:00',
    startDate: '2023-09-15T10:00:00Z',
    endDate: '2023-09-17T18:00:00Z',
    status: 'approved',
    createdAt: '2023-08-10T14:45:00Z',
    createdBy: '2',
    club: {} as Club,
    attendees: [],
    capacity: 100,
  },
  {
    id: '3',
    clubId: '3',
    title: 'Auditions for Fall Play',
    description: 'Casting for the fall semester theatrical production.',
    location: 'Theater Room',
    date: '2023-08-25',
    time: '16:00',
    startDate: '2023-08-25T16:00:00Z',
    endDate: '2023-08-25T19:00:00Z',
    status: 'pending',
    createdAt: '2023-08-15T09:15:00Z',
    createdBy: '2',
    club: {} as Club,
    attendees: [],
    capacity: 30,
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
    updatedAt: '2023-08-02T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    message: 'You have registered for Web Development Workshop',
    read: false,
    createdAt: '2023-08-05T15:30:00Z',
    updatedAt: '2023-08-05T15:30:00Z',
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
