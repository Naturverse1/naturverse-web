import { useEffect, useState } from "react";

interface NavigationDotsProps {
  sections: string[];
}

export function NavigationDots({ sections }: NavigationDotsProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0] || "hero");

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const updateActiveSection = () => {
      let currentSection = sections[0];
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Add intersection observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    // Fallback scroll listener
    window.addEventListener('scroll', updateActiveSection);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [sections]);

  return (
    <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block" data-testid="navigation-dots">
      <div className="space-y-4">
        {sections.map((sectionId) => (
          <button
            key={sectionId}
            onClick={() => scrollToSection(sectionId)}
            className={`w-4 h-4 rounded-full transition-all duration-300 block ${
              activeSection === sectionId
                ? 'bg-white'
                : 'bg-white/30 hover:bg-white'
            }`}
            data-testid={`nav-dot-${sectionId}`}
            aria-label={`Navigate to ${sectionId} section`}
          />
        ))}
      </div>
    </nav>
  );
}
