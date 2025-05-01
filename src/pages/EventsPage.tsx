
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubs, events, isUserRegistered, registerForEvent } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter only approved events
  const approvedEvents = events.filter(event => event.status === 'approved');
  
  // Calculate upcoming events
  const upcomingEvents = approvedEvents.filter(event => new Date(event.startDate) > new Date());
  
  // Calculate past events
  const pastEvents = approvedEvents.filter(event => new Date(event.startDate) <= new Date());
  
  // Filter events based on search term
  const filterEvents = (eventsToFilter: typeof events) => {
    return eventsToFilter.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getClubName(event.clubId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);

  // Get club name by club ID
  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };

  // Handle register for event
  const handleRegisterForEvent = async (eventId: string) => {
    if (user) {
      await registerForEvent(eventId);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Events</h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Events tabs */}
        <Tabs defaultValue="upcoming" className="mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map((event) => {
                  const isRegistered = user ? isUserRegistered(user.id, event.id) : false;
                  
                  return (
                    <Card key={event.id}>
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
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                        
                        {isRegistered ? (
                          <Button variant="secondary" disabled>
                            Registered
                          </Button>
                        ) : (
                          <Button onClick={() => handleRegisterForEvent(event.id)}>
                            Register
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">
                    No upcoming events match your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map((event) => (
                  <Card key={event.id}>
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
                  <p className="text-muted-foreground">
                    No past events match your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventsPage;
