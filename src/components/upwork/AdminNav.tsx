
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  FileText, 
  MessageSquare,
  DollarSign
} from 'lucide-react';

const AdminNav = () => {
  const { user } = useAuth();
  
  // Only show for admin users
  if (!user || user.accountType !== 'admin') {
    return null;
  }
  
  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Proposals',
      href: '/admin/proposals',
      icon: FileText,
    },
    {
      title: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
    },
    {
      title: 'Payments',
      href: '/admin/payments',
      icon: DollarSign,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="bg-gray-50 border-b mb-6 py-2">
      <div className="container mx-auto">
        <div className="flex items-center overflow-x-auto">
          <div className="text-sm font-medium mr-4 text-gray-500">Admin:</div>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap',
                  isActive
                    ? 'text-upwork-green bg-green-50'
                    : 'text-gray-700 hover:text-upwork-green hover:bg-gray-100'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
