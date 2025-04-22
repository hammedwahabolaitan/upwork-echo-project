
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <button className="flex items-center text-gray-600 hover:text-upwork-green">
              <Search size={18} className="mr-1" />
              <span>Search</span>
            </button>
            <Link to="/login" className="text-gray-600 hover:text-upwork-green">Log In</Link>
            <Button asChild className="bg-upwork-green hover:bg-upwork-darkGreen text-white">
              <Link to="/signup">Sign Up</Link>
            </Button>
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
            <Link to="#" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Search</Link>
            <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-upwork-green">Log In</Link>
            <Button asChild className="bg-upwork-green hover:bg-upwork-darkGreen text-white w-full">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
