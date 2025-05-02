
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/utils/toastUtils";

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    jobAlerts: true,
    proposalUpdates: true,
    directMessages: true,
    marketingEmails: false
  });

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast("Notification settings updated", {
      description: `${key} notifications ${notificationSettings[key] ? "disabled" : "enabled"}`
    });
  };

  return (
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
  );
};

export default NotificationSettings;
