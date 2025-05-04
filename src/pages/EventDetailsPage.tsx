
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Loader2, ArrowLeft } from 'lucide-react';
import { Event, Club } from '@/types';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEvent, getClub, isUserRegistered, registerForEvent, unregisterFromEvent, getEventAttendees } = useApi();
  
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  
  useEffect(() => {
    if (id) {
      const fetchedEvent = getEvent(id);
      if (fetchedEvent) {
        setEvent(fetchedEvent);
        const fetchedClub = getClub(fetchedEvent.clubId);
        setClub(fetchedClub || null);
        
        const attendees = getEventAttendees(fetchedEvent.id);
        setAttendeeCount(attendees.length);
      } else {
        navigate('/events');
      }
    }
  }, [id, getEvent, getClub, getEventAttendees, navigate]);

  const handleRegister = async () => {
    if (!event || !user) return;
    
    setLoading(true);
    const success = await registerForEvent(event.id);
    if (success) {
      setAttendeeCount(prev => prev + 1);
    }
    setLoading(false);
  };

  const handleUnregister = async () => {
    if (!event || !user) return;
    
    setLoading(true);
    const success = await unregisterFromEvent(event.id);
    if (success) {
      setAttendeeCount(prev => Math.max(0, prev - 1));
    }
    setLoading(false);
  };

  if (!event || !club) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const isRegistered = user ? isUserRegistered(user.id, event.id) : false;
  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);
  const isPastEvent = eventDate < new Date();
  const capacity = event.capacity || 100;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/events')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        
        {/* Event Header */}
        <div className="bg-accent/30 rounded-xl overflow-hidden mb-8">
          <div className="h-64 bg-primary/10 relative">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-16 w-16 text-primary/30" />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <Badge className="mb-2">{club.name}</Badge>
              <h1 className="text-3xl font-bold mb-1">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{eventDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {eventDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - {eventEndDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{attendeeCount} / {capacity} registered</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold mb-3">Event Description</h2>
                <p className="text-muted-foreground mb-4">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Badge variant={event.status === 'approved' ? 'outline' : event.status === 'pending' ? 'secondary' : 'destructive'}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                  
                  {event.status === 'pending' && (
                    <span className="text-sm text-muted-foreground">
                      This event is waiting for approval
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                <Card className="w-full md:w-60">
                  <CardHeader>
                    <CardTitle className="text-center">Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      {isPastEvent ? (
                        <Badge variant="secondary">Event has ended</Badge>
                      ) : attendeeCount >= capacity && !isRegistered ? (
                        <Badge variant="secondary">Event full</Badge>
                      ) : isRegistered ? (
                        <Badge className="bg-green-600">You're registered</Badge>
                      ) : (
                        <Badge variant="outline">{capacity - attendeeCount} spots left</Badge>
                      )}
                    </div>
                    
                    {!isPastEvent && (
                      isRegistered ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleUnregister}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Cancel Registration
                        </Button>
                      ) : (
                        <Button 
                          className="w-full btn-gradient"
                          onClick={handleRegister}
                          disabled={loading || attendeeCount >= capacity || event.status !== 'approved'}
                        >
                          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Register Now
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendees Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              Attendees ({attendeeCount} / {capacity})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[...Array(attendeeCount)].map((_, i) => (
                <Avatar key={i}>
                  <AvatarFallback>
                    {String.fromCharCode(65 + i % 26)}
                  </AvatarFallback>
                </Avatar>
              ))}
              
              {attendeeCount === 0 && (
                <p className="text-muted-foreground">
                  No one has registered for this event yet. Be the first!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
