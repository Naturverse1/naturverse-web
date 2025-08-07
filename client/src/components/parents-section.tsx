import naturverseLogo from "@/assets/turian_media_logo_transparent.png";

export function ParentsSection() {
  const safetyFeatures = [
    {
      icon: "🔒",
      title: "100% Kid-Safe",
      description: "Carefully curated content with no inappropriate material"
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "COPPA Compliant", 
      description: "Full compliance with children's privacy protection laws"
    },
    {
      icon: "💳",
      title: "Parental Control",
      description: "Optional crypto wallet with complete parental oversight"
    }
  ];

  return (
    <section id="parents" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 relative overflow-hidden">
      {/* Gentle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-full opacity-40 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in" data-testid="parents-header">
          {/* Small logo for branding */}
          <div className="mb-6">
            <img 
              src={naturverseLogo} 
              alt="The Naturverse™" 
              className="w-16 h-16 mx-auto object-contain opacity-80"
            />
          </div>
          <h2 className="font-fredoka text-5xl md:text-7xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent mb-8" data-testid="text-parents-title">
            👪 For Parents
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed font-medium mb-8" data-testid="text-parents-main">
              100% kid-safe. COPPA compliant. Optional crypto wallet with parental control.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed" data-testid="text-parents-description">
              We've created a secure, educational environment where your children can explore, learn, and grow while you maintain complete peace of mind.
            </p>
          </div>
        </div>

        {/* Safety features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16" data-testid="safety-features">
          {safetyFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-200 animate-fade-in-stagger"
              style={{ animationDelay: `${index * 0.2}s` }}
              data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300" data-testid={`icon-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {feature.icon}
                </div>
                <h3 className="font-fredoka text-2xl text-gray-800 mb-4" data-testid={`title-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg" data-testid={`description-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}\n        </div>

        {/* Trust indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center animate-fade-in-delay" data-testid="trust-section">
          <h3 className="font-fredoka text-3xl md:text-4xl mb-6" data-testid="text-trust-title">
            Trusted by Families Worldwide
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto" data-testid="text-trust-description">
            Join thousands of parents who trust The Naturverse™ to provide safe, educational, and magical learning experiences for their children.
          </p>
          
          {/* Parent testimonial placeholder */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="text-4xl mb-4">💭</div>
            <p className="text-lg italic mb-4 opacity-90">
              "Finally, a platform where my kids can learn about technology and nature safely. The parental controls give me complete peace of mind!"
            </p>
            <p className="text-sm opacity-80">- Sarah M., Parent of 2</p>
          </div>

          {/* Contact for parents */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-lg opacity-90 mb-4">Questions? We're here to help!</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="bg-white/10 px-4 py-2 rounded-full">📧 parents@naturverse.com</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">📞 1-800-NATURE</span>
              <span className="bg-white/10 px-4 py-2 rounded-full">💬 Live Chat Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}