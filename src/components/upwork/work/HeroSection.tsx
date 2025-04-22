
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WorkHeroSection = () => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 lg:w-full">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Find your next</span>
                <span className="block text-upwork-green">remote opportunity</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                Browse jobs posted by clients from around the world. Find projects that match your skills and experience.
                Work anytime, anywhere.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-upwork-green hover:bg-upwork-darkGreen md:py-4 md:text-lg md:px-10">
                    Find Jobs
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-upwork-green border-upwork-green hover:text-white hover:bg-upwork-green md:py-4 md:text-lg md:px-10">
                    Create Profile
                  </Button>
                </div>
              </div>
            </div>
          </main>
          
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img 
              className="h-56 w-full object-cover object-center sm:h-72 md:h-96 lg:w-full lg:h-full" 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
              alt="Remote work" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkHeroSection;
