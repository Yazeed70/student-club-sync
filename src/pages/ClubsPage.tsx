
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubs, isUserMember, joinClub } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter clubs based on search term
  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle join club
  const handleJoinClub = async (clubId: string) => {
    if (user) {
      await joinClub(clubId);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Clubs</h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Clubs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => {
              const isMember = user ? isUserMember(user.id, club.id) : false;
              const isLeader = user && user.id === club.leaderId;
              
              return (
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
                    
                    {!isLeader && (
                      isMember ? (
                        <Button variant="secondary" disabled>
                          Joined
                        </Button>
                      ) : (
                        <Button onClick={() => handleJoinClub(club.id)}>
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
              <p className="text-muted-foreground">
                No clubs match your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClubsPage;
