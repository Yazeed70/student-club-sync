
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ClubLeaderDashboard from '@/components/dashboard/ClubLeaderDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Set favicon
  useEffect(() => {
    document.querySelector('link[rel="icon"]')?.setAttribute('href', '/favicon.ico');
  }, []);
  
  // Redirect to auth page if not authenticated, or to landing page if visiting root
  if (!isAuthenticated) {
    return <Navigate to="/landing" />;
  }
  
  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'club_leader':
        return <ClubLeaderDashboard />;
      case 'administrator':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default Index;
