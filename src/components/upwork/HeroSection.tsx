
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 lg:w-full">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">How work</span>
                <span className="block text-upwork-green">should work</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                Forget the old rules. You can have the best people. 
                Right now. Right here.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-upwork-green hover:bg-upwork-darkGreen md:py-4 md:text-lg md:px-10">
                    Find Talent
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-upwork-green border-upwork-green hover:text-white hover:bg-upwork-green md:py-4 md:text-lg md:px-10">
                    Find Work
                  </Button>
                </div>
              </div>
            </div>
          </main>
          
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img 
              className="h-56 w-full object-cover object-center sm:h-72 md:h-96 lg:w-full lg:h-full" 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
              alt="Person working on laptop" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
