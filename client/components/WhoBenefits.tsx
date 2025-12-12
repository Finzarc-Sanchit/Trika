import React from 'react';

const WhoBenefits: React.FC = () => {
  const benefits = [
    'Stress, Anxiety, Burnout',
    'Sleep Issues',
    'Emotional imbalance',
    'Chronic Pain, Inflammation',
    'Hormonal Imbalance',
    'Seniors, students, corporates',
    'Addiction & Drugs'
  ];

  return (
    <section className="py-24 bg-[#F3F0EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">For Everyone</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8">WHO <span className="text-[#967BB6]">BENEFITS</span></h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Sound healing offers <span className="text-[#967BB6] font-semibold">profound benefits</span> for a wide range of individuals seeking <span className="text-[#967BB6] font-semibold">holistic wellness and transformation</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/50 hover:-translate-y-1 group cursor-pointer"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-[#967BB6] text-xl mt-1 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">✦</span>
                <span className="text-stone-700 font-light text-lg transition-colors duration-300 group-hover:text-[#967BB6]">{benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoBenefits;

