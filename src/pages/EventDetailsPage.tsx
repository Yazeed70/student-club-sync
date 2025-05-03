
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share, CalendarPlus, Eye, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { events, clubs, isUserRegistered, registerForEvent } = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Find the event with the given ID
  const event = events.find(e => e.id === id);
  
  // Find the club that organized this event
  const club = event ? clubs.find(c => c.id === event.clubId) : null;
  
  // Check if the user is registered for this event
  const isRegistered = user && event ? isUserRegistered(user.id, event.id) : false;
  
  // Handle event registration with loading state
  const handleRegisterForEvent = async () => {
    if (!user || !event) return;
    
    setLoading(true);
    await registerForEvent(event.id);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Registration successful!",
        description: `You've been registered for ${event.title}.`,
      });
    }, 600);
  };
  
  // Handle adding event to calendar
  const handleAddToCalendar = () => {
    toast({
      title: "Added to calendar",
      description: "This event has been added to your calendar.",
    });
  };
  
  // Handle sharing event
  const handleShareEvent = () => {
    toast({
      title: "Share link copied",
      description: "Event link has been copied to your clipboard.",
    });
  };
  
  if (!event) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Eye className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Navigation */}
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="flex items-center text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Events
            </Button>
            <div className="flex items-center text-muted-foreground">
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Event Details</span>
            </div>
          </div>
          
          {/* Event Header */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="h-64 bg-gradient-secondary relative">
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                  <Calendar className="h-20 w-20 text-white" />
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Event status badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/90">
                  {new Date(event.startDate) > new Date() ? "Upcoming" : "Past"}
                </Badge>
              </div>
              
              {/* Event details on the image */}
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <Link to={`/clubs/${event.clubId}`} className="flex items-center hover:underline">
                    <Users className="h-4 w-4 mr-2" />
                    {club?.name || "Unknown Club"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {isRegistered ? (
                <Button variant="secondary" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Registered
                </Button>
              ) : new Date(event.startDate) > new Date() ? (
                <Button 
                  onClick={handleRegisterForEvent} 
                  disabled={loading}
                  className="btn-gradient"
                >
                  {loading ? (
                    <>
                      <div className="spinner h-4 w-4 mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Register for Event
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Ended
                </Button>
              )}
              
              <Button variant="outline" onClick={handleAddToCalendar}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
            
            <Button variant="ghost" onClick={handleShareEvent}>
              <Share className="h-4 w-4 mr-2" />
              Share Event
            </Button>
          </div>
          
          {/* Event Details */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="col-span-2 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {event.description}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">What to Bring</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Student ID</li>
                          <li>Notebook and pen</li>
                          <li>Enthusiasm and interest!</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span>{new Date(event.startDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>2 hours</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{event.location}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capacity:</span>
                            <span>{event.capacity || "Unlimited"}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Organized By</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {club ? (
                            <Link to={`/clubs/${club.id}`} className="flex items-center space-x-3 hover:underline">
                              <Avatar>
                                <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{club.name}</p>
                                <p className="text-sm text-muted-foreground">Club</p>
                              </div>
                            </Link>
                          ) : (
                            <p className="text-muted-foreground">Unknown Club</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendees">
              <Card>
                <CardHeader>
                  <CardTitle>Attendee List</CardTitle>
                  <CardDescription>
                    People who have registered for this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Mock attendees */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent/50">
                        <Avatar>
                          <AvatarFallback>
                            {String.fromCharCode(64 + i)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">User {i}</p>
                          <p className="text-sm text-muted-foreground">Registered on {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-muted-foreground">
                      {isRegistered 
                        ? "You are registered for this event!"
                        : "Register to join these attendees."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discussion">
              <Card>
                <CardHeader>
                  <CardTitle>Event Discussion</CardTitle>
                  <CardDescription>
                    Chat with other attendees about this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {/* Mock comments */}
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Jane Doe</h4>
                          <span className="text-xs text-muted-foreground">3 hours ago</span>
                        </div>
                        <p className="text-sm mt-1">
                          Looking forward to this event! Will there be any refreshments provided?
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>AL</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Alice Lee</h4>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm mt-1">
                          Can't wait! Is there a specific dress code we should follow?
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment input */}
                  <div className="mt-6">
                    <form className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                      />
                      <Button>Post</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
