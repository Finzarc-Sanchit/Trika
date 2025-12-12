
import React, { useEffect, useRef, useState } from 'react';

interface RetreatsProps {
  openRetreatBooking: () => void;
}

const Retreats: React.FC<RetreatsProps> = ({ openRetreatBooking }) => {
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
    <section ref={sectionRef} id="retreat" className={`py-24 bg-[#EBE7E0]/30 relative overflow-hidden ${isVisible ? 'animate-in fade-in' : 'opacity-0'}`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EBE7E0]/20 -skew-x-12 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className={`mb-16 text-center md:text-left ${isVisible ? 'animate-in fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
           <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">Immersive Experiences</span>
           <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917]">Upcoming <span className="text-[#967BB6]">Retreats</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Retreat Image */}
          <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden group">
            <img 
              src="/assets/images/image15.jpeg" 
              alt="Retreat Landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#1c1917] transition-all duration-300 group-hover:bg-white group-hover:scale-105">
              Retreats & Festivals
            </div>
          </div>

          {/* Retreat Info */}
          <div className={`lg:pl-8 ${isVisible ? 'animate-in fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h3 className="font-serif text-3xl md:text-4xl text-[#967BB6] mb-4 transition-colors duration-300 hover:text-[#7A5F9F]">Retreats & Festivals</h3>
            <p className="text-stone-500 italic mb-8 font-serif"><span className="text-[#967BB6]">Transformative</span> sound healing experiences in sacred spaces.</p>
            
            <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
              Join Sonia Razdan for <span className="text-[#967BB6] font-semibold">immersive retreat experiences</span> and festival appearances. These gatherings offer <span className="text-[#967BB6] font-semibold">deep transformation</span> through collective sound healing, combining individual and community healing spaces.
            </p>
            
            <ul className="space-y-3 mb-8 text-stone-600 font-light">
              <li className="flex items-start gap-3">
                <span className="text-[#967BB6] text-xl">✦</span>
                <span><span className="text-[#967BB6] font-semibold">Group Sound Baths</span> & Collective Healing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#967BB6] text-xl">✦</span>
                <span><span className="text-[#967BB6] font-semibold">Gong Mastery</span> Sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#967BB6] text-xl">✦</span>
                <span><span className="text-[#967BB6] font-semibold">Curated Sound Journeys</span></span>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-[#967BB6] text-xl">✦</span>
                <span><span className="text-[#967BB6] font-semibold">Trauma-Sensitive</span> Approach</span>
              </li>
            </ul>

            <div className="flex items-center gap-8">
              <button 
                onClick={openRetreatBooking}
                className="bg-[#967BB6] text-white px-8 py-4 text-sm tracking-widest hover:bg-[#7A5F9F] transition-all duration-300 hover:shadow-lg hover:shadow-[#967BB6]/30 hover:scale-105 active:scale-95"
              >
                Book A Seat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Retreats;
