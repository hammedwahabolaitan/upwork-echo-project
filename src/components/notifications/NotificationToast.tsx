
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Briefcase, Info } from 'lucide-react';
import { Notification } from '@/contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
}

const NotificationToast = ({ notification }: NotificationToastProps) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (notification.type) {
      case 'proposal':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'job':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleClick = () => {
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <div 
      className="flex items-start p-3 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="mr-3 mt-0.5">
        {getIcon()}
      </div>
      <div>
        <h4 className="font-medium text-sm">{notification.message}</h4>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default NotificationToast;
