
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import RoleStatusBadge from '@/components/RoleStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, Clock, MapPin, Users, User, Calendar, ArrowLeft, Check } from 'lucide-react';
import { Event, Club } from '@/types';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getEvent, 
    getClub, 
    registerForEvent, 
    unregisterFromEvent, 
    isUserRegistered,
    getEventAttendees
  } = useApi();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendees, setAttendees] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Get event details
      const fetchedEvent = getEvent(id);
      if (fetchedEvent) {
        setEvent(fetchedEvent);
        
        // Get associated club
        const fetchedClub = getClub(fetchedEvent.clubId);
        if (fetchedClub) {
          setClub(fetchedClub);
        }
        
        // Check if user is registered
        if (user) {
          setIsRegistered(isUserRegistered(user.id, id));
        }
        
        // Get attendees count
        const eventAttendees = getEventAttendees(id);
        setAttendees(eventAttendees.length);
      }
    }
  }, [id, user, getEvent, getClub, isUserRegistered, getEventAttendees]);

  const handleRegister = async () => {
    if (!user || !event) return;
    
    setLoading(true);
    try {
      const success = await registerForEvent(event.id);
      if (success) {
        setIsRegistered(true);
        setAttendees(prev => prev + 1);
        toast({
          title: "Success",
          description: `You have registered for ${event.title}`,
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;
    
    setLoading(true);
    try {
      const success = await unregisterFromEvent(event.id);
      if (success) {
        setIsRegistered(false);
        setAttendees(prev => prev - 1);
        toast({
          title: "Success",
          description: `You have unregistered from ${event.title}`,
        });
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!event || !club) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Event not found</h1>
          <p className="mt-4 text-muted-foreground">The event you are looking for does not exist.</p>
          <Button className="mt-6" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </Layout>
    );
  }

  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);
  const isPastEvent = eventDate < new Date();
  const isClubLeader = user && club.leaderId === user.id;
  const isAdmin = user?.role === 'administrator';
  const canRegister = event.status === 'approved' && !isPastEvent && !isAdmin;
  const atCapacity = event.capacity ? attendees >= event.capacity : false;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4" 
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Events
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Event Main Content */}
          <div className="md:w-2/3">
            {/* Event Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <RoleStatusBadge status={event.status} type="event" />
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => navigate(`/clubs/${club.id}`)}
                >
                  {club.name}
                </Badge>
                
                {isPastEvent ? (
                  <Badge variant="secondary">Past Event</Badge>
                ) : (
                  <Badge variant="secondary">Upcoming</Badge>
                )}
              </div>
            </div>
            
            {/* Event Image */}
            {event.image && (
              <div className="rounded-lg overflow-hidden mb-6 bg-muted">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {/* Event Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="whitespace-pre-line">{event.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {eventDate.toLocaleDateString(undefined, { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {eventDate.toLocaleTimeString(undefined, { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {eventEndDate.toLocaleTimeString(undefined, { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Attendees</div>
                      <div className="text-sm text-muted-foreground">
                        {attendees} {event.capacity ? `/ ${event.capacity}` : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Organized by</div>
                      <div 
                        className="text-sm text-primary hover:underline cursor-pointer"
                        onClick={() => navigate(`/clubs/${club.id}`)}
                      >
                        {club.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Event Sidebar */}
          <div className="md:w-1/3">
            <Card className="mb-6 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Event Registration</h2>
                
                {/* Registration Status */}
                {isRegistered && (
                  <div className="flex items-center gap-2 mb-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-400">You're registered for this event</span>
                  </div>
                )}
                
                {/* Capacity Indicator */}
                {event.capacity && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{attendees} registered</span>
                      <span>{event.capacity - attendees} spots left</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full"
                        style={{ width: `${(attendees / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Registration Button */}
                {!isAdmin && event.status === 'approved' && (
                  <div>
                    {!isPastEvent ? (
                      isRegistered ? (
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={handleUnregister}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Cancel Registration"}
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={handleRegister}
                          disabled={loading || atCapacity || !canRegister}
                        >
                          {loading ? "Processing..." : atCapacity ? "Event Full" : "Register for Event"}
                        </Button>
                      )
                    ) : (
                      <Button disabled className="w-full">
                        Event has ended
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Status Info */}
                {event.status !== 'approved' && (
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <h3 className="text-sm font-medium mb-1">Event Status</h3>
                    <div className="flex items-center mb-2">
                      <RoleStatusBadge status={event.status} type="event" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.status === 'pending' 
                        ? 'This event is awaiting approval from administrators.'
                        : 'This event has been rejected.'}
                    </p>
                  </div>
                )}
                
                {/* Club Info */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Organizer</h3>
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Avatar>
                      <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{club.name}</div>
                      <div className="text-xs text-muted-foreground">{club.category}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/clubs/${club.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
                
                {/* Management Options */}
                {(isClubLeader || isAdmin) && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium mb-3">Management Options</h3>
                    <div className="space-y-3">
                      {isClubLeader && (
                        <Button variant="outline" className="w-full">
                          Edit Event
                        </Button>
                      )}
                      {isAdmin && event.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="default" className="w-full">
                            Approve
                          </Button>
                          <Button variant="destructive" className="w-full">
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
