
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Effect to show toast if redirected due to authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required", {
        description: "Please log in to access this page"
      });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Spinner className="h-12 w-12 border-4 border-t-transparent text-upwork-green mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
