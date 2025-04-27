
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/utils/toastUtils";
import { getProfile, updateProfile, User } from "@/services/api";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
    hourlyRate: "",
  });

  const isOwnProfile = !id || (currentUser && id === currentUser.id.toString());
  const userId = id ? parseInt(id) : currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const data = await getProfile(userId);
        
        // Map the snake_case field names from API to camelCase for our component
        const mappedData = {
          id: data.id,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email,
          accountType: data.account_type,
          bio: data.bio || "",
          skills: data.skills || "",
          hourlyRate: data.hourly_rate
        };
        
        setProfile(mappedData);
        
        // Initialize form data
        setFormData({
          firstName: mappedData.firstName,
          lastName: mappedData.lastName,
          bio: mappedData.bio || "",
          skills: mappedData.skills || "",
          hourlyRate: mappedData.hourlyRate?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast("Error loading profile", {
          description: "Failed to load profile"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isOwnProfile) {
      toast("Access denied", {
        description: "You can only update your own profile"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      
      // Update local profile state
      setProfile({
        ...profile!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        skills: formData.skills,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      });
      
      setIsEditing(false);
      
      toast("Profile updated", {
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Error updating profile", {
        description: "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upwork-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p>The profile you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                  {profile.firstName?.charAt(0) || "?"}{profile.lastName?.charAt(0) || "?"}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {profile.firstName || ""} {profile.lastName || ""}
                    </h1>
                    <p className="text-gray-600 mt-1 capitalize">
                      {profile.accountType || ""} {profile.accountType === 'freelancer' && profile.hourlyRate && `• $${profile.hourlyRate}/hr`}
                    </p>
                  </div>
                  
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  )}
                </div>
                
                {profile.bio && !isEditing && (
                  <div className="mt-4">
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}
                
                {profile.skills && !isEditing && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.split(",").map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell clients about yourself..."
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {profile.accountType === 'freelancer' && (
                    <>
                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                          Skills
                        </label>
                        <Input
                          id="skills"
                          name="skills"
                          placeholder="e.g. 'React, JavaScript, CSS'"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Separate multiple skills with commas
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                          Hourly Rate (USD)
                        </label>
                        <Input
                          id="hourlyRate"
                          name="hourlyRate"
                          type="number"
                          placeholder="e.g. '25'"
                          min="5"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
          
          {/* Profile Content */}
          {!isEditing && (
            <Tabs defaultValue="overview">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {profile.accountType === 'freelancer' ? (
                  <>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="work-history">Work History</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>About {profile.firstName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.bio ? (
                      <p>{profile.bio}</p>
                    ) : (
                      <p className="text-gray-500 italic">No bio provided yet.</p>
                    )}
                    
                    {profile.accountType === 'freelancer' && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Skills</h3>
                        {profile.skills ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.split(",").map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-gray-100">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No skills listed yet.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 italic">No portfolio items yet.</p>
                    {isOwnProfile && (
                      <Button className="mt-4" variant="outline">
                        Add Portfolio Item
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="work-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Work History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 italic">No work history yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>Posted Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 italic">No jobs posted yet.</p>
                    {isOwnProfile && (
                      <Button className="mt-4" asChild>
                        <a href="/post-job">Post a Job</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 italic">No reviews yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
