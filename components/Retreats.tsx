
import React from 'react';

interface RetreatsProps {
  openBooking: () => void;
}

const Retreats: React.FC<RetreatsProps> = ({ openBooking }) => {
  return (
    <section id="retreat" className="py-24 bg-[#EBE7E0]/30 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EBE7E0]/20 -skew-x-12 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="mb-16 text-center md:text-left">
           <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">Immersive Experiences</span>
           <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917]">Upcoming Retreats</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Retreat Image */}
          <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden">
            <img 
              src="/assets/images/image15.jpeg" 
              alt="Retreat Landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest font-bold text-[#1c1917]">
              Retreats & Festivals
            </div>
          </div>

          {/* Retreat Info */}
          <div className="lg:pl-8">
            <h3 className="font-serif text-3xl md:text-4xl text-[#1c1917] mb-4">Retreats & Festivals</h3>
            <p className="text-stone-500 italic mb-8 font-serif">Transformative sound healing experiences in sacred spaces.</p>
            
            <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
              Join Sonia Razdan for immersive retreat experiences and festival appearances. These gatherings offer deep transformation through collective sound healing, combining individual and community healing spaces.
            </p>
            
            <ul className="space-y-3 mb-8 text-stone-600 font-light">
              <li className="flex items-start gap-3">
                <span className="text-[#A69C8E] text-xl">✦</span>
                <span>Group Sound Baths & Collective Healing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#A69C8E] text-xl">✦</span>
                <span>Gong Mastery Sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#A69C8E] text-xl">✦</span>
                <span>Curated Sound Journeys</span>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-[#A69C8E] text-xl">✦</span>
                <span>Trauma-Sensitive Approach</span>
              </li>
            </ul>

            <div className="flex items-center gap-8">
              <button 
                onClick={openBooking}
                className="bg-[#1c1917] text-white px-8 py-4 text-sm tracking-widest hover:bg-stone-700 transition-colors"
              >
                Book Your Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Retreats;
