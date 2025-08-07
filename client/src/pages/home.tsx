import { HeroSection } from "@/components/hero-section";
import { CharactersSection } from "@/components/characters-section";
import { LearningSection } from "@/components/learning-section";
import { ParentsSection } from "@/components/parents-section";
import { NavigationDots } from "@/components/navigation-dots";

export default function Home() {
  const sections = ["hero", "characters", "learning", "parents"];

  const handleStartExploring = () => {
    const exploreSection = document.getElementById('characters');
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
      <CharactersSection />
      <LearningSection />
      <ParentsSection />
      <NavigationDots sections={sections} />
    </div>
  );
}
