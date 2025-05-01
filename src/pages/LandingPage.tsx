
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { EventCarousel } from "@/components/EventCarousel";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeProvider";
import { Users, Calendar, Bell, Shield } from "lucide-react";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">ClubSync</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="transition-colors hover:text-foreground/80">
              Features
            </a>
            <a href="#about" className="transition-colors hover:text-foreground/80">
              About
            </a>
            <a href="#testimonials" className="transition-colors hover:text-foreground/80">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              className="hidden md:flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-accent/30 dark:bg-accent/10">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Powerful Club Management Features
              </h2>
              <p className="mt-2 text-muted-foreground">
                Everything you need to streamline your club operations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Club Management</h3>
                <p className="text-muted-foreground">
                  Create and join clubs, manage memberships, and grow your community.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Event Planning</h3>
                <p className="text-muted-foreground">
                  Schedule events, manage registrations, and track attendance.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <p className="text-muted-foreground">
                  Keep members informed with real-time notifications and announcements.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
                <p className="text-muted-foreground">
                  Approval workflows, reporting, and administrative tools.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Carousel */}
        <EventCarousel />
        
        {/* About Section */}
        <section id="about" className="py-16 bg-gradient-to-b from-background to-accent/30 dark:from-background dark:to-accent/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">
                  Connecting Students, Empowering Clubs
                </h2>
                <p className="text-muted-foreground mb-4">
                  ClubSync is designed to streamline the management of student clubs and events on campus. Our platform makes it easy for students to discover and join clubs, while providing club leaders with powerful tools to manage their organizations.
                </p>
                <p className="text-muted-foreground mb-6">
                  From event planning and member management to approval workflows and reporting, ClubSync provides everything you need to run your student clubs efficiently.
                </p>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="btn-gradient"
                >
                  Join Our Community
                </Button>
              </div>
              <div className="mx-auto lg:ml-0 relative mt-8 lg:mt-0">
                <div className="bg-background rounded-xl shadow-2xl overflow-hidden dark:bg-card border">
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                    alt="Students collaborating" 
                    className="w-full h-auto object-cover aspect-[4/3]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                What Students and Clubs Say
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hear from the students and clubs who use ClubSync
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-with-hover p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Jane Doe</h4>
                    <p className="text-sm text-muted-foreground">Tech Club Leader</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "ClubSync has revolutionized how we manage our club. Event planning used to take hours, now it's just minutes!"
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="font-bold text-secondary">JS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Smith</h4>
                    <p className="text-sm text-muted-foreground">Student</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "I discovered so many interesting clubs through ClubSync. The notifications feature keeps me updated on all events I'm interested in."
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">AM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex Miller</h4>
                    <p className="text-sm text-muted-foreground">Department Admin</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "The approval workflow and reporting features have made our administrative work much more efficient. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Ready to Transform Your Club Experience?
            </h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Join thousands of students and clubs already using ClubSync to manage their activities and events.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="animate-pulse hover:animate-none"
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
