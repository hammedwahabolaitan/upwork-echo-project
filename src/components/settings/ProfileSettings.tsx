
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "@/utils/toastUtils";
import { User } from "@/contexts/auth/types";

interface ProfileSettingsProps {
  user: User;
  updateUser: (userData: Partial<User>) => void;
}

const ProfileSettings = ({ user, updateUser }: ProfileSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    hourlyRate: user?.hourlyRate || 0
  });

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, we would call an API to update the profile
      updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        hourlyRate: profileData.hourlyRate
      });
      
      toast("Profile updated", {
        description: "Your profile has been successfully updated"
      });
    } catch (error) {
      toast("Error updating profile", {
        description: "There was an error updating your profile"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? Number(value) : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <Input 
                id="firstName" 
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                placeholder="First Name" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <Input 
                id="lastName" 
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                placeholder="Last Name" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input 
              id="email" 
              type="email" 
              defaultValue={user.email} 
              placeholder="Email"
              disabled
            />
            <p className="text-xs text-gray-500">Contact support to change your email address</p>
          </div>
          
          {user.accountType === 'freelancer' && (
            <div className="space-y-2">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
              <Input 
                id="hourlyRate" 
                name="hourlyRate"
                type="number" 
                value={profileData.hourlyRate}
                onChange={handleChange}
                placeholder="Hourly Rate"
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleProfileUpdate} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
