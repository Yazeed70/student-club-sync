
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"

export type UserRole = 'student' | 'club_leader' | 'administrator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  username?: string; // Added optional username property
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Added login method
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>; // Added register method
  signOut: () => void;
  logout: () => void; // Added logout alias for signOut
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  login: async () => {}, // Added login method
  register: async () => {}, // Added register method
  signOut: () => {},
  logout: () => {}, // Added logout alias for signOut
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
      username: email.split('@')[0], // Generate a username from email
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

  const login = async (email: string, password: string) => {
    // Mock login implementation that uses signIn
    // In a real app, you would verify credentials here
    const role = 
      email.includes('admin') ? 'administrator' : 
      email.includes('leader') ? 'club_leader' : 'student';
    
    await signIn(email, role as UserRole);
  };

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    // Mock register implementation
    const newUser: User = {
      id: Math.random().toString(),
      email,
      role,
      name: username,
      username,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    
    toast({
      title: "Registration successful!",
      description: `Welcome to ClubSync, ${username}!`,
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
  
  // Alias for signOut for better readability
  const logout = signOut;

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    login,
    register,
    signOut,
    logout,
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
