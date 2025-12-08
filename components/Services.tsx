import React from 'react';
import { Service } from '../types';

const services: Service[] = [
  // INDIVIDUAL
  {
    id: '1',
    title: 'Chakra Therapy',
    description: 'Balancing 7 chakras, releasing emotional blocks. Supports endocrine, hormonal, autoimmune, neurological, and emotional conditions.',
    duration: '60-90 Mins',
    price: 0,
    image: '/assets/images/image16.jpeg',
    category: 'INDIVIDUAL'
  },
  {
    id: '2',
    title: 'Organ Therapy',
    description: 'Targeted sound therapy for specific organs and systems. Works on root cause, not symptom. Ideal for anxiety, depression, PCOS, thyroid, gut issues.',
    duration: '75 Mins',
    price: 0,
    image: '/assets/images/image25.jpeg',
    category: 'INDIVIDUAL'
  },
  {
    id: '3',
    title: 'Clinical Protocols',
    description: 'Evidence-based sound healing protocols designed for specific clinical conditions and therapeutic outcomes.',
    duration: '60-90 Mins',
    price: 0,
    image: '/assets/images/image6.jpeg',
    category: 'INDIVIDUAL'
  },
  // GROUP
  {
    id: '4',
    title: 'Corporate Wellness',
    description: 'Group sound healing sessions designed for workplace wellness, stress reduction, and team building.',
    duration: '60-90 Mins',
    price: 0,
    image: '/assets/images/image12.jpeg',
    category: 'GROUP'
  },
  {
    id: '5',
    title: 'Retreats & Festivals',
    description: 'Immersive sound healing experiences for retreats and festivals. Collective field healing for deeper transformation.',
    duration: '60-90 Mins',
    price: 0,
    image: '/assets/images/image5.jpeg',
    category: 'GROUP'
  },
  {
    id: '6',
    title: 'New Moon / Full Moon Sound Baths',
    description: 'Special lunar cycle sound healing sessions for deeper energetic alignment and transformation.',
    duration: '90 Mins',
    price: 0,
    image: '/assets/images/image11.jpeg',
    category: 'GROUP'
  },
  // TEACHING
  {
    id: '7',
    title: 'Beginners\' Sound Healing Workshop',
    description: 'Learn the fundamentals of sound healing. Introduction to instruments, techniques, and the science behind sound therapy.',
    duration: '3-4 Hours',
    price: 0,
    image: '/assets/images/image36.jpeg',
    category: 'TEACHING'
  },
  {
    id: '8',
    title: 'Gong and Bowl Learning Modules',
    description: 'Comprehensive training in gong and singing bowl mastery. Advanced techniques for practitioners and enthusiasts.',
    duration: '4-6 Hours',
    price: 0,
    image: '/assets/images/image28.jpeg',
    category: 'TEACHING'
  }
];

const Services: React.FC = () => {
  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Define category order
  const categoryOrder = ['INDIVIDUAL', 'GROUP', 'TEACHING'];

  return (
    <section id="services" className="py-24 bg-[#F3F0EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">What I Offer</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8">OUR SERVICES</h2>
          <p className="text-stone-600 max-w-2xl mx-auto mb-4">
            A blend of science + spirituality. Clinical organ therapy, trauma-sensitive approach, curated sound journeys, and gong mastery.
          </p>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm">
            <strong>Supports:</strong> Endocrine, hormonal, autoimmune, neurological, emotional conditions including anxiety, depression, addictions, PCOS, thyroid, gut issues, and Alzheimer's support.
          </p>
        </div>

        <div className="space-y-16">
          {categoryOrder.map((category) => {
            const categoryServices = groupedServices[category] || [];
            if (categoryServices.length === 0) return null;

            return (
              <div key={category} id={`services-${category.toLowerCase()}`}>
                <h3 className="font-serif text-3xl md:text-4xl text-[#1c1917] mb-8 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryServices.map((service) => (
                    <div key={service.id}>
                      <div className="overflow-hidden aspect-[3/4] mb-6 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-serif text-2xl text-[#1c1917]">{service.title}</h4>
                        {service.price > 0 && <span className="text-stone-500 font-serif italic">${service.price}</span>}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed mb-4">{service.description}</p>
                      <div className="flex items-center text-xs tracking-widest uppercase text-stone-400">
                        {service.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;