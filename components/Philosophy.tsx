import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] leading-tight mb-6">
            WHAT IS SOUND HEALING?
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Therapeutic use of frequencies + vibrations
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light">
            Works on <strong>entrainment</strong> (brain & body syncing to healing frequencies)
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mt-4">
            Not music → nervous system therapy
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mt-2">
            Deep impact on <strong>mind, body, emotions, energy</strong>
          </p>
        </div>
        <div className="pt-2 md:pl-10">
          <h3 className="font-serif text-3xl text-[#1c1917] mb-4">HOW IT WORKS</h3>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Body runs on frequencies
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Sound influences brainwaves → Theta/Delta
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Vibrations reach cellular + energetic layers
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Works on root cause, not symptom
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light">
            Creates deep relaxation, clarity & balance
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;