
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/utils/toastUtils";
import { Spinner } from "@/components/ui/spinner";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast("Please agree to the terms", {
        description: "You must agree to the Terms of Service and Privacy Policy"
      });
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
      <div className="rounded-md shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
              First name
            </label>
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
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
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
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1"
            placeholder="Password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">I want to</label>
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

      <div className="flex items-center">
        <Checkbox
          id="agree-terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          disabled={isLoading}
          className="h-4 w-4 text-upwork-green focus:ring-upwork-green border-gray-300 rounded"
        />
        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
          I agree to the Upwork <a href="#" className="text-upwork-green hover:text-upwork-darkGreen">Terms of Service</a> and <a href="#" className="text-upwork-green hover:text-upwork-darkGreen">Privacy Policy</a>
        </label>
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
