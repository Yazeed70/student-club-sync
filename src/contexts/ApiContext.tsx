
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  Club, Event, Membership, EventRegistration, Notification, Approval, Report,
  mockClubs, mockEvents, mockMemberships, mockEventRegistrations, mockNotifications, mockApprovals
} from '@/types';
import { useAuth } from './AuthContext';

interface ApiContextType {
  clubs: Club[];
  events: Event[];
  memberships: Membership[];
  eventRegistrations: EventRegistration[];
  notifications: Notification[];
  approvals: Approval[];
  reports: Report[];
  
  // Club methods
  getClub: (id: string) => Club | undefined;
  createClub: (club: Omit<Club, 'id' | 'createdAt'>) => Promise<boolean>;
  updateClub: (id: string, updates: Partial<Club>) => Promise<boolean>;
  
  // Event methods
  getEvent: (id: string) => Event | undefined;
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<boolean>;
  
  // Membership methods
  joinClub: (clubId: string) => Promise<boolean>;
  leaveClub: (clubId: string) => Promise<boolean>;
  getClubMembers: (clubId: string) => Membership[];
  getUserClubs: (userId: string) => Club[];
  isUserMember: (userId: string, clubId: string) => boolean;
  
  // Event registration methods
  registerForEvent: (eventId: string) => Promise<boolean>;
  unregisterFromEvent: (eventId: string) => Promise<boolean>;
  getEventAttendees: (eventId: string) => EventRegistration[];
  getUserEvents: (userId: string) => Event[];
  isUserRegistered: (userId: string, eventId: string) => boolean;
  
  // Notification methods
  getUserNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (id: string) => Promise<boolean>;
  createNotification: (userId: string, message: string) => Promise<boolean>;
  
  // Approval methods
  approveEvent: (eventId: string, comment?: string) => Promise<boolean>;
  rejectEvent: (eventId: string, comment?: string) => Promise<boolean>;
  getPendingEvents: () => Event[];
  
  // Report methods
  generateReport: (clubId: string, type: 'member' | 'event') => Promise<Report | null>;
  getClubReports: (clubId: string) => Report[];
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(mockEventRegistrations);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [reports, setReports] = useState<Report[]>([]);

  // Club methods
  const getClub = (id: string) => clubs.find(club => club.id === id);
  
