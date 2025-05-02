
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/utils/toastUtils";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: "client" | "freelancer";
  }) => Promise<void>;
  isLoading: boolean;
}

const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"client" | "freelancer">("client");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  const validateForm = () => {
    setValidationError("");
    
    if (!firstName.trim()) {
      setValidationError("First name is required");
      return false;
    }
    
    if (!lastName.trim()) {
      setValidationError("Last name is required");
      return false;
    }
    
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    
    if (!agreedToTerms) {
      setValidationError("You must agree to the Terms of Service and Privacy Policy");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit({
      firstName,
      lastName,
      email,
      password,
      accountType
    });
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
              First name
            </Label>
            <Input
              id="first-name"
              name="first-name"
              type="text"
              required
              className="mt-1"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
              Last name
            </Label>
            <Input
              id="last-name"
              name="last-name"
              type="text"
              required
              className="mt-1"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
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
          <p className="text-xs mt-1 text-gray-500">A confirmation email will be sent to verify your address</p>
        </div>
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              disabled={isLoading}
              className="pr-10"
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

        <div>
          <Label className="block text-sm font-medium text-gray-700">I want to</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="account-type-client"
                name="account-type"
                type="radio"
                className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300"
                checked={accountType === "client"}
                onChange={() => setAccountType("client")}
                disabled={isLoading}
              />
              <label htmlFor="account-type-client" className="ml-3 block text-sm font-medium text-gray-700">
                Hire for a project
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="account-type-freelancer"
                name="account-type"
                type="radio"
                className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300"
                checked={accountType === "freelancer"}
                onChange={() => setAccountType("freelancer")}
                disabled={isLoading}
              />
              <label htmlFor="account-type-freelancer" className="ml-3 block text-sm font-medium text-gray-700">
                Work as a freelancer
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <Checkbox
            id="agree-terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            disabled={isLoading}
            className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="agree-terms" className="text-gray-900">
            I agree to the Upwork <a href="#" className="text-upwork-green hover:text-upwork-darkGreen">Terms of Service</a> and <a href="#" className="text-upwork-green hover:text-upwork-darkGreen">Privacy Policy</a>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            We'll send you important notifications about your account and security.
          </p>
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
              Creating account...
            </div>
          ) : (
            "Create my account"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
