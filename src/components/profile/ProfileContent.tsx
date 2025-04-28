
import { User } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileContentProps {
  profile: User;
  isOwnProfile: boolean;
  isEditing: boolean;
}

const ProfileContent = ({ profile, isOwnProfile, isEditing }: ProfileContentProps) => {
  if (isEditing) return null;

  return (
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
  );
};

export default ProfileContent;
