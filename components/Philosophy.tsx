import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] leading-tight mb-6">
            WHAT IS <span className="text-[#967BB6]">SOUND HEALING</span>?
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Therapeutic use of <span className="text-[#967BB6] font-semibold">frequencies + vibrations</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light">
            Works on <strong className="text-[#967BB6]">entrainment</strong> (brain & body syncing to healing frequencies)
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mt-4">
            Not music → <span className="text-[#967BB6] font-semibold">nervous system therapy</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mt-2">
            Deep impact on <strong className="text-[#967BB6]">mind, body, emotions, energy</strong>
          </p>
        </div>
        <div className="pt-2 md:pl-10">
          <h3 className="font-serif text-3xl text-[#1c1917] mb-4">HOW IT <span className="text-[#967BB6]">WORKS</span></h3>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Body runs on <span className="text-[#967BB6] font-semibold">frequencies</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Sound influences brainwaves → <span className="text-[#967BB6] font-semibold">Theta/Delta</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Vibrations reach <span className="text-[#967BB6] font-semibold">cellular + energetic layers</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light mb-4">
            Works on <span className="text-[#967BB6] font-semibold">root cause, not symptom</span>
          </p>
          <p className="text-stone-600 leading-relaxed text-lg font-light">
            Creates <span className="text-[#967BB6] font-semibold">deep relaxation, clarity & balance</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;