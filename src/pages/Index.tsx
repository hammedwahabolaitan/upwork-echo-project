
import Layout from "@/components/upwork/Layout";
import HeroSection from "@/components/upwork/HeroSection";
import TrustedBy from "@/components/upwork/TrustedBy";
import HowItWorks from "@/components/upwork/HowItWorks";
import Categories from "@/components/upwork/Categories";
import Testimonials from "@/components/upwork/Testimonials";
import CTASection from "@/components/upwork/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustedBy />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
