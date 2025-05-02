
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
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

  const validateForm = () => {
    setValidationError("");
    
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
          
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{validationError}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-address">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-upwork-green hover:text-upwork-darkGreen">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-upwork-green hover:bg-upwork-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-upwork-green"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Spinner className="w-4 h-4 mr-2 border-2 border-t-2 border-white" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => toast.info("Google login is coming soon")}
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => toast.info("Apple login is coming soon")}
              >
                Apple
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
