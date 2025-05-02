
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  message: string;
  date: string;
  isRead: boolean;
  type: 'proposal' | 'job' | 'message' | 'system';
}

// Normally these would come from an API
const mockNotifications: Notification[] = [
  { 
    id: 1, 
    message: "Your proposal for 'Frontend Developer' was viewed", 
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    type: 'proposal'
  },
  { 
    id: 2, 
    message: "New job matching your skills: 'React Developer'", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isRead: false,
    type: 'job'
  },
  { 
    id: 3, 
    message: "You received a new message from John Doe", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    type: 'message'
  },
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch notifications from an API
    setNotifications(mockNotifications);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-upwork-green">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-upwork-green hover:text-upwork-darkGreen"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
              >
                <div className="flex justify-between">
                  <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notification.date)}</p>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-upwork-green hover:text-upwork-darkGreen w-full"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
