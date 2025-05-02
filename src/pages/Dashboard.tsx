
import Layout from "@/components/upwork/Layout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <DashboardHeader />
        <DashboardTabs />
      </div>
    </Layout>
  );
};

export default Dashboard;
