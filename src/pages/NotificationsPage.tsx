
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, RefreshCw } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserNotifications, markNotificationAsRead } = useApi();
  const [loading, setLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get notifications for the current user
  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  
  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    setLoading(id);
    await markNotificationAsRead(id);
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulating refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    setRefreshing(true);
    // Mark all as read one by one
    for (const notification of unreadNotifications) {
      await markNotificationAsRead(notification.id);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your clubs and events</p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All
                {notifications.length > 0 && (
                  <Badge className="ml-1.5 h-5 min-w-5 px-1">{notifications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadNotifications.length > 0 && (
                  <Badge className="ml-1.5 h-5 min-w-5 px-1">{unreadNotifications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            
            {unreadNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                disabled={refreshing}
                className="text-xs"
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <TabsContent value="all">
            <Card className="card-with-hover">
              <CardContent className="pt-6">
                {notifications.length > 0 ? (
                  <ul className="space-y-3">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-4 rounded-md ${
                          notification.read ? 'bg-accent dark:bg-accent/20' : 'bg-primary/10 dark:bg-primary/20'
                        } flex justify-between items-start animate-fade-in transform transition hover:-translate-y-0.5`}
                      >
                        <div className="flex gap-3">
                          <div className={`rounded-full p-2 ${notification.read ? 'bg-muted' : 'bg-primary/20'}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className={`${!notification.read && 'font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={loading === notification.id}
                            className="h-8"
                          >
                            {loading === notification.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <span>Mark as read</span>
                            )}
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      You have no notifications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread">
            <Card className="card-with-hover">
              <CardContent className="pt-6">
                {unreadNotifications.length > 0 ? (
                  <ul className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="p-4 rounded-md bg-primary/10 dark:bg-primary/20 flex justify-between items-start animate-fade-in transform transition hover:-translate-y-0.5"
                      >
                        <div className="flex gap-3">
                          <div className="rounded-full p-2 bg-primary/20">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={loading === notification.id}
                          className="h-8"
                        >
                          {loading === notification.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <span>Mark as read</span>
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      You have no unread notifications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="read">
            <Card className="card-with-hover">
              <CardContent className="pt-6">
                {readNotifications.length > 0 ? (
                  <ul className="space-y-3">
                    {readNotifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="p-4 rounded-md bg-accent dark:bg-accent/20 flex gap-3 animate-fade-in"
                      >
                        <div className="rounded-full p-2 bg-muted">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <p>{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      You have no read notifications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
