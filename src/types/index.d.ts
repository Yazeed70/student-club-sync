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
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
