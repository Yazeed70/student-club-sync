
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { EventsCalendar } from '@/components/EventsCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, Users } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserClubs, getUserEvents, getUserNotifications } = useApi();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const userClubs = user ? getUserClubs(user.id) : [];
  const userEvents = user ? getUserEvents(user.id) : [];
  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Student'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your clubs and events.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 relative">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Clubs</h2>
            <Button onClick={() => navigate('/clubs')}>Browse Clubs</Button>
          </div>
          {userClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userClubs.slice(0, 3).map((club) => (
                <Card key={club.id} className="overflow-hidden card-with-hover">
                  <div className="h-32 bg-gradient-secondary flex items-center justify-center">
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-4xl font-bold">
                        {club.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" onClick={() => navigate(`/clubs/${club.id}`)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-with-hover">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't joined any clubs yet.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate('/clubs')} className="btn-gradient">Browse Clubs</Button>
              </CardFooter>
            </Card>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button onClick={() => navigate('/events')}>All Events</Button>
          </div>
          {userEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userEvents
                .filter(event => new Date(event.startDate) > new Date())
                .slice(0, 3)
                .map((event) => (
                  <Card key={event.id} className="card-with-hover">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.startDate).toLocaleDateString()} at{' '}
                        {new Date(event.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2">{event.description}</p>
                      <p className="text-sm mt-2">
                        <strong>Location:</strong> {event.location}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="card-with-hover">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't registered for any upcoming events.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate('/events')} className="btn-gradient">Browse Events</Button>
              </CardFooter>
            </Card>
          )}
        </section>
      </TabsContent>

      <TabsContent value="events" className="mt-6">
        <EventsCalendar />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card className="card-with-hover">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Notifications
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive">{unreadNotifications.length} new</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 rounded-md ${
                      notification.read ? 'bg-accent dark:bg-accent/20' : 'bg-primary/10 dark:bg-primary/20'
                    } transform transition hover:-translate-y-0.5`}
                  >
                    <p className={`${!notification.read && 'font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                You have no notifications.
              </p>
            )}
          </CardContent>
          {notifications.length > 0 && (
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/notifications')} className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
    </div>
  );
};

export default StudentDashboard;
