import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from '@/components/auth/AuthForm';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'MVNO', href: '#mvno' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setIsMobileMenuOpen(false);
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? 'bg-[#101f34]/80 border-b border-[#32595e]/40 backdrop-blur-[6px]' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between gap-6 max-w-[1500px] mx-auto px-6 py-2 h-20">
          {/* Logo */}
          <a href="#hero" onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }} className="flex items-center gap-2 shrink-0">
          <img
            alt="Btel logo"
            src="../public/assets/Bottom Logo1.png"
            className="h-9 w-auto"
            style={{ filter: 'brightness(90%)' }}
          />
        </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center gap-2 justify-center">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href.replace('#', ''));
                }}
                className="mx-2 text-sm font-medium tracking-wide text-white hover:text-[#3ba7a6] transition-colors relative group"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Portal Button */}
          <div className="flex items-center hidden md:block">
            {user ? (
              <Link to="/dashboard">
                <Button 
                  className="ml-3 px-5 py-2 rounded-full bg-[#1f3f6e] text-[#f3f3f3] font-semibold text-sm shadow hover:bg-[#152945] transition-colors"
                  style={{ letterSpacing: '0.02em' }}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className="ml-3 px-5 py-2 rounded-full bg-[#1f3f6e] text-[#f3f3f3] font-semibold text-sm shadow hover:bg-[#152945] transition-colors"
                style={{ letterSpacing: '0.02em' }}
              >
                Portal
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#101f34] border-t border-[#32595e]/40 backdrop-blur-[6px]">
            <div className="flex flex-col space-y-4 p-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href.replace('#', ''));
                  }}
                  className="text-sm font-medium tracking-wide text-white hover:text-[#3ba7a6] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {user ? (
                <Link to="/dashboard">
                  <Button 
                    className="w-full px-5 py-2 rounded-full bg-[#1f3f6e] text-[#f3f3f3] font-semibold text-sm shadow hover:bg-[#152945] transition-colors"
                    style={{ letterSpacing: '0.02em' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-5 py-2 rounded-full bg-[#1f3f6e] text-[#f3f3f3] font-semibold text-sm shadow hover:bg-[#152945] transition-colors"
                  style={{ letterSpacing: '0.02em' }}
                >
                  Portal
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <AuthForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
