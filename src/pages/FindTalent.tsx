
import Layout from "@/components/upwork/Layout";
import TalentHeroSection from "@/components/upwork/talent/HeroSection";
import TrustedBy from "@/components/upwork/TrustedBy";
import HowItWorks from "@/components/upwork/HowItWorks";
import Categories from "@/components/upwork/Categories";
import Testimonials from "@/components/upwork/Testimonials";
import CTASection from "@/components/upwork/CTASection";

const FindTalent = () => {
  return (
    <Layout>
      <TalentHeroSection />
      <TrustedBy />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default FindTalent;
