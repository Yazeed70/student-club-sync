
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from '@/components/SearchBar';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Users, Filter, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubs, isUserMember, joinClub } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'joined' | 'not-joined'>('all');
  
  // Filter clubs based on search term and filter type
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    if (filter === 'joined') return matchesSearch && user && isUserMember(user.id, club.id);
    if (filter === 'not-joined') return matchesSearch && user && !isUserMember(user.id, club.id);
    
    return matchesSearch;
  });

  // Handle join club with loading state
  const handleJoinClub = async (clubId: string) => {
    setLoading(true);
    if (user) {
      await joinClub(clubId);
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  const isClubLeader = user && user.role === 'club_leader';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clubs</h1>
            <p className="text-muted-foreground">Discover and join student clubs on campus</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchBar 
              placeholder="Search clubs..." 
              onSearch={setSearchTerm}
              className="w-full sm:w-64"
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Clubs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('joined')}>
                    Joined Clubs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('not-joined')}>
                    Not Joined
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {(isClubLeader || (user?.role === 'administrator')) && (
                <Button asChild className="btn-gradient">
                  <Link to="/clubs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Club
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Clubs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeletons when loading
            [...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filteredClubs.length > 0 ? (
            filteredClubs.map((club) => {
              const isMember = user ? isUserMember(user.id, club.id) : false;
              const isLeader = user && user.id === club.leaderId;
              
              return (
                <Card key={club.id} className="overflow-hidden card-with-hover">
                  <div className="h-32 bg-gradient-secondary flex items-center justify-center">
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>
                      Created on {new Date(club.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{club.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link to={`/clubs/${club.id}`}>View Details</Link>
                    </Button>
                    
                    {isLeader ? (
                      <Button variant="outline" asChild>
                        <Link to={`/clubs/manage/${club.id}`}>
                          Manage
                        </Link>
                      </Button>
                    ) : (
                      isMember ? (
                        <Button variant="secondary" disabled>
                          Joined
                        </Button>
                      ) : (
                        <Button onClick={() => handleJoinClub(club.id)} className="btn-gradient">
                          Join Club
                        </Button>
                      )
                    )}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                No clubs match your search criteria.
              </p>
              <Button onClick={() => {setSearchTerm(''); setFilter('all')}} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClubsPage;
