
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const ClubLeaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { clubs, events, getClubMembers } = useApi();
  const navigate = useNavigate();

  // Get clubs led by the current user
  const userClubs = user ? clubs.filter(club => club.leaderId === user.id) : [];
  
  // Get events for the user's clubs
  const clubEvents = events.filter(event => 
    userClubs.some(club => club.id === event.clubId)
  );
  
  // Get pending events
  const pendingEvents = clubEvents.filter(event => event.status === 'pending');
  
  // Get upcoming approved events
  const upcomingEvents = clubEvents.filter(
    event => 
      event.status === 'approved' && 
      new Date(event.startDate) > new Date()
  );
  
  // Get club members count
  const getMemberCount = (clubId: string) => {
    return getClubMembers(clubId).length;
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Clubs</h2>
          <Button onClick={() => navigate('/manage-club')}>Manage Clubs</Button>
        </div>
        {userClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userClubs.map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>
                    {getMemberCount(club.id)} members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{club.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/manage-club/${club.id}`)}
                  >
                    Manage
                  </Button>
                  <Button 
                    onClick={() => navigate(`/manage-club/${club.id}/events/new`)}
                  >
                    Create Event
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You don't have any clubs yet.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/manage-club/new')}>Create Club</Button>
            </CardFooter>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Events</h2>
        {pendingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.startDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium">
                      Pending
                    </div>
                  </div>
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
                    onClick={() => navigate(`/manage-club/${event.clubId}/events/${event.id}`)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-muted-foreground">
                You don't have any pending events.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.startDate).toLocaleDateString()} at{' '}
                        {new Date(event.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </div>
                    <div className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
                      Approved
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{event.description}</p>
                  <p className="text-sm mt-2">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Created:</strong>{' '}
                    {formatDistanceToNow(new Date(event.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/manage-club/${event.clubId}/events/${event.id}`)}
                    className="w-full"
                  >
                    Manage Event
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-muted-foreground">
                You don't have any upcoming events.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default ClubLeaderDashboard;
