
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  onForgotPassword?: () => void;
}

const LoginForm = ({ onSubmit, isLoading, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <div>
          <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-upwork-green hover:text-upwork-darkGreen"
              >
                Forgot your password?
              </button>
            )}
          </div>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="mt-1 pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
