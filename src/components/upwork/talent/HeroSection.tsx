
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TalentHeroSection = () => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 lg:w-full">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Hire the best</span>
                <span className="block text-upwork-green">freelancers for any job</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                Access expert talent to fill your skill gaps and accomplish your business goals. 
                Choose from skilled professionals across the globe.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-upwork-green hover:bg-upwork-darkGreen md:py-4 md:text-lg md:px-10">
                    Post a Job
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-upwork-green border-upwork-green hover:text-white hover:bg-upwork-green md:py-4 md:text-lg md:px-10">
                    Browse Talent
                  </Button>
                </div>
              </div>
            </div>
          </main>
          
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img 
              className="h-56 w-full object-cover object-center sm:h-72 md:h-96 lg:w-full lg:h-full" 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Hiring talent" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentHeroSection;
