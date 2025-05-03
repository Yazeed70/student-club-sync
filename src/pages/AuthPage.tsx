
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" className="font-bold text-xl" onClick={() => navigate('/landing')}>
            IUBlaze
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/30 dark:from-background dark:to-accent/10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold text-foreground">IUBlaze</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Streamlining Student Club Management
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card text-card-foreground shadow-lg sm:rounded-lg p-8 border animate-scale-in card-with-hover">
            <div className="mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {showLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {showLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    className="ml-1 text-primary hover:underline focus:outline-none"
                    onClick={() => setShowLogin(!showLogin)}
                  >
                    {showLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>

            {showLogin ? (
              <LoginForm onToggleForm={() => setShowLogin(false)} />
            ) : (
              <RegisterForm onToggleForm={() => setShowLogin(true)} />
            )}
          </div>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in or creating an account, you agree to our {' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '} and {' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      
      <footer className="border-t py-4">
        <div className="container flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IUBlaze. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
