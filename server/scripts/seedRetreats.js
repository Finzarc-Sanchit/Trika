// Seed script to populate initial retreat data
import { config } from '../config/env.js';
import * as retreatService from '../models/Retreat.js';
import { connectDatabase } from '../config/database.js';

const retreats = [
  {
    name: 'Himalayan Sound Healing Retreat',
    price: 15000,
    location: 'Rishikesh',
    date: 'March 2024',
    description: 'Transformative sound healing experiences in the Himalayas.',
    duration: '3 Days',
    maxCapacity: 20,
    image: '/assets/images/image15.jpeg',
  },
  {
    name: 'Beach Sound Bath Retreat',
    price: 12000,
    location: 'Goa',
    date: 'April 2024',
    description: 'Immersive sound healing by the beach.',
    duration: '2 Days',
    maxCapacity: 15,
    image: '/assets/images/image5.jpeg',
  },
  {
    name: 'Forest Gong Journey',
    price: 18000,
    location: 'Kodaikanal',
    date: 'May 2024',
    description: 'Deep sound healing in the forest.',
    duration: '4 Days',
    maxCapacity: 25,
    image: '/assets/images/image15.jpeg',
  },
];

const seedRetreats = async () => {
  try {
    await connectDatabase();
    
    // Wait a bit for connection to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear existing retreats
    const Retreat = (await import('../models/Retreat.js')).default;
    await Retreat.deleteMany({});
    
    // Insert retreats
    for (const retreatData of retreats) {
      await retreatService.createRetreat(retreatData);
    }
    
    console.log(`✅ ${retreats.length} retreats seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding retreats:', error);
    process.exit(1);
  }
};

seedRetreats();

