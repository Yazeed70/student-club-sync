import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { EventCarousel } from "@/components/EventCarousel";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Users, Calendar, Bell, Shield } from "lucide-react";
const LandingPage: React.FC = () => {
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Blaze.IU</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="transition-colors hover:text-foreground/80">
              Features
            </a>
            <a href="#about" className="transition-colors hover:text-foreground/80">
              About
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" className="hidden md:flex" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-accent/30 dark:from-background dark:to-accent/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm">
                  Introducing IUBlaze
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  Streamlining Student Club Management
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with clubs, discover events, and engage with your campus community. All in one place.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {isAuthenticated ? <Button size="lg" className="btn-gradient" onClick={() => navigate("/")}>
                      Go to Dashboard
                    </Button> : <>
                      <Button size="lg" className="btn-gradient" onClick={() => navigate("/auth")}>
                        Get Started
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => navigate("/clubs")}>
                        Explore Clubs
                      </Button>
                    </>}
                </div>
              </div>
              <div className="mx-auto lg:mr-0 relative">
                <div className="p-4 bg-background rounded-xl shadow-2xl dark:bg-card border animate-fade-in">
                  <div className="aspect-[16/9] rounded-lg bg-accent/20 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Students at club event" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-2 bg-primary/20 rounded"></div>
                    <div className="h-2 bg-secondary/20 rounded"></div>
                    <div className="h-2 bg-primary/30 rounded"></div>
                  </div>
                </div>
                <div className="absolute -bottom-12 -right-1 bg-gradient-primary p-4 rounded-lg shadow-lg text-white font-medium animate-scale-in dark:bg-accent text-sm py-[16px]">
                  50+ Active Clubs
                </div>
              </div>
            </div>
          </div>
        </section>
        
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
                  Create and join clubs, manage memberships, and grow your community with ease.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Event Planning</h3>
                <p className="text-muted-foreground">
                  Schedule events, manage registrations, and track attendance with powerful tools.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <p className="text-muted-foreground">
                  Keep members informed with real-time notifications and important announcements.
                </p>
              </div>
              
              <div className="card-with-hover p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
                <p className="text-muted-foreground">
                  Get full control with advanced approval workflows, reporting, and administrative tools.
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
                  IUBlaze is designed to streamline the management of student clubs and events on campus. Our platform makes it easy for students to discover and join clubs, while providing club leaders with powerful tools to manage their organizations.
                </p>
                <p className="text-muted-foreground mb-6">
                  From event planning and member management to approval workflows and reporting, IUBlaze provides everything you need to run your student clubs efficiently.
                </p>
                <Button onClick={() => navigate("/auth")} className="btn-gradient">
                  Join Our Community
                </Button>
              </div>
              <div className="mx-auto lg:ml-0 relative mt-8 lg:mt-0">
                <div className="bg-background rounded-xl shadow-2xl overflow-hidden dark:bg-card border">
                  <img alt="Students collaborating" loading="lazy" className="w-full h-auto aspect-[4/3] object-cover" src="/lovable-uploads/f4973532-fffa-444c-af67-88b563132c18.jpg" />
                </div>
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
              Join thousands of students and clubs already using IUBlaze to manage their activities and events.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="animate-pulse hover:animate-none">
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default LandingPage;