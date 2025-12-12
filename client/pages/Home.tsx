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
import InquiryModal from '../components/InquiryModal';
import PaymentSessionModal from '../components/PaymentSessionModal';
import PaymentRetreatModal from '../components/PaymentRetreatModal';

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSessionBookingOpen, setIsSessionBookingOpen] = useState(false);
  const [isRetreatBookingOpen, setIsRetreatBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openInquiry = () => setIsInquiryOpen(true);
  const closeInquiry = () => setIsInquiryOpen(false);
  
  const openSessionBooking = () => setIsSessionBookingOpen(true);
  const closeSessionBooking = () => setIsSessionBookingOpen(false);
  
  const openRetreatBooking = () => setIsRetreatBookingOpen(true);
  const closeRetreatBooking = () => setIsRetreatBookingOpen(false);

  return (
    <div className="min-h-screen font-sans text-stone-800 antialiased overflow-x-hidden selection:bg-stone-200">
      <Navbar isScrolled={isScrolled} openBooking={openSessionBooking} />

      <main>
        <Hero openBooking={openSessionBooking} />
        <TheProblem />
        <Philosophy />
        <StatsSection openBooking={openSessionBooking} />
        <Founder />
        <Services openSessionBooking={openSessionBooking} />
        <WhoBenefits />
        <WhatMakesUnique />
        <TestimonialsSection />
        <Retreats openRetreatBooking={openRetreatBooking} />
      </main>

      <Footer />

      {isInquiryOpen && <InquiryModal onClose={closeInquiry} />}
      {isSessionBookingOpen && <PaymentSessionModal onClose={closeSessionBooking} />}
      {isRetreatBookingOpen && <PaymentRetreatModal onClose={closeRetreatBooking} />}
    </div>
  );
};

export default Home;

