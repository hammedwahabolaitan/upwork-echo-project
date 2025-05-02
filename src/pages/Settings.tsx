
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/upwork/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/utils/toastUtils";
import { updateProfile } from "@/services";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    jobAlerts: true,
    proposalUpdates: true,
    directMessages: true,
    marketingEmails: false
  });
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast("Passwords don't match", {
        description: "Please ensure your new password and confirmation match"
      });
      setLoading(false);
      return;
    }
    
    // In a real application, we would call an API to change the password
    // For now, we'll just simulate it with a toast
    setTimeout(() => {
      setLoading(false);
      toast("Password updated", {
        description: "Your password has been successfully updated"
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 1000);
  };
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast("Notification settings updated", {
      description: `${key} notifications ${notificationSettings[key] ? "disabled" : "enabled"}`
    });
  };
  
  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmed) {
      // In a real app, we would call an API to delete the account
      toast("Account deletion initiated", {
        description: "Your account will be deleted within 24 hours"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={user.firstName} 
                        placeholder="First Name" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={user.lastName} 
                        placeholder="Last Name" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        defaultValue={user.hourlyRate} 
                        placeholder="Hourly Rate"
                      />
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast("Profile updated", { description: "Your profile has been updated" })}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Alerts</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications when new jobs match your skills
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.jobAlerts} 
                    onCheckedChange={() => handleNotificationChange('jobAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Proposal Updates</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications about your submitted proposals
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.proposalUpdates} 
                    onCheckedChange={() => handleNotificationChange('proposalUpdates')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Direct Messages</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications for new direct messages
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.directMessages} 
                    onCheckedChange={() => handleNotificationChange('directMessages')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Receive promotional emails and newsletters
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails} 
                    onCheckedChange={() => handleNotificationChange('marketingEmails')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-center">
                    Connect your payment methods to receive payments or pay for services
                  </p>
                </div>
                
                <Button onClick={() => toast("Feature coming soon", { description: "Payment integration will be available soon" })}>
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
