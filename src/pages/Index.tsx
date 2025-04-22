
import Header from "@/components/upwork/Header";
import HeroSection from "@/components/upwork/HeroSection";
import TrustedBy from "@/components/upwork/TrustedBy";
import HowItWorks from "@/components/upwork/HowItWorks";
import Categories from "@/components/upwork/Categories";
import Testimonials from "@/components/upwork/Testimonials";
import CTASection from "@/components/upwork/CTASection";
import Footer from "@/components/upwork/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBy />
        <HowItWorks />
        <Categories />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
