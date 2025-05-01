import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"

export type UserRole = 'student' | 'club_leader' | 'administrator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string; // Added name property
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, role: UserRole) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, role: UserRole) => {
    // Mock sign-in implementation
    const newUser: User = {
      id: Math.random().toString(),
      email,
      role,
      name: 'Test User',
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    
    toast({
      title: "Login successful!",
      description: `Welcome, ${newUser.name}!`,
    })
    navigate("/");
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    navigate("/landing");
  };

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
