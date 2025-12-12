// Seed script to populate initial session data
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import * as sessionService from '../models/Session.js';
import { connectDatabase } from '../config/database.js';

const sessions = [
  {
    value: 'chakra-therapy',
    label: 'Chakra Therapy',
    price: 2500,
    description: 'Balancing 7 chakras, releasing emotional blocks.',
    duration: '60-90 Mins',
    category: 'INDIVIDUAL',
    image: '/assets/images/image16.jpeg',
  },
  {
    value: 'organ-therapy',
    label: 'Organ Therapy',
    price: 3000,
    description: 'Targeted sound therapy for specific organs and systems.',
    duration: '75 Mins',
    category: 'INDIVIDUAL',
    image: '/assets/images/image25.jpeg',
  },
  {
    value: 'clinical-protocols',
    label: 'Clinical Protocols',
    price: 3500,
    description: 'Evidence-based sound healing protocols.',
    duration: '60-90 Mins',
    category: 'INDIVIDUAL',
    image: '/assets/images/image6.jpeg',
  },
  {
    value: 'corporate-wellness',
    label: 'Corporate Wellness',
    price: 5000,
    description: 'Group sound healing sessions for workplace wellness.',
    duration: '60-90 Mins',
    category: 'GROUP',
    image: '/assets/images/image12.jpeg',
  },
  {
    value: 'lunar-sound-baths',
    label: 'New Moon / Full Moon Sound Baths',
    price: 2000,
    description: 'Special lunar cycle sound healing sessions.',
    duration: '90 Mins',
    category: 'GROUP',
    image: '/assets/images/image11.jpeg',
  },
  {
    value: 'workshops',
    label: 'Sound Healing Workshops',
    price: 4000,
    description: 'Learn the fundamentals of sound healing.',
    duration: '3-4 Hours',
    category: 'TEACHING',
    image: '/assets/images/image36.jpeg',
  },
  {
    value: 'gong-bowl-training',
    label: 'Gong and Bowl Learning Modules',
    price: 4500,
    description: 'Comprehensive training in gong and singing bowl mastery.',
    duration: '4-6 Hours',
    category: 'TEACHING',
    image: '/assets/images/image28.jpeg',
  },
];

const seedSessions = async () => {
  try {
    await connectDatabase();
    
    // Wait a bit for connection to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear existing sessions
    const Session = (await import('../models/Session.js')).default;
    await Session.deleteMany({});
    
    // Insert sessions
    for (const sessionData of sessions) {
      await sessionService.createSession(sessionData);
    }
    
    console.log(`✅ ${sessions.length} sessions seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sessions:', error);
    process.exit(1);
  }
};

seedSessions();

