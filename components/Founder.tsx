
import React from 'react';

const Founder: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">The Founder</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8">SONIA RAZDAN</h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
            Founder – Trika Sound Sanctuary
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-6">
            Sound Therapist | Gong Master
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-8">
            Sonia Razdan is a certified sound healer and gong master dedicated to healing through sound, guided by soul. She blends science with spirituality, offering clinical organ therapy and trauma-sensitive sound healing journeys. With expertise in chakra healing, brainwave rebalancing, and energetic strengthening, Sonia creates transformative experiences for individuals and communities.
          </p>
          <button className="bg-[#1c1917] text-white px-8 py-4 text-sm tracking-widest hover:bg-stone-700 transition-colors">
            Read Full Bio
          </button>
        </div>
        <div className="order-1 md:order-2 relative">
          <div className="aspect-[3/4] bg-stone-200">
            <img
              src="/assets/images/image1.jpeg"
              alt="Sonia Razdan Portrait"
              className="w-full h-full object-cover grayscale-[10%]"
            />
          </div>
          {/* Decorative graphic */}
          <div className="absolute -bottom-8 -left-8 w-full h-full border border-stone-200 -z-10 hidden md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
