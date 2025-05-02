
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/upwork/Layout";
import { register } from "@/services";
import { toast } from "@/utils/toastUtils";
import SignupForm from "@/components/auth/SignupForm";
import SocialLogin from "@/components/auth/SocialLogin";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      
      toast("Registration successful", {
        description: "Your account has been created. Please log in."
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast("Registration failed", {
        description: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
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
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
