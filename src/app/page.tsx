import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ImpactStats } from "@/components/ImpactStats";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f2]">
      <Navbar />
      <HeroSection />
      <ImpactStats />
      <FeaturedProducts />
      <HowItWorks />
      <Footer />
    </main>
  );
}
