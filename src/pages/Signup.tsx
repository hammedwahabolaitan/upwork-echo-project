
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { register, resendVerificationEmail } from "@/services";
import { toast } from "sonner";
import SignupForm from "@/components/auth/SignupForm";
import SocialLogin from "@/components/auth/SocialLogin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: "client" | "freelancer";
  }) => {
    setIsLoading(true);
    
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        accountType: data.accountType,
      });
      
      // Store the email for confirmation message
      setRegisteredEmail(data.email);
      setRegistrationCompleted(true);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    
    setResendingEmail(true);
    try {
      await resendVerificationEmail(registeredEmail);
      toast.success("Verification email sent", {
        description: "Please check your inbox (or Ethereal Email for testing)"
      });
    } catch (error) {
      toast.error("Failed to resend verification email", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {registrationCompleted ? (
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center">Verify your email</h2>
                <p className="text-gray-600 text-center mt-2">
                  We've sent a verification email to:
                </p>
                <p className="font-medium text-center">{registeredEmail}</p>
              </div>
              
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                <AlertDescription>
                  <span className="font-semibold">Test Environment:</span> For testing, verification emails are sent to Ethereal Email. 
                  Check the server console output for the email preview URL.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  Please check your inbox and click the verification link to activate your account.
                  If you don't see the email, check your spam folder.
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  variant="outline"
                  className="w-full"
                >
                  {resendingEmail ? "Sending..." : "Resend verification email"}
                </Button>
                
                <div>
                  <Link 
                    to="/login"
                    className="text-upwork-green hover:text-upwork-darkGreen font-medium"
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Or{" "}
                  <Link to="/login" className="font-medium text-upwork-green hover:text-upwork-darkGreen">
                    log in if you already have an account
                  </Link>
                </p>
              </div>
              
              <SignupForm onSubmit={handleSubmit} isLoading={isLoading} />
              <SocialLogin isLoading={isLoading} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
