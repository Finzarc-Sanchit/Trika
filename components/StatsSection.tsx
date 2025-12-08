import React from 'react';

interface StatsProps {
  openBooking: () => void;
}

const StatsSection: React.FC<StatsProps> = ({ openBooking }) => {
  return (
    <section className="pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Image */}
        <div className="relative h-[500px] w-full bg-stone-100 overflow-hidden">
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
          <div>
            <span className="font-serif text-4xl md:text-5xl text-[#A69C8E]">Stress Reduction</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Nervous system reset through sound frequencies</p>
          </div>

          {/* Stat 2 */}
          <div>
            <span className="font-serif text-4xl md:text-5xl text-[#A69C8E]">Emotional Balance</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Releasing emotional blocks and finding harmony</p>
          </div>

          {/* Stat 3 */}
          <div>
            <span className="font-serif text-4xl md:text-5xl text-[#A69C8E]">Better Sleep</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Deep relaxation through brainwave entrainment</p>
          </div>

          {/* Stat 4 */}
          <div>
            <span className="font-serif text-4xl md:text-5xl text-[#A69C8E]">Clearer Mind</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Enhanced mental clarity and focus</p>
          </div>

          {/* Stat 5 */}
          <div>
            <span className="font-serif text-4xl md:text-5xl text-[#A69C8E]">Energetic Alignment</span>
            <p className="text-stone-500 mt-2 text-lg tracking-wide">Deep relaxation & expanded awareness</p>
          </div>

          <div className="pt-4">
            <button
              onClick={openBooking}
              className="text-[#2A2624] font-medium text-lg border-b border-[#2A2624] pb-1 hover:text-stone-600 hover:border-stone-400 transition-all"
            >
              Book A Session
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;