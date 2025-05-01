
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const { clubs, events, approvals, getPendingEvents } = useApi();
  const navigate = useNavigate();

  // Get pending events
  const pendingEvents = getPendingEvents();

  // Get stats
  const totalClubs = clubs.length;
  const totalEvents = events.length;
  const approvedEvents = events.filter(event => event.status === 'approved').length;
  const rejectedEvents = events.filter(event => event.status === 'rejected').length;
  
  // Get upcoming approved events
  const upcomingEvents = events.filter(
    event => 
      event.status === 'approved' && 
      new Date(event.startDate) > new Date()
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalClubs}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalEvents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingEvents.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Approved Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{approvedEvents}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <Button onClick={() => navigate('/approvals')}>
            View All Approvals
          </Button>
        </div>
        {pendingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEvents.slice(0, 6).map((event) => {
              const clubName = clubs.find(club => club.id === event.clubId)?.name || 'Unknown Club';
              
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{clubName}</CardDescription>
                      </div>
                      <div className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium">
                        Pending
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{event.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Location:</strong> {event.location}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/approvals/${event.id}`)}
                      className="w-full"
                    >
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-muted-foreground">
                No events pending approval.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Club Management</h2>
          <Button onClick={() => navigate('/reports')}>Generate Reports</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Clubs Overview</CardTitle>
              <CardDescription>
                Manage and monitor all clubs on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total active clubs: {totalClubs}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/clubs')} className="w-full">
                View All Clubs
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Events Overview</CardTitle>
              <CardDescription>
                Track all events across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Upcoming approved events: {upcomingEvents.length}</p>
              <p>Total approved: {approvedEvents}</p>
              <p>Total rejected: {rejectedEvents}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/events')} className="w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
