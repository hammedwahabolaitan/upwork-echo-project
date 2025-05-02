
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import QuickStats from "./QuickStats";
import ProfileCompletion from "./ProfileCompletion";
import RecentActivity from "./RecentActivity";
import JobsList from "./JobsList";

const DashboardTabs = () => {
  const { user } = useAuth();

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        {user?.accountType === "client" ? (
          <>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="find-work">Find Work</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="proposals">My Proposals</TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStats />
          <ProfileCompletion />
          <RecentActivity />
        </div>
        <JobsList />
      </TabsContent>

      <TabsContent value="my-jobs">
        <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
        {/* My jobs content */}
      </TabsContent>

      <TabsContent value="find-work">
        <h2 className="text-2xl font-bold mb-4">Find Work</h2>
        {/* Find work content */}
      </TabsContent>

      <TabsContent value="saved">
        <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
        {/* Saved jobs content */}
      </TabsContent>

      <TabsContent value="proposals">
        <h2 className="text-2xl font-bold mb-4">
          {user?.accountType === "client" ? "Proposals Received" : "My Proposals"}
        </h2>
        {/* Proposals content */}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
