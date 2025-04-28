
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/contexts/AuthContext";
import AdminNav from "./AdminNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {user?.accountType === 'admin' && <AdminNav />}
      <main className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
