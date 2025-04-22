
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJobs, Job } from "@/services/api";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
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
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {user?.accountType === "client" ? (
              <>
                <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="find-work">Find Work</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                <TabsTrigger value="proposals">My Proposals</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.accountType === "client" ? (
                    <div className="space-y-2">
                      <p>Active Jobs: 2</p>
                      <p>Total Proposals: 15</p>
                      <p>Ongoing Contracts: 1</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>Proposals Sent: 8</p>
                      <p>Active Contracts: 1</p>
                      <p>Completed Jobs: 12</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Profile</CardTitle>
                  <CardDescription>70% completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-gray-200 rounded-full mb-4">
                    <div className="h-full bg-upwork-green rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Basic information</li>
                    <li>✅ Contact details</li>
                    <li>❌ Portfolio items</li>
                    <li>❌ Work experience</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/profile">Complete Profile</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="text-sm">
                      <span className="text-gray-500">Today</span>
                      <p>You received a new message</p>
                    </li>
                    <li className="text-sm">
                      <span className="text-gray-500">Yesterday</span>
                      <p>You received a proposal for "Frontend Developer"</p>
                    </li>
                    <li className="text-sm">
                      <span className="text-gray-500">3 days ago</span>
                      <p>You created a new job post</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

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
          </TabsContent>

          <TabsContent value="my-jobs">
            <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
            {/* My jobs content */}
          </TabsContent>

          <TabsContent value="find-work">
            <h2 className="text-2xl font-bold mb-4">Find Work</h2>
            {/* Find work content */}
          </TabsContent>

          <TabsContent value="saved">
            <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
            {/* Saved jobs content */}
          </TabsContent>

          <TabsContent value="proposals">
            <h2 className="text-2xl font-bold mb-4">
              {user?.accountType === "client" ? "Proposals Received" : "My Proposals"}
            </h2>
            {/* Proposals content */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
