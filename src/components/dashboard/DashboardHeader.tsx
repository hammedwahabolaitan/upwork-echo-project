
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">
          {user?.accountType === "client"
            ? "Find the perfect talent for your projects"
            : "Find work that matches your skills"}
        </p>
      </div>
      {user?.accountType === "client" && (
        <Button asChild>
          <Link to="/post-job" className="bg-upwork-green hover:bg-upwork-darkGreen">
            Post a Job
          </Link>
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
