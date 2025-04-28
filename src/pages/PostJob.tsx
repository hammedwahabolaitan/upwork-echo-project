import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/utils/toastUtils";
import { createJob } from "@/services";

const PostJob = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    duration: "Less than 1 month",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.accountType !== "client") {
      toast("Access denied", {
        description: "Only clients can post jobs"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        budget: parseFloat(formData.budget),
        duration: formData.duration,
      });
      
      toast("Success", {
        description: "Your job has been posted successfully"
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
      toast("Error posting job", {
        description: error instanceof Error ? error.message : "Failed to post job"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="budget">Budget & Timeline</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Start with the basics about your job</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. 'Frontend Developer for Web Application'"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your project in detail..."
                        rows={10}
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" disabled>
                      Back
                    </Button>
                    <Button type="button" onClick={() => goToTab("details")}>
                      Continue
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Specify the skills and expertise you need</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                        Skills Required
                      </label>
                      <Input
                        id="skills"
                        name="skills"
                        placeholder="e.g. 'React, JavaScript, CSS'"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate multiple skills with commas
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border rounded-md p-3 cursor-pointer hover:border-upwork-green hover:bg-gray-50">
                          <h3 className="font-medium">Entry Level</h3>
                          <p className="text-xs text-gray-500">
                            Looking for someone new to this field
                          </p>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer hover:border-upwork-green hover:bg-gray-50 border-upwork-green bg-gray-50">
                          <h3 className="font-medium">Intermediate</h3>
                          <p className="text-xs text-gray-500">
                            Looking for substantial experience
                          </p>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer hover:border-upwork-green hover:bg-gray-50">
                          <h3 className="font-medium">Expert</h3>
                          <p className="text-xs text-gray-500">
                            Looking for deep expertise
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => goToTab("basic")}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => goToTab("budget")}
                    >
                      Continue
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="budget">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Timeline</CardTitle>
                    <CardDescription>Set your budget and timeline expectations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                        Budget (USD)
                      </label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        placeholder="e.g. '500'"
                        min="5"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Duration
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-upwork-green focus:border-upwork-green sm:text-sm rounded-md"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      >
                        <option value="Less than 1 month">Less than 1 month</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => goToTab("details")}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Posting..." : "Post Job"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
