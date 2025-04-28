import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { getJobs, Job, updateJobStatus, deleteJob } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/utils/toastUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MoreVertical, Users, Briefcase, DollarSign, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not admin
    if (user && user.accountType !== 'admin' && user.accountType !== 'client') {
      navigate('/dashboard');
      toast("Access Denied", {
        description: "You don't have permission to access this page"
      });
      return;
    }
    
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
        setFilteredJobs(data);
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
  }, [user, navigate]);

  useEffect(() => {
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateStatus = async (jobId: number, newStatus: Job['status']) => {
    try {
      await updateJobStatus(jobId, newStatus);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      toast("Job updated", {
        description: `Job status changed to ${newStatus}`
      });
    } catch (error) {
      console.error("Error updating job:", error);
      toast("Error updating job", {
        description: "Failed to update job status"
      });
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      setConfirmDeleteId(null);
      toast("Job deleted", {
        description: "Job has been permanently removed"
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast("Error deleting job", {
        description: "Failed to delete job"
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

  const statsData = {
    totalJobs: jobs.length,
    openJobs: jobs.filter(job => job.status === 'open').length,
    inProgressJobs: jobs.filter(job => job.status === 'in_progress').length,
    completedJobs: jobs.filter(job => job.status === 'completed').length,
    cancelledJobs: jobs.filter(job => job.status === 'cancelled').length,
  };

  const StatCard = ({ title, value, icon: Icon, className }: { title: string, value: number, icon: React.ElementType, className: string }) => (
    <Card className="overflow-hidden">
      <CardHeader className={`p-4 ${className}`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all jobs and user activity</p>
          </div>
          <Button asChild>
            <Link to="/post-job">+ Create New Job</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard 
            title="Total Jobs" 
            value={statsData.totalJobs} 
            icon={Briefcase} 
            className="bg-gray-700" 
          />
          <StatCard 
            title="Open Jobs" 
            value={statsData.openJobs} 
            icon={Briefcase} 
            className="bg-green-600" 
          />
          <StatCard 
            title="In Progress" 
            value={statsData.inProgressJobs} 
            icon={Briefcase} 
            className="bg-blue-600" 
          />
          <StatCard 
            title="Completed" 
            value={statsData.completedJobs} 
            icon={Briefcase} 
            className="bg-purple-600" 
          />
          <StatCard 
            title="Cancelled" 
            value={statsData.cancelledJobs} 
            icon={AlertCircle} 
            className="bg-red-600" 
          />
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Job Management</CardTitle>
            <CardDescription>View and manage all jobs in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>
                        <Link to={`/jobs/${job.id}`} className="hover:underline text-upwork-green">
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>${job.budget}</TableCell>
                      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/edit-job/${job.id}`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'open')}>
                              Mark as Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'in_progress')}>
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'completed')}>
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'cancelled')}>
                              Mark as Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setConfirmDeleteId(job.id)}
                            >
                              Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredJobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No jobs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => confirmDeleteId && handleDeleteJob(confirmDeleteId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
