
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-upwork-green">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to start working?</span>
          <span className="block text-white">Join the world's work marketplace today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button asChild className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-upwork-green bg-white hover:bg-gray-100">
              <Link to="/find-talent">Find Talent</Link>
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button asChild variant="outline" className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-upwork-darkGreen">
              <Link to="/find-work">Find Work</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
