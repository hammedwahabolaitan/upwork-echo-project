
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import Layout from "@/components/upwork/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PaymentSettings from "@/components/settings/PaymentSettings";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }

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
            <ProfileSettings user={user} updateUser={updateUser} />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
