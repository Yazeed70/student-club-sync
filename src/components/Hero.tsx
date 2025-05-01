
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30 dark:from-background dark:to-accent/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm">
              New Feature: Interactive Event Calendar
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
              Streamlining Student Club Management
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Connect with clubs, discover events, and engage with your campus community. All in one place.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {isAuthenticated ? (
                <Button size="lg" className="btn-gradient" onClick={() => navigate("/")}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="lg" className="btn-gradient" onClick={() => navigate("/auth")}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/clubs")}>
                    Explore Clubs
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mx-auto lg:mr-0 relative">
            <div className="p-4 bg-background rounded-xl shadow-2xl dark:bg-card border animate-fade-in">
              <div className="aspect-[16/9] rounded-lg bg-accent/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Students at club event" 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-2 bg-primary/20 rounded"></div>
                <div className="h-2 bg-secondary/20 rounded"></div>
                <div className="h-2 bg-primary/30 rounded"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-primary p-4 rounded-lg shadow-lg text-white font-medium animate-scale-in dark:bg-accent text-sm">
              50+ Active Clubs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
