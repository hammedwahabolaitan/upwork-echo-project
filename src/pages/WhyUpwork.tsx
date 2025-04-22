
import Layout from "@/components/upwork/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import TrustedBy from "@/components/upwork/TrustedBy";
import Testimonials from "@/components/upwork/Testimonials";
import CTASection from "@/components/upwork/CTASection";

const WhyUpwork = () => {
  return (
    <Layout>
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Why businesses choose <span className="text-upwork-green">Upwork</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Upwork is the leading talent platform where businesses find and work with independent professionals.
            </p>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Find talent your way</h2>
              <p className="mt-4 text-lg text-gray-500">
                Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Post a job and hire a pro</strong> — Access expert talent to fill your skill gaps
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Browse and buy projects</strong> — Shop pre-scoped projects from experts
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-upwork-green" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong className="font-medium text-gray-700">Let us find you talent</strong> — Get matched with talent by a technical recruiter
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <Button className="inline-flex items-center justify-center text-white bg-upwork-green hover:bg-upwork-darkGreen">
                  Find Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                className="rounded-lg shadow-xl" 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Business team working together" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <TrustedBy />
      
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Benefits of working with Upwork
            </h2>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Proof of quality</h3>
              <p className="mt-2 text-base text-gray-500">
                Check any pro's work samples, client reviews, and identity verification.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No cost until you hire</h3>
              <p className="mt-2 text-base text-gray-500">
                Interview potential fits for your job, negotiate rates, and only pay for work you approve.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Safe and secure</h3>
              <p className="mt-2 text-base text-gray-500">
                Focus on your work knowing we help protect your data and privacy. We're here with 24/7 support if you need it.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default WhyUpwork;
