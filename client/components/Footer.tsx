import React from 'react';

const Footer: React.FC = () => {
  const whatsappMessage = 'Hello, I would like to connect with you about sound healing services.';
  const emailSubject = 'Connect with Trika Sound Sanctuary';
  const emailBody = 'Hello, I would like to connect with you about sound healing services.';

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const emailLink = `mailto:oniarazdan4@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    openInNewTab(emailLink);
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>, phoneNumber: string = '919152482025') => {
    e.preventDefault();
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    openInNewTab(whatsappLink);
  };

  const emailLink = `mailto:oniarazdan4@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const whatsappLink1 = `https://wa.me/919152482025?text=${encodeURIComponent(whatsappMessage)}`;
  const whatsappLink2 = `https://wa.me/919821082025?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="bg-[#2A2624] text-[#EBE7E0] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <a href="#home" className="flex items-center gap-3 mb-4">
            <img
              src="/assets/images/logo.png"
              alt="Trika Sound Sanctuary Logo"
              className="h-12 w-auto"
            />
          </a>
          <span className="font-serif text-3xl font-bold tracking-widest uppercase block"><span className="text-[#967BB6]">TRIKA</span></span>
          <p className="text-sm text-stone-400 mt-2 font-light"><span className="text-[#967BB6]">Sound Sanctuary</span></p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Explore</h4>
          <ul className="space-y-3 font-light text-sm text-stone-400">
            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Retreats</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shop</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Connect</h4>
          <ul className="space-y-3 font-light text-sm text-stone-400">
            <li><a href="https://www.instagram.com/trika_yoga" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram: @TRIKA_YOGA</a></li>
            <li><a href={emailLink} onClick={handleEmailClick} className="hover:text-white transition-colors">Email</a></li>
            <li><a href={whatsappLink1} onClick={(e) => handleWhatsAppClick(e, '919152482025')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Contact</h4>
          <address className="not-italic font-light text-sm text-stone-400 space-y-2">
            <p><a href={whatsappLink1} onClick={(e) => handleWhatsAppClick(e, '919152482025')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 9152482025</a></p>
            <p><a href={whatsappLink2} onClick={(e) => handleWhatsAppClick(e, '919821082025')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 9821082025</a></p>
            <p><a href={emailLink} onClick={handleEmailClick} className="hover:text-white transition-colors">oniarazdan4@gmail.com</a></p>
          </address>
          <p className="text-xs text-stone-500 mt-4">
            Book a 1:1 session, join group sound baths, explore learning opportunities, or invite me for corporate wellness.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between text-xs text-stone-500 font-light">
        <p>&copy; {new Date().getFullYear()} Trika Sound Sanctuary. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-stone-300">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;