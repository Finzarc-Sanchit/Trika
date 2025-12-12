import React, { useEffect, useRef, useState } from 'react';

interface StatsProps {
  openBooking: () => void;
}

const StatsSection: React.FC<StatsProps> = ({ openBooking }) => {
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
    <section ref={sectionRef} className={`pb-24 px-6 md:px-12 max-w-7xl mx-auto ${isVisible ? 'animate-in fade-in' : 'opacity-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Image */}
        <div className="relative h-[500px] w-full bg-stone-100 overflow-hidden group">
          <img
            src="/assets/images/image13.jpeg"
            alt="Sound healing instruments setup"
            className="w-full h-full object-cover object-center grayscale-[10%]"
          />
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col justify-center space-y-16 lg:pl-12">

          <div className="mb-8">
            <h3 className="font-serif text-3xl text-[#1c1917] mb-6">Outcomes</h3>
          </div>

          {/* Stat 1 */}
          <div className={isVisible ? 'animate-in fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <span className="font-serif text-4xl md:text-5xl text-[#967BB6] transition-colors duration-300 hover:text-[#7A5F9F]">Stress Reduction</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Nervous system reset through sound frequencies</p>
          </div>

          {/* Stat 2 */}
          <div className={isVisible ? 'animate-in fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <span className="font-serif text-4xl md:text-5xl text-[#967BB6] transition-colors duration-300 hover:text-[#7A5F9F]">Emotional Balance</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Releasing emotional blocks and finding harmony</p>
          </div>

          {/* Stat 3 */}
          <div className={isVisible ? 'animate-in fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <span className="font-serif text-4xl md:text-5xl text-[#967BB6] transition-colors duration-300 hover:text-[#7A5F9F]">Better Sleep</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Deep relaxation through brainwave entrainment</p>
          </div>

          {/* Stat 4 */}
          <div className={isVisible ? 'animate-in fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <span className="font-serif text-4xl md:text-5xl text-[#967BB6] transition-colors duration-300 hover:text-[#7A5F9F]">Clearer Mind</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Enhanced mental clarity and focus</p>
          </div>

          {/* Stat 5 */}
          <div className={isVisible ? 'animate-in fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <span className="font-serif text-4xl md:text-5xl text-[#967BB6] transition-colors duration-300 hover:text-[#7A5F9F]">Energetic Alignment</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Deep relaxation & expanded awareness</p>
          </div>

          <div className="pt-4">
            <button
              onClick={openBooking}
              className="text-[#967BB6] font-medium text-lg border-b-2 border-[#967BB6] pb-1 hover:text-[#7A5F9F] hover:border-[#7A5F9F] transition-all duration-300 relative group"
            >
              Book A Session
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7A5F9F] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;