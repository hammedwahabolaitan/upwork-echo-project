
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const QuickStats = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {user?.accountType === "client" ? (
          <div className="space-y-2">
            <p>Active Jobs: 2</p>
            <p>Total Proposals: 15</p>
            <p>Ongoing Contracts: 1</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Proposals Sent: 8</p>
            <p>Active Contracts: 1</p>
            <p>Completed Jobs: 12</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickStats;
