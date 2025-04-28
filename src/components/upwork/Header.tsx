
import { Search, Menu, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-upwork-green text-2xl font-bold">upwork</h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/find-talent" className="text-gray-600 hover:text-upwork-green">Find Talent</Link>
            <Link to="/find-work" className="text-gray-600 hover:text-upwork-green">Find Work</Link>
            <Link to="/why-upwork" className="text-gray-600 hover:text-upwork-green">Why Upwork</Link>
            <Link to="/enterprise" className="text-gray-600 hover:text-upwork-green">Enterprise</Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="flex items-center text-gray-600 hover:text-upwork-green">
                  <Search size={18} className="mr-1" />
                  <span>Search</span>
                </button>
                
                <Link to="/dashboard" className="text-gray-600 hover:text-upwork-green">
                  Dashboard
                </Link>
                
                <button className="relative text-gray-600 hover:text-upwork-green">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                
                <button className="relative text-gray-600 hover:text-upwork-green">
                  <MessageSquare size={20} />
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/jobs">Jobs</Link>
                    </DropdownMenuItem>
                    {user?.accountType === 'client' && (
                      <DropdownMenuItem asChild>
                        <Link to="/post-job">Post a Job</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.accountType === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <button className="flex items-center text-gray-600 hover:text-upwork-green">
                  <Search size={18} className="mr-1" />
                  <span>Search</span>
                </button>
                <Link to="/login" className="text-gray-600 hover:text-upwork-green">Log In</Link>
                <Button asChild className="bg-upwork-green hover:bg-upwork-darkGreen text-white">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-upwork-green"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <Link to="/find-talent" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Find Talent</Link>
            <Link to="/find-work" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Find Work</Link>
            <Link to="/why-upwork" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Why Upwork</Link>
            <Link to="/enterprise" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Enterprise</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Dashboard</Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Profile</Link>
                <Link to="/jobs" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Jobs</Link>
                {user?.accountType === 'client' && (
                  <Link to="/post-job" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Post a Job</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-upwork-green"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="#" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Search</Link>
                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Log In</Link>
                <Button asChild className="bg-upwork-green hover:bg-upwork-darkGreen text-white w-full">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
