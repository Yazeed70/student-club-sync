
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserClubs, getUserEvents, getUserNotifications } = useApi();
  const navigate = useNavigate();

  const userClubs = user ? getUserClubs(user.id) : [];
  const userEvents = user ? getUserEvents(user.id) : [];
  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Clubs</h2>
          <Button onClick={() => navigate('/clubs')}>Browse Clubs</Button>
        </div>
        {userClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userClubs.slice(0, 3).map((club) => (
              <Card key={club.id} className="overflow-hidden">
                <div className="h-32 bg-navy-100 flex items-center justify-center">
                  {club.logo ? (
                    <img
                      src={club.logo}
                      alt={`${club.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-navy-500 text-4xl font-bold">
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
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't joined any clubs yet.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/clubs')}>Browse Clubs</Button>
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
                <Card key={event.id}>
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
                    <Button variant="outline" onClick={() => navigate(`/events/${event.id}`)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't registered for any upcoming events.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/events')}>Browse Events</Button>
            </CardFooter>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Notifications
              {unreadNotifications.length > 0 && (
                <Badge>{unreadNotifications.length} new</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-3 rounded-md ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
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
              <p className="text-center text-muted-foreground">
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
      </section>
    </div>
  );
};

export default StudentDashboard;
