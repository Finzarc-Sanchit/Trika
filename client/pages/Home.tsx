import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TheProblem from '../components/TheProblem';
import Philosophy from '../components/Philosophy';
import StatsSection from '../components/StatsSection';
import Founder from '../components/Founder';
import Services from '../components/Services';
import WhoBenefits from '../components/WhoBenefits';
import WhatMakesUnique from '../components/WhatMakesUnique';
import TestimonialsSection from '../components/TestimonialsSection';
import Retreats from '../components/Retreats';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <div className="min-h-screen font-sans text-stone-800 antialiased overflow-x-hidden selection:bg-stone-200">
      <Navbar isScrolled={isScrolled} openBooking={openBooking} />

      <main>
        <Hero openBooking={openBooking} />
        <TheProblem />
        <Philosophy />
        <StatsSection openBooking={openBooking} />
        <Founder />
        <Services />
        <WhoBenefits />
        <WhatMakesUnique />
        <TestimonialsSection />
        <Retreats openBooking={openBooking} />
      </main>

      <Footer />

      {isBookingOpen && <BookingModal onClose={closeBooking} />}
    </div>
  );
};

export default Home;

