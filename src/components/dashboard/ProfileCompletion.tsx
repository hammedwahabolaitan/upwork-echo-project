
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProfileCompletion = () => {
  return (
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
  );
};

export default ProfileCompletion;
