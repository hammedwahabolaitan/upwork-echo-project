
import { useState } from "react";
import { Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/services/auth";
import { toast } from "sonner";

interface EmailVerificationFormProps {
  email: string;
  onBackToLogin: () => void;
}

const EmailVerificationForm = ({ email, onBackToLogin }: EmailVerificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      toast.error("Failed to resend verification email", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm space-y-6">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center">Verify your email</h2>
        <p className="text-gray-600 text-center mt-2">
          You need to verify your email address before logging in:
        </p>
        <p className="font-medium text-center">{email}</p>
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
          onClick={onBackToLogin}
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
