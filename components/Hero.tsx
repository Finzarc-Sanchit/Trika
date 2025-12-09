
import React from 'react';

interface HeroProps {
  openBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ openBooking }) => {
  return (
    <section id="home" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Image Section (Left) */}
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-t-[10rem] aspect-[4/5] lg:aspect-[4/5] bg-stone-200">
             {/* High quality image of a woman playing crystal bowls */}
            <img 
              src="/assets/images/image30.jpeg" 
              alt="Woman playing crystal singing bowls" 
              className="w-full h-full object-cover grayscale-[10%] contrast-[95%]"
            />
            {/* Soft decorative circle */}
            <div className="absolute -z-10 top-20 -left-20 w-64 h-64 bg-[#EBE7E0] rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>

        {/* Text Section (Right) */}
        <div className="lg:col-span-6 flex flex-col justify-center lg:pl-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-[#2A2624] mb-8">
            <span className="text-[#967BB6]">Healing</span> through <span className="text-[#967BB6]">sound</span>, guided by <span className="text-[#967BB6]">soul</span>.
          </h1>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={openBooking}
              className="text-[#967BB6] font-medium text-lg border-b-2 border-[#967BB6] pb-1 hover:text-[#7A5F9F] hover:border-[#7A5F9F] transition-all"
            >
              Book A Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
