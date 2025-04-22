
import Layout from "@/components/upwork/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import TrustedBy from "@/components/upwork/TrustedBy";
import CTASection from "@/components/upwork/CTASection";

const Enterprise = () => {
  return (
    <Layout>
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-upwork-green">Upwork Enterprise</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              A powerful hiring solution for growing businesses
            </p>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <div className="relative">
              <img 
                className="rounded-lg shadow-xl" 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Enterprise team meeting" 
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Access expert talent to drive your business forward</h2>
              <p className="mt-4 text-lg text-gray-500">
                Upwork Enterprise combines technology with recruiting, compliance, and talent solutions for your evolving business needs.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Quality talent sourcing</strong> — Get matched with pre-vetted talent that meets your specific requirements
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Compliance and security</strong> — Mitigate risks with classification, international compliance, and security support
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Expert guidance</strong> — Get strategic insights from our talent specialists
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Button className="inline-flex items-center justify-center text-white bg-upwork-green hover:bg-upwork-darkGreen">
                  Talk to an Expert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TrustedBy />
      
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Solutions for your business needs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Scale your workforce with flexible talent solutions
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Access specialized talent</h3>
              <p className="mt-2 text-base text-gray-500">
                Find skill-based talent that's verified for quality and matched to your needs.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Flexibility at scale</h3>
              <p className="mt-2 text-base text-gray-500">
                Adapt to changing business needs with flexible access to talent when you need it.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Enterprise-grade security</h3>
              <p className="mt-2 text-base text-gray-500">
                Work with talent securely with enhanced security features and control.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Talk to an Upwork Enterprise expert today to learn how we can help your business.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <Button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-upwork-green hover:bg-upwork-darkGreen">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
      
      <CTASection />
    </Layout>
  );
};

export default Enterprise;
