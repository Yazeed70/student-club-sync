
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Calendar, BookOpen, MapPin, Clock, Info } from 'lucide-react';
import { Club, Event } from '@/types';

const ClubDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getClub, getClubMembers, isUserMember, joinClub, leaveClub } = useApi();
  
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<Club | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [clubEvents, setClubEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (id) {
      const fetchedClub = getClub(id);
      if (fetchedClub) {
        setClub(fetchedClub);
        const members = getClubMembers(id);
        setMemberCount(members.length);
        
        // In a real app, you'd fetch events from API
        // This is just a placeholder
        setClubEvents([]);
      } else {
        navigate('/clubs');
      }
    }
  }, [id, getClub, getClubMembers, navigate]);

  const handleJoinClub = async () => {
    if (!club || !user) return;
    
    setLoading(true);
    const success = await joinClub(club.id);
    if (success) {
      setMemberCount(prev => prev + 1);
    }
    setLoading(false);
  };

  const handleLeaveClub = async () => {
    if (!club || !user) return;
    
    setLoading(true);
    const success = await leaveClub(club.id);
    if (success) {
      setMemberCount(prev => Math.max(0, prev - 1));
    }
    setLoading(false);
  };

  if (!club) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const isMember = user ? isUserMember(user.id, club.id) : false;
  const isClubLeader = user && club.leaderId === user.id;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Club Header */}
        <div className="bg-accent/30 rounded-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-28 w-28 md:h-36 md:w-36 bg-background rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{club.name}</h1>
                <Badge variant="outline" className="md:ml-2 w-fit mx-auto md:mx-0">
                  {club.category}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(club.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 max-w-3xl">{club.description}</p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isClubLeader ? (
                  <Button 
                    className="btn-gradient" 
                    onClick={() => navigate(`/clubs/manage/${club.id}`)}
                  >
                    Manage Club
                  </Button>
                ) : isMember ? (
                  <Button 
                    variant="outline" 
                    onClick={handleLeaveClub}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Leave Club
                  </Button>
                ) : (
                  <Button 
                    className="btn-gradient"
                    onClick={handleJoinClub}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Join Club
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => navigate('/clubs')}>
                  Back to Clubs
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Club Content */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
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
          
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {club.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p>{club.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Category</h3>
                    <p>{club.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Founded</h3>
                    <p>{new Date(club.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Club Events</h2>
              {isClubLeader && (
                <Button onClick={() => navigate(`/clubs/manage/${club.id}?tab=events`)}>
                  Create Event
                </Button>
              )}
            </div>
            
            {clubEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-accent">
                      {event.image ? (
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                          <Calendar className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.startDate).toLocaleDateString()}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm line-clamp-2 text-muted-foreground mt-2">
                        {event.description}
                      </p>
                    </CardContent>
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
                    This club hasn't created any events yet.
                  </p>
                  {isClubLeader && (
                    <Button onClick={() => navigate(`/clubs/manage/${club.id}?tab=events`)} className="mt-4">
                      Create First Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Club Members</CardTitle>
                <CardDescription>
                  {memberCount} member{memberCount !== 1 ? 's' : ''} in this club
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* This would be populated with actual member data from API */}
                  {[...Array(memberCount)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-accent/30">
                      <Avatar>
                        <AvatarFallback>
                          {String.fromCharCode(65 + i % 26)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Member {i + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClubDetailsPage;
