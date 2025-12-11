import React from 'react';

interface ContactActionsProps {
  email?: string;
  emailSubject?: string;
  emailBody?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

const ContactActions: React.FC<ContactActionsProps> = ({
  email = 'oniarazdan4@gmail.com',
  emailSubject = 'Connect with Trika Sound Sanctuary',
  emailBody = 'Hello, I would like to connect with you about sound healing services.',
  whatsappNumber = '919152482025',
  whatsappMessage = 'Hello, I would like to connect with you about sound healing services.',
}) => {
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = () => {
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    openInNewTab(mailtoUrl);
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    let whatsappUrl = 'https://wa.me/';
    
    // Add phone number if provided
    if (whatsappNumber) {
      // Remove any spaces, dashes, or plus signs from phone number
      const cleanNumber = whatsappNumber.replace(/[\s\-+]/g, '');
      whatsappUrl = `https://wa.me/${cleanNumber}`;
    }
    
    whatsappUrl += `?text=${encodedMessage}`;
    openInNewTab(whatsappUrl);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleEmailClick}
        className="px-4 py-2 border border-stone-400 rounded hover:bg-stone-700 hover:text-white transition-colors text-sm font-light"
      >
        Email Us
      </button>
      <button
        onClick={handleWhatsAppClick}
        className="px-4 py-2 border border-stone-400 rounded hover:bg-stone-700 hover:text-white transition-colors text-sm font-light"
      >
        WhatsApp
      </button>
    </div>
  );
};

export default ContactActions;

