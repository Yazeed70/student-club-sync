
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Users, Check, X, FileText, Clock, MapPin, BookOpen } from 'lucide-react';

const ApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getPendingEvents, approveEvent, rejectEvent, getPendingClubs, approveClub, rejectClub } = useApi();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  // Protect this page for administrators only
  if (!user || user.role !== 'administrator') {
    navigate('/');
    return null;
  }

  const pendingEvents = getPendingEvents();
  const pendingClubs = getPendingClubs();

  const handleApproveEvent = async (eventId: string) => {
    await approveEvent(eventId, comment);
    setComment('');
  };

  const handleRejectEvent = async (eventId: string) => {
    await rejectEvent(eventId, comment);
    setComment('');
  };

  const handleApproveClub = async (clubId: string) => {
    await approveClub(clubId);
  };

  const handleRejectClub = async (clubId: string) => {
    await rejectClub(clubId);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Approval Dashboard</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Events ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Clubs ({pendingClubs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Events</span>
                  <Badge variant="outline" className="ml-2">
                    {pendingEvents.length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    <p className="mt-3 text-muted-foreground">No pending events to approve</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-accent/20">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold">{event.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline">
                                  Club ID: {event.clubId}
                                </Badge>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(event.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(event.startDate).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                              <p className="mt-2 text-muted-foreground">
                                {event.description}
                              </p>
                              {event.capacity && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <strong>Capacity:</strong> {event.capacity} attendees
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-row md:flex-col gap-2">
                              <span className="text-xs text-muted-foreground">
                                Created: {new Date(event.createdAt).toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                By: {event.createdBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-4">
                            <label htmlFor={`comment-${event.id}`} className="block text-sm font-medium mb-1">
                              Comment (optional)
                            </label>
                            <Textarea 
                              id={`comment-${event.id}`}
                              placeholder="Add a comment about your decision..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={2}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRejectEvent(event.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => handleApproveEvent(event.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Clubs</span>
                  <Badge variant="outline" className="ml-2">
                    {pendingClubs.length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingClubs.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    <p className="mt-3 text-muted-foreground">No pending clubs to approve</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {pendingClubs.map((club) => (
                      <div key={club.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-accent/20">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-12 w-12 rounded-md overflow-hidden">
                                  {club.logo ? (
                                    <img 
                                      src={club.logo} 
                                      alt={`${club.name} logo`} 
                                      className="h-full w-full object-cover" 
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                      <BookOpen className="h-6 w-6 text-primary/50" />
                                    </div>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold">{club.name}</h3>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline">
                                  {club.category}
                                </Badge>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Created by User ID: {club.leaderId}
                                </div>
                              </div>
                              <p className="mt-2 text-muted-foreground">
                                {club.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-row md:flex-col gap-2">
                              <span className="text-xs text-muted-foreground">
                                Created: {new Date(club.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            <strong>Note:</strong> Approving this club will grant the club creator club leader privileges.
                          </p>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRejectClub(club.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => handleApproveClub(club.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ApprovalsPage;
