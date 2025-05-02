
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Job, getJobs } from "@/services";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/utils/toastUtils";

const JobsList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast("Error loading jobs", {
          description: "Failed to load jobs"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {user?.accountType === "client" ? "Recently Posted Jobs" : "Recommended Jobs"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading jobs...</div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">
                  <Link to={`/jobs/${job.id}`} className="text-upwork-green hover:underline">
                    {job.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">Budget: ${job.budget}</div>
                  <div className="text-sm text-gray-500">Posted: {new Date(job.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            <div className="text-center">
              <Button asChild variant="outline">
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No jobs found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobsList;
