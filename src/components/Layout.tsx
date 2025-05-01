
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isAuthenticated && <Navbar />}
      <div className={`${isAuthenticated ? 'pt-16' : ''} flex-1`}>
        {children}
      </div>
      {!isAuthenticated && <Footer />}
      <Toaster />
    </div>
  );
};

export default Layout;
