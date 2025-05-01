
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'student' | 'club_leader' | 'administrator';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    username: 'student',
    email: 'student@university.edu',
    role: 'student',
  },
  {
    id: '2',
    username: 'clubleader',
    email: 'leader@university.edu',
    role: 'club_leader',
  },
  {
    id: '3',
    username: 'admin',
    email: 'admin@university.edu',
    role: 'administrator',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API request
    try {
      // For demo purposes, using mock data
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // Simple demo password
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: 'Login successful',
          description: `Welcome back, ${foundUser.username}!`,
        });
        return true;
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // In a real app, this would make an API request
    try {
      // Check if user already exists
      const userExists = mockUsers.some(u => u.email === email);
      
      if (userExists) {
        toast({
          title: 'Registration failed',
          description: 'User with this email already exists',
          variant: 'destructive',
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        username,
        email,
        role,
      };
      
      // In a real app, we would save this to a database
      mockUsers.push(newUser);
      
      // Log the user in
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration successful',
        description: `Welcome, ${username}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
