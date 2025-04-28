import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { getJobById, Job, getCurrentUser, updateJobStatus } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/utils/toastUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, DollarSign, Users, Award, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        const data = await getJobById(parseInt(id));
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast("Error loading job details", {
          description: "Failed to load job details"
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
        description: "Please log in to submit a proposal"
      });
      return;
    }
    
    if (!coverLetter || !bidAmount) {
      toast("Incomplete proposal", {
        description: "Please fill in all required fields"
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

  const handleUpdateStatus = async (newStatus: Job['status']) => {
    if (!job || !id) return;
    
    try {
      await updateJobStatus(parseInt(id), newStatus);
      setJob({...job, status: newStatus});
      toast("Job updated", {
        description: `Job status changed to ${newStatus}`
      });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast("Error updating job", {
        description: "Failed to update job status"
      });
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch(status) {
      case 'open':
        return "bg-green-100 text-green-800";
      case 'in_progress':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-purple-100 text-purple-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isJobOwner = user?.id === job?.client_id;
  const isAdmin = user?.accountType === 'admin';
  const canManageJob = isJobOwner || isAdmin;

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
                <Badge className={getStatusColor(job.status)}>
                  {job.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 my-3">
                {job.skills.split(",").map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
              
              <div className="my-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Budget: ${job.budget}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration: {job.duration}
                </div>
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
                {user?.accountType === 'freelancer' && job.status === 'open' && (
                  <Button className="w-full md:w-auto">Submit a Proposal</Button>
                )}
                
                {canManageJob && (
                  <div className="flex gap-2 mt-2">
                    <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Manage Job</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Job Status</DialogTitle>
                          <DialogDescription>
                            Change the status of this job.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus('open')}
                              className={job.status === 'open' ? 'border-2 border-green-500' : ''}
                            >
                              Open
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateStatus('in_progress')}
                              className={job.status === 'in_progress' ? 'border-2 border-blue-500' : ''}
                            >
                              In Progress
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateStatus('completed')}
                              className={job.status === 'completed' ? 'border-2 border-purple-500' : ''}
                            >
                              Completed
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateStatus('cancelled')}
                              className={job.status === 'cancelled' ? 'border-2 border-red-500' : ''}
                            >
                              Cancelled
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" onClick={() => navigate(`/edit-job/${job.id}`)}>
                      Edit Job
                    </Button>
                    
                    {isAdmin && (
                      <Button variant="destructive">
                        Delete Job
                      </Button>
                    )}
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600 mb-2">You need a freelancer account to apply for jobs</p>
                    <Button asChild variant="outline">
                      <Link to="/signup">Create Freelancer Account</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {user?.accountType === 'freelancer' && job.status === 'open' && (
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
