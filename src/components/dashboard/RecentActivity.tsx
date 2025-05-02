
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="text-sm">
            <span className="text-gray-500">Today</span>
            <p>You received a new message</p>
          </li>
          <li className="text-sm">
            <span className="text-gray-500">Yesterday</span>
            <p>You received a proposal for "Frontend Developer"</p>
          </li>
          <li className="text-sm">
            <span className="text-gray-500">3 days ago</span>
            <p>You created a new job post</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
