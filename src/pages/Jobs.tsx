import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { getJobs, Job } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/utils/toastUtils";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast("Error", {
          description: "Failed to load jobs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
    setCurrentPage(1);
  }, [searchTerm, jobs]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Work</h1>
          <p className="text-gray-600">Browse the latest jobs that match your skills and experience</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <Input
                    id="search"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Job Type</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        id="hourly"
                        name="job-type"
                        type="checkbox"
                        className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                      />
                      <label htmlFor="hourly" className="ml-2 block text-sm text-gray-700">
                        Hourly
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="fixed"
                        name="job-type"
                        type="checkbox"
                        className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                      />
                      <label htmlFor="fixed" className="ml-2 block text-sm text-gray-700">
                        Fixed Price
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Experience Level</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        id="entry"
                        name="experience"
                        type="checkbox"
                        className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                      />
                      <label htmlFor="entry" className="ml-2 block text-sm text-gray-700">
                        Entry Level
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="intermediate"
                        name="experience"
                        type="checkbox"
                        className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                      />
                      <label htmlFor="intermediate" className="ml-2 block text-sm text-gray-700">
                        Intermediate
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="expert"
                        name="experience"
                        type="checkbox"
                        className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                      />
                      <label htmlFor="expert" className="ml-2 block text-sm text-gray-700">
                        Expert
                      </label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          <main className="w-full md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              </div>
            ) : currentJobs.length > 0 ? (
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          <Link to={`/jobs/${job.id}`} className="text-upwork-green hover:underline">
                            {job.title}
                          </Link>
                        </CardTitle>
                        <Badge variant="outline">{job.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills.split(",").map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">{job.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div>Budget: ${job.budget}</div>
                        <div>Duration: {job.duration}</div>
                        <div>Posted: {new Date(job.created_at).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or check back later.</p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
