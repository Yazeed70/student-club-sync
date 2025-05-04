import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload, Users, Calendar, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Club, Event, Membership } from '@/types';

const ManageClubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getClub, updateClub, getClubMembers, createEvent, getUserClubs, handleJoinRequest, getClubJoinRequests } = useApi();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    category: '',
    logo: '',
  });
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: 50,
    image: '',
  });

  // Check if user is club leader
  const isClubLeader = user && club && club.leaderId === user.id;
  
  // Get club data
  useEffect(() => {
    if (id) {
      const fetchedClub = getClub(id);
      if (fetchedClub) {
        setClub(fetchedClub);
        setClubData({
          name: fetchedClub.name,
          description: fetchedClub.description,
          category: fetchedClub.category,
          logo: fetchedClub.logo || '',
        });
        
        // Get club members
        if (user) {
          const fetchedMembers = getClubMembers(id);
          setMembers(fetchedMembers);
          
          // Get join requests for this club
          const clubJoinRequests = getClubJoinRequests(id);
          setJoinRequests(clubJoinRequests);
        }
      } else {
        navigate('/clubs');
      }
    }
  }, [id, getClub, user, getClubMembers, getClubJoinRequests, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, this would upload the file
      const logoUrl = URL.createObjectURL(file);
      setClubData(prev => ({ ...prev, logo: logoUrl }));
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleUpdateClub = async () => {
    if (!club || !user) return;
    
    setLoading(true);
    try {
      const success = await updateClub(club.id, {
        name: clubData.name,
        description: clubData.description,
        category: clubData.category,
        logo: clubData.logo || undefined,
      });
      
      if (success) {
        // Update local state to reflect changes
        setClub({
          ...club,
          name: clubData.name,
          description: clubData.description,
          category: clubData.category,
          logo: clubData.logo || undefined,
        });
        setEditMode(false);
        toast({ title: "Success", description: "Club details updated successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update club details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club || !user) return;
    
    // Validate event form
    if (!eventData.title.trim()) {
      toast({ title: "Error", description: "Event title is required", variant: "destructive" });
      return;
    }
    
    if (!eventData.date || !eventData.time) {
      toast({ title: "Error", description: "Event date and time are required", variant: "destructive" });
      return;
    }
    
    if (!eventData.location.trim()) {
      toast({ title: "Error", description: "Event location is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    // Combine date and time into ISO string
    const startDate = new Date(`${eventData.date}T${eventData.time}`);
    // Set end date to 2 hours after start by default
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    try {
      const success = await createEvent({
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        clubId: club.id,
        image: eventData.image,
        capacity: Number(eventData.capacity),
        createdBy: user.id // Adding the createdBy property
      });
      
      if (success) {
        // Reset form
        setEventData({
          title: '',
          description: '',
          location: '',
          date: '',
          time: '',
          capacity: 50,
          image: '',
        });
        toast({ title: "Success", description: "Event created and submitted for approval" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveJoinRequest = async (requestId: string) => {
    // Call the API method to approve the request
    const success = await handleJoinRequest(requestId, true);
    if (success) {
      // Update the local state
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      // Refresh members list
      if (id) {
        const fetchedMembers = getClubMembers(id);
        setMembers(fetchedMembers);
      }
      toast({ title: "Approved", description: "Member has been added to the club" });
    }
  };

  const handleRejectJoinRequest = async (requestId: string) => {
    // Call the API method to reject the request
    const success = await handleJoinRequest(requestId, false);
    if (success) {
      // Update the local state
      setJoinRequests(prev => prev.filter(req => req.id !== requestId));
      toast({ title: "Rejected", description: "Join request has been rejected" });
    }
  };

  // If club not found or user not authorized
  if (!club) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Club not found</h1>
          <p className="mt-4 text-muted-foreground">The club you are looking for does not exist or you don't have permission to manage it.</p>
          <Button className="mt-6" onClick={() => navigate('/clubs')}>
            Back to Clubs
          </Button>
        </div>
      </Layout>
    );
  }

  // If user is not club leader
  if (!isClubLeader) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-4 text-muted-foreground">You do not have permission to manage this club.</p>
          <Button className="mt-6" onClick={() => navigate(`/clubs/${club.id}`)}>
            View Club Page
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Club: {club.name}</h1>
            <p className="text-muted-foreground">Manage your club settings, members, and events</p>
          </div>
          
          <Button onClick={() => navigate(`/clubs/${club.id}`)} variant="outline">
            View Public Page
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="details" className="text-center">
              <Edit className="h-4 w-4 mr-2 inline" />
              Club Details
            </TabsTrigger>
            <TabsTrigger value="members" className="text-center">
              <Users className="h-4 w-4 mr-2 inline" />
              Members
            </TabsTrigger>
            <TabsTrigger value="events" className="text-center">
              <Calendar className="h-4 w-4 mr-2 inline" />
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Club Information</CardTitle>
                <Button 
                  variant={editMode ? "outline" : "default"}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : "Edit Details"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Club Logo */}
                  <div className="space-y-2">
                    <Label>Club Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-24 w-24 rounded-md overflow-hidden bg-secondary">
                        {clubData.logo ? (
                          <img 
                            src={clubData.logo} 
                            alt={`${clubData.name} logo`} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-accent">
                            <Users className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {editMode && (
                        <label className="flex flex-col">
                          <Button variant="outline" type="button" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Logo
                          </Button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoChange} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* Club Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Club Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={clubData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={clubData.category}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={clubData.description}
                      onChange={handleInputChange}
                      rows={5}
                      disabled={!editMode}
                    />
                  </div>
                  
                  {/* Creation Date - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="created">Created On</Label>
                    <Input
                      id="created"
                      value={new Date(club.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
              {editMode && (
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleUpdateClub}
                    disabled={loading}
                    className="btn-gradient"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Members List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {members.length > 0 ? (
                      <div className="space-y-4">
                        {members.map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-accent/30">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">User ID: {member.userId}</p>
                                <p className="text-sm text-muted-foreground">
                                  Joined on {new Date(member.joinedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground/40" />
                        <p className="mt-3 text-muted-foreground">No members in this club yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Join Requests */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Join Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {joinRequests.length > 0 ? (
                      <div className="space-y-4">
                        {joinRequests.map((request) => (
                          <div key={request.id} className="p-3 border rounded-md">
                            <div className="flex items-center space-x-3 mb-2">
                              <Avatar>
                                <AvatarFallback>{request.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{request.username}</p>
                                <p className="text-xs text-muted-foreground">
                                  Requested on {new Date(request.requestDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button 
                                size="sm" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApproveJoinRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleRejectJoinRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-muted-foreground">No pending join requests</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Event Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form id="create-event-form" onSubmit={handleCreateEvent}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Event Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={eventData.title}
                            onChange={handleEventInputChange}
                            placeholder="Enter event title"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              value={eventData.date}
                              onChange={handleEventInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input
                              id="time"
                              name="time"
                              type="time"
                              value={eventData.time}
                              onChange={handleEventInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={eventData.location}
                            onChange={handleEventInputChange}
                            placeholder="Enter event location"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            value={eventData.capacity}
                            onChange={handleEventInputChange}
                            min={1}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={eventData.description}
                            onChange={handleEventInputChange}
                            placeholder="Describe the event"
                            rows={4}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Event Image (Optional)</Label>
                          <div className="border-2 border-dashed border-border rounded-md p-4">
                            {eventData.image ? (
                              <div className="relative">
                                <img 
                                  src={eventData.image} 
                                  alt="Event image preview" 
                                  className="w-full h-48 object-cover rounded-md" 
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() => setEventData(prev => ({ ...prev, image: '' }))}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-muted-foreground">Click to upload image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEventImageChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit"
                      form="create-event-form"
                      disabled={loading}
                      className="btn-gradient"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Event
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Events Tips */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Event Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Event Approval Process</h4>
                        <p className="text-muted-foreground mt-1">
                          All events require approval from administrators before they become visible to students.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Required Information</h4>
                        <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                          <li>Clear, descriptive title</li>
                          <li>Specific date and time</li>
                          <li>Precise location</li>
                          <li>Thorough description of activities</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">Tips for Successful Events</h4>
                        <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                          <li>Plan at least 2 weeks in advance</li>
                          <li>Set realistic capacity limits</li>
                          <li>Include engaging visuals</li>
                          <li>Send reminders to registered attendees</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManageClubPage;
