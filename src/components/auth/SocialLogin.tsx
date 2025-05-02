
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialLoginProps {
  isLoading: boolean;
}

const SocialLogin = ({ isLoading }: SocialLoginProps) => {
  return (
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
  );
};

export default SocialLogin;
