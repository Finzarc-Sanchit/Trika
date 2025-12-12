
import React, { useEffect, useRef, useState } from 'react';

const Founder: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className={`py-24 px-6 md:px-12 max-w-7xl mx-auto ${isVisible ? 'animate-in fade-in' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className={`order-2 md:order-1 ${isVisible ? 'animate-in fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">The Founder</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8"><span className="text-[#967BB6]">SONIA RAZDAN</span></h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
            Founder – <span className="text-[#967BB6] font-semibold">Trika Sound Sanctuary</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
            <span className="text-[#967BB6] font-semibold">Sound Therapist</span> | <span className="text-[#967BB6] font-semibold">Gong Master</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-8">
            Sonia Razdan is a certified <span className="text-[#967BB6] font-semibold">sound healer</span> and <span className="text-[#967BB6] font-semibold">gong master</span> dedicated to healing through sound, guided by soul. She blends <span className="text-[#967BB6] font-semibold">science with spirituality</span>, offering <span className="text-[#967BB6] font-semibold">clinical organ therapy</span> and <span className="text-[#967BB6] font-semibold">trauma-sensitive</span> sound healing journeys. With expertise in <span className="text-[#967BB6] font-semibold">chakra healing</span>, <span className="text-[#967BB6] font-semibold">brainwave rebalancing</span>, and <span className="text-[#967BB6] font-semibold">energetic strengthening</span>, Sonia creates transformative experiences for individuals and communities.
          </p>
          <button className="bg-[#967BB6] text-white px-8 py-4 text-sm tracking-widest hover:bg-[#7A5F9F] transition-all duration-300 hover:shadow-lg hover:shadow-[#967BB6]/30 hover:scale-105 active:scale-95">
            Read Full Bio
          </button>
        </div>
        <div className={`order-1 md:order-2 relative ${isVisible ? 'animate-in fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="aspect-[3/4] bg-stone-200 overflow-hidden group">
            <img
              src="/assets/images/image1.jpeg"
              alt="Sonia Razdan Portrait"
              className="w-full h-full object-cover grayscale-[10%]"
            />
          </div>
          {/* Decorative graphic */}
          <div className="absolute -bottom-8 -left-8 w-full h-full border border-stone-200 -z-10 hidden md:block transition-transform duration-300 hover:scale-105"></div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
