
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SearchBar } from '@/components/SearchBar';

const ApprovalsPage = () => {
  const { user } = useAuth();
  const { clubs, events } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock pending approvals data
  const pendingClubs = clubs.filter(club => club.status === 'pending').filter(
    club => club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pendingEvents = events.filter(event => event.status === 'pending').filter(
    event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mock users requesting approvals
  const pendingUsers = [
    { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'club_leader', clubId: '101', requestDate: '2023-06-10' },
    { id: '2', name: 'John Davis', email: 'john.davis@example.com', role: 'club_leader', clubId: '102', requestDate: '2023-06-12' },
  ].filter(
    user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (type: string, id: string) => {
    toast({
      title: "Approved",
      description: `The ${type} has been approved successfully.`,
    });
  };

  const handleReject = (type: string, id: string) => {
    toast({
      title: "Rejected",
      description: `The ${type} has been rejected.`,
    });
  };

  if (user?.role !== 'administrator') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Approvals</h1>
            <p className="text-muted-foreground">Review and manage pending approval requests</p>
          </div>
          <SearchBar 
            placeholder="Search approvals..." 
            onSearch={setSearchTerm}
            className="w-full md:w-64"
          />
        </div>
        
        <Tabs defaultValue="clubs" className="mb-6">
          <TabsList>
            <TabsTrigger value="clubs">
              Clubs
              {pendingClubs.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingClubs.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="events">
              Events
              {pendingEvents.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingEvents.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">
              Users
              {pendingUsers.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingUsers.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clubs">
            {pendingClubs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {pendingClubs.map((club) => (
                  <Card key={club.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>{club.name}</CardTitle>
                          <CardDescription>
                            Request submitted on {new Date().toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge>New Club</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium mb-1">Description</h3>
                          <p className="text-sm text-muted-foreground">{club.description}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Requested By</h3>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>RL</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">Robert Lee</p>
                              <p className="text-xs text-muted-foreground">Club Leader</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject('club', club.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove('club', club.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Check className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pending club approvals.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events">
            {pendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {pendingEvents.map((event) => (
                  <Card key={event.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>
                            Scheduled for {new Date(event.startDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Event</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium mb-1">Description</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <h3 className="text-sm font-medium mt-4 mb-1">Location</h3>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Organizing Club</h3>
                          <p className="text-sm text-muted-foreground">
                            {clubs.find(club => club.id === event.clubId)?.name || 'Unknown Club'}
                          </p>
                          <h3 className="text-sm font-medium mt-4 mb-1">Capacity</h3>
                          <p className="text-sm text-muted-foreground">{event.capacity || 'Unlimited'}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject('event', event.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove('event', event.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Check className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pending event approvals.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users">
            {pendingUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {pendingUsers.map((pendingUser) => (
                  <Card key={pendingUser.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <CardTitle>{pendingUser.name}</CardTitle>
                          <CardDescription>{pendingUser.email}</CardDescription>
                        </div>
                        <Badge variant="secondary">Role Request</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Requested Role</h3>
                          <Badge variant="outline" className="text-sm">
                            {pendingUser.role === 'club_leader' ? 'Club Leader' : 'Administrator'}
                          </Badge>
                          
                          <h3 className="text-sm font-medium mt-4 mb-1">Request Date</h3>
                          <p className="text-sm text-muted-foreground">{pendingUser.requestDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Associated Club</h3>
                          <p className="text-sm text-muted-foreground">
                            {clubs.find(club => club.id === pendingUser.clubId)?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject('user role request', pendingUser.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove('user role request', pendingUser.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Check className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pending user role requests.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ApprovalsPage;