  const createClub = async (club: Omit<Club, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newClub: Club = {
        ...club,
        id: `${clubs.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      
      setClubs([...clubs, newClub]);
      toast({
        title: 'Club created',
        description: `${newClub.name} has been created successfully`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to create club',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const updateClub = async (id: string, updates: Partial<Club>): Promise<boolean> => {
    try {
      const clubIndex = clubs.findIndex(club => club.id === id);
      if (clubIndex === -1) return false;
      
      const updatedClub = { ...clubs[clubIndex], ...updates };
      const newClubs = [...clubs];
      newClubs[clubIndex] = updatedClub;
      
      setClubs(newClubs);
      toast({
        title: 'Club updated',
        description: `${updatedClub.name} has been updated successfully`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to update club',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Event methods
  const getEvent = (id: string) => events.find(event => event.id === id);
  
  const createEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newEvent: Event = {
        ...event,
        id: `${events.length + 1}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        createdBy: user.id,
      };
      
      setEvents([...events, newEvent]);
      
      // Create approval request
      const newApproval: Approval = {
        id: `${approvals.length + 1}`,
        eventId: newEvent.id,
        status: 'pending',
      };
      
      setApprovals([...approvals, newApproval]);
      
      toast({
        title: 'Event created',
        description: `${newEvent.title} has been created and submitted for approval`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to create event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const updateEvent = async (id: string, updates: Partial<Event>): Promise<boolean> => {
    try {
      const eventIndex = events.findIndex(event => event.id === id);
      if (eventIndex === -1) return false;
      
      const updatedEvent = { ...events[eventIndex], ...updates };
      const newEvents = [...events];
      newEvents[eventIndex] = updatedEvent;
      
      setEvents(newEvents);
      toast({
        title: 'Event updated',
        description: `${updatedEvent.title} has been updated successfully`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to update event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Membership methods
  const joinClub = async (clubId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if user is already a member
      const existingMembership = memberships.find(
        m => m.userId === user.id && m.clubId === clubId
      );
      
      if (existingMembership) {
        toast({
          title: 'Already a member',
          description: 'You are already a member of this club',
          variant: 'destructive',
        });
        return false;
      }
      
      const club = getClub(clubId);
      if (!club) return false;
      
      const newMembership: Membership = {
        id: `${memberships.length + 1}`,
        userId: user.id,
        clubId,
        joinedAt: new Date().toISOString(),
      };
      
      setMemberships([...memberships, newMembership]);
      
      // Create notification
      createNotification(user.id, `You have successfully joined ${club.name}`);
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to join club',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const leaveClub = async (clubId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const membershipIndex = memberships.findIndex(
        m => m.userId === user.id && m.clubId === clubId
      );
      
      if (membershipIndex === -1) return false;
      
      const newMemberships = [...memberships];
      newMemberships.splice(membershipIndex, 1);
      
      setMemberships(newMemberships);
      
      const club = getClub(clubId);
      if (club) {
        createNotification(user.id, `You have left ${club.name}`);
      }
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to leave club',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const getClubMembers = (clubId: string) => 
    memberships.filter(m => m.clubId === clubId);
  
  const getUserClubs = (userId: string) => {
    const userMemberships = memberships.filter(m => m.userId === userId);
    return clubs.filter(club => 
      userMemberships.some(m => m.clubId === club.id) || club.leaderId === userId
    );
  };
  
  const isUserMember = (userId: string, clubId: string) =>
    memberships.some(m => m.userId === userId && m.clubId === clubId);

  // Event registration methods
  const registerForEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if user is already registered
      const existingRegistration = eventRegistrations.find(
        r => r.userId === user.id && r.eventId === eventId
      );
      
      if (existingRegistration) {
        toast({
          title: 'Already registered',
          description: 'You are already registered for this event',
          variant: 'destructive',
        });
        return false;
      }
      
      const event = getEvent(eventId);
      if (!event) return false;
      
      const newRegistration: EventRegistration = {
        id: `${eventRegistrations.length + 1}`,
        userId: user.id,
        eventId,
        registeredAt: new Date().toISOString(),
      };
      
      setEventRegistrations([...eventRegistrations, newRegistration]);
      
      // Create notification
      createNotification(user.id, `You have registered for ${event.title}`);
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to register for event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const unregisterFromEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const registrationIndex = eventRegistrations.findIndex(
        r => r.userId === user.id && r.eventId === eventId
      );
      
      if (registrationIndex === -1) return false;
      
      const newRegistrations = [...eventRegistrations];
      newRegistrations.splice(registrationIndex, 1);
      
      setEventRegistrations(newRegistrations);
      
      const event = getEvent(eventId);
      if (event) {
        createNotification(user.id, `You have unregistered from ${event.title}`);
      }
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to unregister from event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const getEventAttendees = (eventId: string) => 
    eventRegistrations.filter(r => r.eventId === eventId);
  
  const getUserEvents = (userId: string) => {
    const userRegistrations = eventRegistrations.filter(r => r.userId === userId);
    return events.filter(event => 
      userRegistrations.some(r => r.eventId === event.id) && event.status === 'approved'
    );
  };
  
  const isUserRegistered = (userId: string, eventId: string) =>
    eventRegistrations.some(r => r.userId === userId && r.eventId === eventId);

  // Notification methods
  const getUserNotifications = (userId: string) => 
    notifications.filter(n => n.userId === userId);
  
  const markNotificationAsRead = async (id: string): Promise<boolean> => {
    try {
      const notificationIndex = notifications.findIndex(n => n.id === id);
      if (notificationIndex === -1) return false;
      
      const updatedNotification = { ...notifications[notificationIndex], read: true };
      const newNotifications = [...notifications];
      newNotifications[notificationIndex] = updatedNotification;
      
      setNotifications(newNotifications);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const createNotification = async (userId: string, message: string): Promise<boolean> => {
    try {
      const newNotification: Notification = {
        id: `${notifications.length + 1}`,
        userId,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      
      setNotifications([...notifications, newNotification]);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Approval methods
  const approveEvent = async (eventId: string, comment?: string): Promise<boolean> => {
    if (!user || user.role !== 'administrator') return false;
    
    try {
      // Update approval
      const approvalIndex = approvals.findIndex(a => a.eventId === eventId);
      if (approvalIndex === -1) return false;
      
      const updatedApproval: Approval = {
        ...approvals[approvalIndex],
        status: 'approved',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
        comment: comment || 'Approved',
      };
      
      const newApprovals = [...approvals];
      newApprovals[approvalIndex] = updatedApproval;
      
      setApprovals(newApprovals);
      
      // Update event status
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) return false;
      
      const updatedEvent = { ...events[eventIndex], status: 'approved' as const };
      const newEvents = [...events];
      newEvents[eventIndex] = updatedEvent;
      
      setEvents(newEvents);
      
      // Notify event creator
      createNotification(updatedEvent.createdBy, `Your event ${updatedEvent.title} has been approved`);
      
      toast({
        title: 'Event approved',
        description: `${updatedEvent.title} has been approved successfully`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to approve event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const rejectEvent = async (eventId: string, comment?: string): Promise<boolean> => {
    if (!user || user.role !== 'administrator') return false;
    
    try {
      // Update approval
      const approvalIndex = approvals.findIndex(a => a.eventId === eventId);
      if (approvalIndex === -1) return false;
      
      const updatedApproval: Approval = {
        ...approvals[approvalIndex],
        status: 'rejected',
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
        comment: comment || 'Rejected',
      };
      
      const newApprovals = [...approvals];
      newApprovals[approvalIndex] = updatedApproval;
      
      setApprovals(newApprovals);
      
      // Update event status
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) return false;
      
      const updatedEvent = { ...events[eventIndex], status: 'rejected' as const };
      const newEvents = [...events];
      newEvents[eventIndex] = updatedEvent;
      
      setEvents(newEvents);
      
      // Notify event creator
      createNotification(updatedEvent.createdBy, `Your event ${updatedEvent.title} has been rejected`);
      
      toast({
        title: 'Event rejected',
        description: `${updatedEvent.title} has been rejected`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Failed to reject event',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const getPendingEvents = () => 
    events.filter(e => e.status === 'pending');

  // Report methods
  const generateReport = async (clubId: string, type: 'member' | 'event'): Promise<Report | null> => {
    if (!user || user.role !== 'administrator') return null;
    
    try {
      let data: any = {};
      const club = getClub(clubId);
      if (!club) return null;
      
      if (type === 'member') {
        const clubMembers = getClubMembers(clubId);
        data = {
          totalMembers: clubMembers.length,
          joinedThisMonth: clubMembers.filter(m => {
            const joinedDate = new Date(m.joinedAt);
            const now = new Date();
            return joinedDate.getMonth() === now.getMonth() && 
                   joinedDate.getFullYear() === now.getFullYear();
          }).length,
        };
      } else if (type === 'event') {
        const clubEvents = events.filter(e => e.clubId === clubId);
        const approvedEvents = clubEvents.filter(e => e.status === 'approved');
        const pendingEvents = clubEvents.filter(e => e.status === 'pending');
        const rejectedEvents = clubEvents.filter(e => e.status === 'rejected');
        
        data = {
          totalEvents: clubEvents.length,
          approvedEvents: approvedEvents.length,
          pendingEvents: pendingEvents.length,
          rejectedEvents: rejectedEvents.length,
          upcomingEvents: approvedEvents.filter(e => new Date(e.startDate) > new Date()).length,
        };
      }
      
      const newReport: Report = {
        id: `${reports.length + 1}`,
        clubId,
        type,
        data,
        generatedAt: new Date().toISOString(),
        generatedBy: user.id,
      };
      
      setReports([...reports, newReport]);
      
      toast({
        title: 'Report generated',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report for ${club.name} has been generated`,
      });
      
      return newReport;
    } catch (error) {
      toast({
        title: 'Failed to generate report',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const getClubReports = (clubId: string) => 
    reports.filter(r => r.clubId === clubId);

  return (
    <ApiContext.Provider
      value={{
        clubs,
        events,
        memberships,
        eventRegistrations,
        notifications,
        approvals,
        reports,
        getClub,
        createClub,
        updateClub,
        getEvent,
        createEvent,
        updateEvent,
        joinClub,
        leaveClub,
        getClubMembers,
        getUserClubs,
        isUserMember,
        registerForEvent,
        unregisterFromEvent,
        getEventAttendees,
        getUserEvents,
        isUserRegistered,
        getUserNotifications,
        markNotificationAsRead,
        createNotification,
        approveEvent,
        rejectEvent,
        getPendingEvents,
        generateReport,
        getClubReports,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
