
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SocialLogin from "@/components/auth/SocialLogin";
import { verifyEmail, resendVerificationEmail, requestPasswordReset } from "@/services/auth";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<null | 'success' | 'error'>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('verify');

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle email verification if token is present
  useEffect(() => {
    if (verificationToken) {
      const verifyUserEmail = async () => {
        setIsLoading(true);
        try {
          await verifyEmail(verificationToken);
          setVerificationStatus('success');
          toast.success("Email verification successful", {
            description: "You can now log in to your account"
          });
        } catch (error) {
          setVerificationStatus('error');
          toast.error("Email verification failed", {
            description: "The verification link may have expired or is invalid"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      verifyUserEmail();
    }
  }, [verificationToken]);

  // Get the location they were trying to access or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await login(email, password);
      // No need to manually navigate - AuthContext handles this now
    } catch (error) {
      console.error("Login error:", error);
      
      // Check if this is an email verification error
      if (error instanceof Error && 
          error.message.includes("verify your email")) {
        setNeedsVerification(true);
        setUnverifiedEmail(email);
        toast.error("Email not verified", {
          description: "Please verify your email before logging in"
        });
      } else {
        toast.error("Login failed", {
          description: error instanceof Error ? error.message : "Invalid credentials"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Email required", {
        description: "Please enter your email address"
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(resetEmail);
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      toast.error("Failed to send reset email", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    
    setIsLoading(true);
    try {
      await resendVerificationEmail(unverifiedEmail);
    } catch (error) {
      toast.error("Failed to resend verification email", {
        description: error instanceof Error ? error.message : "Please try again later"
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
          
          {verificationStatus === 'success' && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Email Verified!</AlertTitle>
              <AlertDescription>
                Your email has been successfully verified. You can now log in.
              </AlertDescription>
            </Alert>
          )}
          
          {verificationStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                The verification link may have expired or is invalid.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-white underline ml-1"
                  onClick={() => setNeedsVerification(true)}
                >
                  Resend verification email
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {needsVerification ? (
            <div className="bg-white rounded-lg shadow-sm space-y-6">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-center">Verify your email</h2>
                <p className="text-gray-600 text-center mt-2">
                  You need to verify your email address before logging in:
                </p>
                <p className="font-medium text-center">{unverifiedEmail}</p>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  Please check your inbox and click the verification link to activate your account.
                  If you don't see the email, check your spam folder.
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full"
                >
                  Resend verification email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNeedsVerification(false)}
                  className="w-full"
                >
                  Back to login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <LoginForm 
                onSubmit={handleLogin} 
                isLoading={isLoading}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
              <SocialLogin isLoading={isLoading} />
            </>
          )}
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                required
                type="email"
              />
            </div>
            
            <DialogFooter className="sm:justify-end mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForgotPassword(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Login;
