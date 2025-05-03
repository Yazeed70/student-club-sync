
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from '@/components/SearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventsCalendar } from '@/components/EventsCalendar';
import { SkeletonCard, SkeletonEventList } from '@/components/SkeletonCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubs, events, isUserRegistered, registerForEvent } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'registered' | 'not-registered'>('all');
  
  // Filter only approved events
  const approvedEvents = events.filter(event => event.status === 'approved');
  
  // Calculate upcoming events
  const upcomingEvents = approvedEvents.filter(event => new Date(event.startDate) > new Date());
  
  // Calculate past events
  const pastEvents = approvedEvents.filter(event => new Date(event.startDate) <= new Date());
  
  // Check if user is administrator
  const isAdmin = user?.role === 'administrator';
  
  // Filter events based on search term and filters
  const filterEvents = (eventsToFilter: typeof events) => {
    const filtered = eventsToFilter.filter(
      (event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getClubName(event.clubId).toLowerCase().includes(searchTerm.toLowerCase());
          
        if (filter === 'all') return matchesSearch;
        if (filter === 'registered') return matchesSearch && user && isUserRegistered(user.id, event.id);
        if (filter === 'not-registered') return matchesSearch && user && !isUserRegistered(user.id, event.id);
        
        return matchesSearch;
      }
    );
    
    return filtered;
  };
  
  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);

  // Get club name by club ID
  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };

  // Handle register for event with loading state
  const handleRegisterForEvent = async (eventId: string) => {
    setLoading(true);
    if (user && !isAdmin) {
      await registerForEvent(eventId);
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Discover and register for upcoming events</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <SearchBar 
              placeholder="Search events..." 
              onSearch={setSearchTerm} 
              className="w-full sm:w-64"
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Events
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('registered')}>
                    Registered Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('not-registered')}>
                    Not Registered
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <Calendar className="h-4 w-4" />
                <span className="sr-only">List View</span>
              </Button>
              <Button 
                variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Calendar View</span>
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <Tabs defaultValue="upcoming" className="mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {loading ? (
                <SkeletonEventList />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredUpcomingEvents.length > 0 ? (
                    filteredUpcomingEvents.map((event) => {
                      const isRegistered = user ? isUserRegistered(user.id, event.id) : false;
                      
                      return (
                        <Card key={event.id} className="card-with-hover">
                          <div className="h-40 bg-gradient-secondary relative">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                                <Calendar className="h-12 w-12 text-white" />
                              </div>
                            )}
                            <Badge className="absolute top-3 right-3 bg-primary/80">
                              {new Date(event.startDate).toLocaleDateString()}
                            </Badge>
                          </div>
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              by {getClubName(event.clubId)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-2">{event.description}</p>
                            <p className="text-sm mt-2">
                              <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} at{' '}
                              {new Date(event.startDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p className="text-sm mt-1">
                              <strong>Location:</strong> {event.location}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between gap-2">
                            <Button variant="outline" asChild className="flex-1">
                              <Link to={`/events/${event.id}`}>View Details</Link>
                            </Button>
                            
                            {isAdmin ? (
                              <Button variant="secondary" disabled className="flex-1">
                                Admin View Only
                              </Button>
                            ) : isRegistered ? (
                              <Button variant="secondary" disabled className="flex-1">
                                Registered
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleRegisterForEvent(event.id)} 
                                className="flex-1 btn-gradient"
                              >
                                Register
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        No upcoming events match your search criteria.
                      </p>
                      <Button 
                        onClick={() => {setSearchTerm(''); setFilter('all')}} 
                        variant="outline" 
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredPastEvents.length > 0 ? (
                  filteredPastEvents.map((event) => (
                    <Card key={event.id} className="card-with-hover opacity-80 hover:opacity-100">
                      <div className="h-40 bg-muted relative grayscale hover:grayscale-0 transition-all duration-300">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                            <Calendar className="h-12 w-12 text-white" />
                          </div>
                        )}
                        <Badge variant="outline" className="absolute top-3 right-3">
                          {new Date(event.startDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          by {getClubName(event.clubId)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">{event.description}</p>
                        <p className="text-sm mt-2">
                          <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} at{' '}
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Location:</strong> {event.location}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      No past events match your search criteria.
                    </p>
                    <Button 
                      onClick={() => {setSearchTerm(''); setFilter('all')}} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <EventsCalendar />
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
