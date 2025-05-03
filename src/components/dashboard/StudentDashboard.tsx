
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
import { Bell, Calendar, Users, Book, ArrowRight, Plus, BookOpen } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserClubs, getUserEvents, getUserNotifications } = useApi();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const userClubs = user ? getUserClubs(user.id) : [];
  const userEvents = user ? getUserEvents(user.id) : [];
  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadNotifications = notifications.filter(n => !n.read);

  // Filter upcoming events
  const upcomingEvents = userEvents
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome, {user?.username || 'Student'}
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore clubs, find events, and connect with your campus community.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => navigate('/clubs')} className="btn-gradient">
                Explore Clubs
              </Button>
              <Button variant="outline" onClick={() => navigate('/events')}>
                Browse Events
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8 lg:p-10 bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-3xl font-bold">{userClubs.length}</div>
            <div className="text-sm text-muted-foreground">Clubs Joined</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{userEvents.length}</div>
            <div className="text-sm text-muted-foreground">Events Registered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{upcomingEvents.length}</div>
            <div className="text-sm text-muted-foreground">Upcoming Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{unreadNotifications.length}</div>
            <div className="text-sm text-muted-foreground">New Notifications</div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
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

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* My Clubs Section */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">My Clubs</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/clubs')}>
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              {userClubs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userClubs.slice(0, 4).map((club) => (
                    <Card key={club.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="h-16 w-16 bg-secondary flex-shrink-0">
                          {club.logo ? (
                            <img
                              src={club.logo}
                              alt={`${club.name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-accent">
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium line-clamp-1">{club.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{club.category}</p>
                        </div>
                        <div className="pr-3">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => navigate(`/clubs/${club.id}`)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 pb-4 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      You haven't joined any clubs yet.
                    </p>
                    <Button onClick={() => navigate('/clubs')} className="btn-gradient mt-4">
                      <Plus className="h-4 w-4 mr-1" /> Join Clubs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Quick Links */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Book className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Quick Links</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/profile')}
                    >
                      My Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/clubs')}
                    >
                      Browse All Clubs
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/events')}
                    >
                      Upcoming Events
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/notifications')}
                    >
                      Notifications
                      {unreadNotifications.length > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {unreadNotifications.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base line-clamp-1">{event.title}</CardTitle>
                        <Badge variant="outline">{new Date(event.startDate).toLocaleDateString()}</Badge>
                      </div>
                      <CardDescription className="line-clamp-1">
                        {event.location} • {new Date(event.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm line-clamp-2">{event.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-4 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    You haven't registered for any upcoming events.
                  </p>
                  <Button onClick={() => navigate('/events')} className="btn-gradient mt-4">
                    <Plus className="h-4 w-4 mr-1" /> Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Events Calendar</CardTitle>
              <CardDescription>
                View and manage all your registered events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Notifications
                {unreadNotifications.length > 0 && (
                  <Badge variant="destructive">{unreadNotifications.length} new</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with the latest activities
              </CardDescription>
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
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    You have no notifications.
                  </p>
                </div>
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
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
