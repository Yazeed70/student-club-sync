
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserNotifications, getUserClubs, getPendingEvents, getPendingClubs } = useApi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get unread notifications count
  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get pending items counts for admins
  const pendingClubs = user?.role === 'administrator' ? getPendingClubs().length : 0;
  const pendingEvents = user?.role === 'administrator' ? getPendingEvents().length : 0;
  const totalPendingCount = pendingClubs + pendingEvents;
  
  // Get user's clubs for club leaders
  const userClubs = user ? getUserClubs(user.id) : [];
  const hasApprovedClubs = userClubs.some(club => club.status === 'approved');
  
  // Role-based navigation links
  const getNavLinks = () => {
    if (!user) return [];
    
    const links = [
      { title: 'Dashboard', path: '/' },
      { title: 'Clubs', path: '/clubs' },
      { title: 'Events', path: '/events' },
    ];
    
    // If user is a club leader (student with approved clubs)
    if (user.role === 'club_leader' || hasApprovedClubs) {
      const approvedClubs = userClubs.filter(club => club.status === 'approved');
      if (approvedClubs.length > 0) {
        links.push({ 
          title: 'Manage Club', 
          path: `/clubs/manage/${approvedClubs[0].id}` 
        });
      }
    }
    
    if (user.role === 'administrator') {
      links.push({ 
        title: 'Approvals', 
        path: '/approvals',
        badge: totalPendingCount > 0 ? totalPendingCount : undefined 
      });
      links.push({ title: 'Reports', path: '/reports' });
    }
    
    return links;
  };
  
  const navLinks = getNavLinks();

  return (
    <nav className="bg-card text-card-foreground shadow fixed w-full z-10 top-0 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-xl">IUBlaze</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition relative"
                  >
                    {link.title}
                    {link.badge && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <ThemeToggle />
              
              <Link to="/notifications" className="relative p-1 rounded-full hover:bg-accent/50">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              
              {user && user.role !== 'administrator' && (
                <Link to="/clubs/create">
                  <Button size="sm" className="flex gap-1 items-center">
                    <Plus className="h-4 w-4" /> Create Club
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-1 rounded-full hover:bg-accent/50">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username || user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="outline" className="mt-1 w-fit">
                        {user?.role === 'club_leader' ? 'Club Leader' : 
                         user?.role === 'administrator' ? 'Administrator' : 
                         hasApprovedClubs ? 'Club Leader' : 'Student'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications">Notifications {unreadCount > 0 && `(${unreadCount})`}</Link>
                  </DropdownMenuItem>
                  {(user?.role !== 'administrator' && !hasApprovedClubs) && (
                    <DropdownMenuItem asChild>
                      <Link to="/clubs/create">Create Club</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent/50 relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.title}
                {link.badge && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <User size={24} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user?.username || user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
              <div className="ml-auto flex items-center space-x-3">
                <ThemeToggle />
                <Link to="/notifications" className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {user && user.role !== 'administrator' && (
                <Link 
                  to="/clubs/create" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Club
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-accent/50"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
