import React from 'react';
import { Testimonials } from './ui/testimonials';

const testimonials = [
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'I\'m blown away by the transformative power of sound healing at Trika. The chakra therapy sessions have brought incredible balance to my life!',
    name: 'Priya Sharma',
    username: '@priyasharma',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'Sonia\'s sound healing sessions have significantly improved my well-being. The clinical organ therapy helped me manage my anxiety and stress levels remarkably!',
    name: 'Arjun Patel',
    username: '@arjunpatel',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654d0d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The organ therapy sessions at Trika have been life-changing. I\'ve noticed significant improvements in my PCOS symptoms and overall hormonal balance.',
    name: 'Ananya Reddy',
    username: '@ananyareddy',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'I love how Sonia blends science with spirituality. The trauma-sensitive approach makes me feel safe and supported throughout the healing journey.',
    name: 'Rahul Kumar',
    username: '@rahulkumar',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The New Moon sound baths at Trika are absolutely magical. Each session takes me on a deep journey of healing and transformation!',
    name: 'Meera Desai',
    username: '@meeradesai',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The corporate wellness sessions have transformed our workplace culture. Our team feels more balanced, focused, and connected.',
    name: 'Vikram Singh',
    username: '@vikramsingh',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The group sound healing sessions create such a powerful collective energy. I always leave feeling refreshed and deeply restored.',
    name: 'Kavya Nair',
    username: '@kavyanair',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'Sonia\'s expertise in gong mastery is extraordinary. The sound frequencies create profound shifts in my energy and emotional state.',
    name: 'Aditya Joshi',
    username: '@adityajoshi',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'Sonia\'s teaching workshops are exceptional. The gong and bowl learning modules are well-structured and have deepened my practice significantly.',
    name: 'Divya Iyer',
    username: '@divyaiyer',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'I appreciate the attention to detail in every sound healing session. The curated sound journeys are beautifully designed and deeply therapeutic.',
    name: 'Rohan Malhotra',
    username: '@rohanmalhotra',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The corporate wellness sessions have been a game-changer for our team. We\'ve integrated them into our monthly wellness program with great success.',
    name: 'Neha Gupta',
    username: '@nehagupta',
    social: 'https://twitter.com'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3',
    text: 'The retreats and festival sound baths are incredible experiences. The collective healing energy is palpable and transformative.',
    name: 'Siddharth Menon',
    username: '@siddharthmenon',
    social: 'https://twitter.com'
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <span className="uppercase tracking-widest text-xs font-bold text-stone-500 mb-4 block">Client Stories</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1c1917] mb-8">WHAT OUR CLIENTS SAY</h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Real experiences from people who have transformed their lives through sound healing at Trika.
          </p>
        </div>
        <Testimonials 
          testimonials={testimonials}
          title=""
          description=""
        />
      </div>
    </section>
  );
}

export default TestimonialsSection;

