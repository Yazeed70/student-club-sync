
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function EventCarousel() {
  const { events, clubs } = useApi();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Only show approved upcoming events
  const featuredEvents = events
    .filter(event => event.status === 'approved' && new Date(event.startDate) > new Date())
    .slice(0, 6);
    
  // Get club name
  const getClubName = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.name || 'Unknown Club';
  };
  
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % featuredEvents.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredEvents.length > 1) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredEvents.length]);
  
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * (carouselRef.current.offsetWidth / 1);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Featured Events</h2>
            <p className="text-muted-foreground">Discover upcoming events from student clubs</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={featuredEvents.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={featuredEvents.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex transition-all duration-500 overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {featuredEvents.map((event, index) => (
              <div 
                key={event.id}
                className="w-full flex-shrink-0 px-2 snap-center"
              >
                <Card className="card-with-hover overflow-hidden">
                  <div className="h-48 bg-muted relative">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
                        <Calendar className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4">
                      {new Date(event.startDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>
                      by {getClubName(event.clubId)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="line-clamp-2 text-sm">{event.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Location:</strong> {event.location}
                    </p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-4 gap-1">
          {featuredEvents.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
