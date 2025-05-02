
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SocialLogin from "@/components/auth/SocialLogin";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Get the location they were trying to access or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await login(email, password);
      // No need to manually navigate - AuthContext handles this now
    } catch (error) {
      console.error("Login error:", error);
      toast("Login failed", {
        description: error instanceof Error ? error.message : "Invalid credentials",
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link to="/signup" className="font-medium text-upwork-green hover:text-upwork-darkGreen">
                sign up if you don't have an account
              </Link>
            </p>
          </div>
          
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          <SocialLogin isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
