
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { cn } from '../lib/utils';

interface NavbarProps {
  isScrolled: boolean;
  openBooking: () => void;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Retreat', href: '#retreat' },
  { label: 'Stories', href: '#testimonials' },
];

const serviceCategories = [
  {
    title: 'Individual',
    description: 'One-on-one sound healing sessions. Chakra therapy, organ therapy, and clinical protocols for personal transformation.',
    href: '#services-individual'
  },
  {
    title: 'Group',
    description: 'Collective healing experiences for teams and communities. Corporate wellness, retreats, and lunar cycle sound baths.',
    href: '#services-group'
  },
  {
    title: 'Teaching',
    description: 'Learn the art and science of sound healing. Workshops and training modules for all levels.',
    href: '#services-teaching'
  },
];

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'auto'
    });
  }
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; description: string; }
>(({ className, title, description, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-2 rounded-md p-3 no-underline outline-none transition-colors hover:bg-stone-50 hover:text-stone-900 focus:bg-stone-50 focus:text-stone-900",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-tight text-[#1c1917]">{title}</div>
          <p className="text-sm leading-relaxed text-stone-600 mt-1">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navbar: React.FC<NavbarProps> = ({ isScrolled, openBooking }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-[#FDFBF9] py-4 shadow-sm'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 z-[70] relative">
          <a href="#home" className="flex items-center gap-3">
            <img
              src="/assets/images/logo.png"
              alt="Trika Sound Sanctuary Logo"
              className="h-10 w-auto"
            />
            <span className="font-serif text-2xl tracking-widest font-bold text-ajna-dark uppercase hidden sm:block">
              TRIKA
            </span>
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide"
            >
              {item.label}
            </a>
          ))}

          {/* Services Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                    "h-auto py-0 px-0"
                  )}
                >
                  Sound Healing Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md transition-colors relative overflow-hidden"
                          href="#services"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#services');
                          }}
                        >
                          <img
                            src="/assets/images/image12.jpeg"
                            alt="Sound healing"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
                          <div className="mb-2 mt-4 text-lg font-serif font-medium text-white relative z-10">
                            TRIKA
                          </div>
                          <p className="text-sm leading-tight text-white/90 relative z-10">
                            Beautifully designed sound healing services built with science and spirituality. Clinical organ therapy, trauma-sensitive approach, curated sound journeys, and gong mastery.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {serviceCategories.map((category) => (
                      <ListItem
                        key={category.title}
                        title={category.title}
                        description={category.description}
                        href={category.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(category.href);
                        }}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          <button
            onClick={openBooking}
            className="bg-[#967BB6] text-white px-6 py-2.5 text-sm font-medium tracking-wider hover:bg-[#7A5F9F] transition-colors"
          >
            Book A Session
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden z-[70] text-stone-800 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FDFBF9] z-[60] flex flex-col justify-center items-center transition-all duration-500 ease-out overflow-hidden ${isMobileMenuOpen
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-full'
          }`}
      >
        <div className="flex flex-col space-y-6 text-center">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-stone-800 hover:text-stone-500"
            >
              {item.label}
            </a>
          ))}

          {/* Services in Mobile Menu */}
          <div className="flex flex-col space-y-3 mt-2">
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className="text-2xl font-serif text-stone-800 hover:text-stone-500 flex items-center justify-center gap-2"
            >
              Sound Healing Services
              <ChevronDown size={20} className={`transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isServicesDropdownOpen && (
              <div className="flex flex-col space-y-2 pl-4">
                {serviceCategories.map((category) => (
                  <a
                    key={category.title}
                    href={category.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(category.href);
                      setIsMobileMenuOpen(false);
                      setIsServicesDropdownOpen(false);
                    }}
                    className="text-lg font-serif text-stone-600 hover:text-stone-800"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              openBooking();
              setIsMobileMenuOpen(false);
            }}
            className="mt-8 text-lg underline decoration-1 underline-offset-4"
          >
            Book A Session
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
