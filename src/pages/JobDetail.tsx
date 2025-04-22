import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { getJobById, Job } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/utils/toastUtils";
import { useAuth } from "@/contexts/AuthContext";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        const data = await getJobById(parseInt(id));
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast("Error", {
          description: "Failed to load job details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast("Authentication required", {
        description: "Please log in to submit a proposal",
        variant: "destructive"
      });
      return;
    }
    
    if (!coverLetter || !bidAmount) {
      toast("Incomplete proposal", {
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the proposal to the API
    toast("Proposal submitted", {
      description: "Your proposal has been submitted successfully"
    });
    
    // Reset form
    setCoverLetter("");
    setBidAmount("");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/jobs" className="text-upwork-green hover:underline flex items-center gap-1">
            ← Back to Jobs
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <Badge variant="outline">{job.status}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 my-3">
                {job.skills.split(",").map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
              
              <div className="my-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <div>Posted: {new Date(job.created_at).toLocaleDateString()}</div>
                <div>Budget: ${job.budget}</div>
                <div>Duration: {job.duration}</div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h2 className="text-lg font-semibold mb-3">Project Description</h2>
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h2 className="text-lg font-semibold mb-3">Skills Required</h2>
                <p>{job.skills}</p>
              </div>
              
              <div className="mt-6">
                {user?.accountType === 'freelancer' ? (
                  <Button className="w-full md:w-auto">Submit a Proposal</Button>
                ) : user?.accountType === 'client' && user.id === job.client_id ? (
                  <div className="flex gap-2">
                    <Button variant="outline">Edit Job</Button>
                    <Button variant="destructive">Close Job</Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 mb-2">You need a freelancer account to apply for jobs</p>
                    <Button asChild variant="outline">
                      <Link to="/signup">Create Freelancer Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {user?.accountType === 'freelancer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProposal} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bid Amount (USD)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter your bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter
                      </label>
                      <Textarea
                        placeholder="Explain why you're a good fit for this job..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Submit Proposal</Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="w-full md:w-1/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Company</h3>
                    <p>Tech Solutions Inc.</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Member Since</h3>
                    <p>January 2023</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p>United States</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Verification</h3>
                    <div className="flex gap-1 items-center">
                      <span>Payment verified</span>
                      <span className="text-green-500">✓</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <span>Identity verified</span>
                      <span className="text-green-500">✓</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Proposals</h3>
                    <p>10-15 proposals</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Last Viewed By Client</h3>
                    <p>1 day ago</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Interviewing</h3>
                    <p>3 candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
