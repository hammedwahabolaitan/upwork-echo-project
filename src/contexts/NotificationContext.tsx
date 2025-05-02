
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/utils/toastUtils';

export interface Notification {
  id: number;
  message: string;
  date: string;
  isRead: boolean;
  type: 'proposal' | 'job' | 'message' | 'system';
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Mock fetching notifications when user changes
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call
      const mockNotifications: Notification[] = [
        { 
          id: 1, 
          message: "Your proposal for 'Frontend Developer' was viewed", 
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: false,
          type: 'proposal',
          link: '/proposals/1'
        },
        { 
          id: 2, 
          message: "New job matching your skills: 'React Developer'", 
          date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          isRead: false,
          type: 'job',
          link: '/jobs/2'
        },
        { 
          id: 3, 
          message: "You received a new message from John Doe", 
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          isRead: true,
          type: 'message',
          link: '/messages/3'
        },
      ];
      
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);
  
  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      date: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for real-time feedback
    toast(notification.message, {
      description: notification.type.charAt(0).toUpperCase() + notification.type.slice(1)
    });
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        addNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
