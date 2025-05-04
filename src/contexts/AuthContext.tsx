
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

export type UserRole = 'student' | 'club_leader' | 'administrator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  username?: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => {},
  login: async () => {},
  register: async () => {},
  signOut: () => {},
  logout: () => {},
  updateUserRole: async () => {},
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
    });
    navigate("/");
  };

  const login = async (email: string, password: string) => {
    // Admin detection through email
    if (email.includes('admin')) {
      await signIn(email, 'administrator');
      return;
    }
    
    // For non-admin users, all new logins that aren't registrations are students
    await signIn(email, 'student');
  };

  const register = async (username: string, email: string, password: string) => {
    // Admin cannot register - prevent admin registration
    if (email.includes('admin')) {
      toast({
        title: "Registration failed",
        description: "Administrator accounts cannot be registered. Please use an existing account or contact system administrator.",
        variant: "destructive"
      });
      return;
    }

    // All new users register as students only
    const newUser: User = {
      id: Math.random().toString(),
      email,
      role: 'student', // All new users start as students
      name: username,
      username,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    
    toast({
      title: "Registration successful!",
      description: `Welcome to IUBlaze, ${username}!`,
    });
    navigate("/");
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/landing");
  };
  
  // Method to update user role (e.g., when club is approved)
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Role updated",
        description: `Your account has been updated to ${newRole.replace('_', ' ')}.`,
      });
    }
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
    updateUserRole,
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
