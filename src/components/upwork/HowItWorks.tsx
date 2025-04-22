
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Post a job",
      description: "Create a job post in minutes and start receiving proposals from talented freelancers."
    },
    {
      title: "Review offers",
      description: "Compare freelancer proposals, reviews, and portfolios to find the perfect match."
    },
    {
      title: "Collaborate easily",
      description: "Use Upwork's platform to chat, share files, and track project milestones."
    },
    {
      title: "Payment simplified",
      description: "Pay only for approved work and release payments securely through Upwork."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-upwork-green font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to work together
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Connect with the world's largest network of freelancers and get work done in just four steps.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-upwork-green text-white">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{step.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {step.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="mt-10 text-center">
          <a href="#" className="inline-flex items-center text-upwork-green hover:text-upwork-darkGreen font-medium">
            Learn more about how we work
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
