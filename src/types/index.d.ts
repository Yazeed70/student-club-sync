
export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  capacity?: number;
  status: 'pending' | 'approved' | 'rejected';
  image?: string;
}
