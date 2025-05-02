
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

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
    
    await onSubmit(email, password);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{validationError}</span>
        </div>
      )}
      
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
  );
};

export default LoginForm;
