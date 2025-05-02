
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "@/utils/toastUtils";

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
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
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <Input 
              id="newPassword" 
              type="password" 
              value={passwordData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
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
  );
};

export default SecuritySettings;
