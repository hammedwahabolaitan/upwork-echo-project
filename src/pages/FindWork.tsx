
import Layout from "@/components/upwork/Layout";
import WorkHeroSection from "@/components/upwork/work/HeroSection";
import TrustedBy from "@/components/upwork/TrustedBy";
import Categories from "@/components/upwork/Categories";
import Testimonials from "@/components/upwork/Testimonials";
import CTASection from "@/components/upwork/CTASection";

const FindWork = () => {
  return (
    <Layout>
      <WorkHeroSection />
      <TrustedBy />
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why freelancers choose Upwork
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Upwork makes it easy to connect with clients and begin doing great work.
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Find opportunities for every stage of your career</h3>
              <p className="mt-2 text-base text-gray-500">
                From entry-level to expert positions, find the right opportunity for your experience level.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Control when, where, and how you work</h3>
              <p className="mt-2 text-base text-gray-500">
                Choose the projects that interest you, work on your terms, and build your ideal career.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Explore different ways to earn</h3>
              <p className="mt-2 text-base text-gray-500">
                From hourly projects to fixed-price work, get paid securely and on time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Categories />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default FindWork;
