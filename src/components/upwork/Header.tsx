
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "@/components/notifications/NotificationBell";
import MessageCenter from "@/components/messaging/MessageCenter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  // Adding the user menu with notifications
  const renderUserMenu = () => {
    return (
      <div className="flex items-center space-x-2">
        <NotificationBell />
        <MessageCenter />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.firstName || 'Avatar'} />
                <AvatarFallback>{user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-upwork-green">
          Upwork Clone
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/find-talent" className="hover:text-upwork-green">
            Find Talent
          </Link>
          <Link to="/find-work" className="hover:text-upwork-green">
            Find Work
          </Link>
          <Link to="/why-upwork" className="hover:text-upwork-green">
            Why Upwork
          </Link>
          <Link to="/enterprise" className="hover:text-upwork-green">
            Enterprise
          </Link>
        </div>

        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            {renderUserMenu()}
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="hover:text-upwork-green">
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-upwork-green text-white py-2 px-4 rounded hover:bg-upwork-darkGreen transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link to="/find-talent" className="hover:text-upwork-green block py-2">
              Find Talent
            </Link>
            <Link to="/find-work" className="hover:text-upwork-green block py-2">
              Find Work
            </Link>
            <Link to="/why-upwork" className="hover:text-upwork-green block py-2">
              Why Upwork
            </Link>
            <Link to="/enterprise" className="hover:text-upwork-green block py-2">
              Enterprise
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="hover:text-upwork-green block py-2">
                  Profile
                </Link>
                <Link to="/settings" className="hover:text-upwork-green block py-2">
                  Settings
                </Link>
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-upwork-green block py-2">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-upwork-green text-white py-2 px-4 rounded hover:bg-upwork-darkGreen transition-colors block text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
