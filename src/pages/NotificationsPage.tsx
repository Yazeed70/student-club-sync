
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserNotifications, markNotificationAsRead } = useApi();
  
  // Get notifications for the current user
  const notifications = user ? getUserNotifications(user.id) : [];
  
  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 rounded-md ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    } flex justify-between items-start`}
                  >
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
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                You have no notifications.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
