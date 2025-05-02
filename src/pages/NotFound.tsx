
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/upwork/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-6xl font-bold mb-6 text-upwork-green">404</h1>
          <p className="text-2xl text-gray-700 mb-6">Oops! Page not found</p>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-upwork-green hover:bg-upwork-darkGreen">
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
