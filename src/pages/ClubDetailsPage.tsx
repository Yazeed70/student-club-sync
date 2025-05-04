
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import RoleStatusBadge from '@/components/RoleStatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, BookOpen, ArrowLeft, Clock, User } from 'lucide-react';
import { Club, Event, Membership } from '@/types';

const ClubDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getClub, joinClub, isUserMember, getClubMembers, getUserEvents } = useApi();
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Membership[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [leaderName, setLeaderName] = useState<string>('');
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (id) {
      // Get club details
      const fetchedClub = getClub(id);
      if (fetchedClub) {
        setClub(fetchedClub);
        
        // Check if user is a member
        if (user) {
          setIsMember(isUserMember(user.id, id));
        }
        
        // Get club members
        const clubMembers = getClubMembers(id);
        setMembers(clubMembers);
        
        // Get events related to this club
        const clubEvents = getUserEvents(fetchedClub.leaderId).filter(event => event.clubId === id);
        const now = new Date();
        
        // Split into upcoming and past events
        setUpcomingEvents(
          clubEvents.filter(event => new Date(event.startDate) > now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        );
        
        setPastEvents(
          clubEvents.filter(event => new Date(event.startDate) <= now)
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        );
        
        // Get leader name (in a real app, this would come from a user database)
        // For demo purposes, we'll use mock data
        setLeaderName(`User ${fetchedClub.leaderId}`);
      }
    }
  }, [id, user, getClub, isUserMember, getClubMembers, getUserEvents]);

  const handleJoinClub = async () => {
    if (!user || !club) return;
    
    setLoading(true);
    try {
      const success = await joinClub(club.id);
      if (success) {
        setIsMember(true);
        toast({
          title: club.status === 'approved' ? 'Request sent' : 'Club joined',
          description: club.status === 'approved' 
            ? 'Your request to join has been sent to the club leader' 
            : `You have successfully joined ${club.name}`,
        });
      }
    } catch (error) {
      console.error('Error joining club:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!club) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Club not found</h1>
          <p className="mt-4">The club you are looking for does not exist.</p>
          <Button className="mt-6" onClick={() => navigate('/clubs')}>
            Back to Clubs
          </Button>
        </div>
      </Layout>
    );
  }

  const isClubLeader = user && club.leaderId === user.id;
  const isAdmin = user?.role === 'administrator';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4" 
          onClick={() => navigate('/clubs')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Clubs
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Club Info */}
          <div className="md:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{club.name}</h1>
                  <RoleStatusBadge status={club.status} type="club" />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Badge variant="outline">{club.category}</Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> 
                    Led by {leaderName}
                  </span>
                </div>
              </div>
              
              {!isAdmin && !isClubLeader && !isMember && (
                <Button 
                  onClick={handleJoinClub} 
                  disabled={loading || club.status !== 'approved'}
                  className={club.status === 'approved' ? '' : 'opacity-50 cursor-not-allowed'}
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Join Club'
                  )}
                </Button>
              )}
              
              {isClubLeader && (
                <Button onClick={() => navigate(`/clubs/manage/${club.id}`)}>
                  Manage Club
                </Button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="about">
                  <BookOpen className="h-4 w-4 mr-2" />
                  About
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About {club.name}</CardTitle>
                    <CardDescription>Club description and details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{club.description}</p>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
                        <p className="mt-1">
                          {club.status === 'approved' ? 'Active' : club.status === 'pending' ? 'Pending Approval' : 'Inactive'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Created On</h4>
                        <p className="mt-1">{new Date(club.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Category</h4>
                        <p className="mt-1">{club.category}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Total Members</h4>
                        <p className="mt-1">{members.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Events</CardTitle>
                    <CardDescription>Upcoming and past events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upcoming Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
                      {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {upcomingEvents.map(event => (
                            <div 
                              key={event.id}
                              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="bg-accent p-4">
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.startDate).toLocaleDateString()} • 
                                  {new Date(event.startDate).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <div className="p-4">
                                <p className="text-sm mb-3 line-clamp-2">{event.description}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/events/${event.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No upcoming events.</p>
                      )}
                    </div>
                    
                    {/* Past Events */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Past Events</h3>
                      {pastEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {pastEvents.map(event => (
                            <div 
                              key={event.id}
                              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow opacity-75"
                            >
                              <div className="bg-muted p-4">
                                <h4 className="font-medium">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.startDate).toLocaleDateString()} • 
                                  {new Date(event.startDate).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <div className="p-4">
                                <p className="text-sm mb-3 line-clamp-2">{event.description}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/events/${event.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No past events.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Members</CardTitle>
                    <CardDescription>People who have joined this club</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {members.length > 0 ? (
                      <div className="space-y-4">
                        {members.map((member, index) => (
                          <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <Avatar>
                              <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.userId === club.leaderId ? 'Club Leader' : `Member ${index + 1}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Joined on {new Date(member.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">No members yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Club Sidebar */}
          <div className="md:w-1/3">
            {club.logo && (
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                    <img 
                      src={club.logo} 
                      alt={`${club.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Club Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Current status:</span>
                    <div className="flex items-center">
                      <RoleStatusBadge status={club.status} type="club" />
                      <span className="ml-2">
                        {club.status === 'approved' 
                          ? 'Active' 
                          : club.status === 'pending' 
                          ? 'Awaiting approval' 
                          : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  {club.status === 'pending' && (
                    <div className="text-sm text-muted-foreground">
                      <p>This club is currently under review by administrators.</p>
                    </div>
                  )}
                  
                  {club.status === 'rejected' && (
                    <div className="text-sm text-muted-foreground">
                      <p>This club has been rejected by administrators.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Club Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Members</span>
                    <span className="font-medium">{members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events</span>
                    <span className="font-medium">{upcomingEvents.length + pastEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="font-medium">{new Date(club.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              {isClubLeader && (
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/clubs/manage/${club.id}`)}
                  >
                    Manage Club
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubDetailsPage;
