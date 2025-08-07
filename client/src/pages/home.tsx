import { HeroSection } from "@/components/hero-section";
import { ExploreSection } from "@/components/explore-section";
import { NavigationDots } from "@/components/navigation-dots";

export default function Home() {
  const sections = ["hero", "explore"];

  const handleStartExploring = () => {
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative">
      <HeroSection onStartExploring={handleStartExploring} />
      <ExploreSection />
      <NavigationDots sections={sections} />
    </div>
  );
}
