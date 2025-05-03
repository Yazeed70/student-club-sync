
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';

const CLUB_CATEGORIES = [
  "Arts",
  "Business",
  "Science",
  "Technology",
  "Sports",
  "Languages",
  "Literature",
  "Media",
  "Personal Development",
  "Law",
  "Other"
];

const CreateClubPage: React.FC = () => {
  const navigate = useNavigate();
  const { createClub } = useApi();
  const [loading, setLoading] = useState(false);
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    category: '',
    logo: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setClubData(prev => ({ ...prev, category: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, this would be an upload to a server
      // Here we're just creating an object URL for demonstration purposes
      const logoUrl = URL.createObjectURL(file);
      setClubData(prev => ({ ...prev, logo: logoUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!clubData.name.trim()) {
      toast({ title: "Error", description: "Club name is required", variant: "destructive" });
      return;
    }
    
    if (!clubData.description.trim()) {
      toast({ title: "Error", description: "Club description is required", variant: "destructive" });
      return;
    }
    
    if (!clubData.category) {
      toast({ title: "Error", description: "Club category is required", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await createClub({
        name: clubData.name,
        description: clubData.description,
        category: clubData.category,
        logo: clubData.logo || undefined,
        status: 'pending',
        leaders: [],
        members: [],
        events: [],
        joinRequests: [],
        updatedAt: new Date().toISOString(),
      });
      
      if (success) {
        toast({ title: "Success", description: "Club created successfully. Waiting for approval." });
        navigate('/clubs');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create club", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Club</h1>
          <p className="text-muted-foreground mt-1">Fill out the form below to request a new club</p>
        </div>
        
        <Card className="border border-border">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Club Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Club Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={clubData.name}
                  onChange={handleInputChange}
                  placeholder="Enter club name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={clubData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the club's purpose, activities, and goals"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={clubData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLUB_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Club Logo</Label>
                <div className="flex flex-col space-y-3">
                  <label 
                    htmlFor="logo-upload" 
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    {clubData.logo ? (
                      <img 
                        src={clubData.logo} 
                        alt="Club logo preview" 
                        className="h-full w-auto object-contain" 
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <span>Upload club logo (optional)</span>
                        <span className="text-xs">Recommended size: 150x150px</span>
                      </div>
                    )}
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  {clubData.logo && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setClubData(prev => ({ ...prev, logo: '' }))}
                    >
                      Remove Logo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/clubs')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : "Create Club"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateClubPage;
