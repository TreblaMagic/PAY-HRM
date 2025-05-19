
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from '@/components/auth/AuthForm';

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
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#002A3A]/90 shadow-md py-2 backdrop-blur-md' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">BTEL</span>
                <span className="ml-1 text-2xl font-bold text-[#00D1B2]">.</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                onClick={() => scrollToSection('home')} 
                className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
              >
                Home
              </a>
              <a 
                onClick={() => scrollToSection('services')} 
                className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
              >
                Services
              </a>
              <a 
                onClick={() => scrollToSection('testimonials')} 
                className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
              >
                Testimonials
              </a>
              <a 
                onClick={() => scrollToSection('contact')} 
                className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
              >
                Contact
              </a>
              {user ? (
                <Link to="/dashboard">
                  <Button 
                    className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-white font-medium"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-white font-medium"
                >
                  Portal
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 focus:outline-none"
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
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-[#002A3A] rounded-lg shadow-lg p-4 absolute left-0 right-0 mx-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <a 
                  onClick={() => scrollToSection('home')} 
                  className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
                >
                  Home
                </a>
                <a 
                  onClick={() => scrollToSection('services')} 
                  className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
                >
                  Services
                </a>
                <a 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
                >
                  Testimonials
                </a>
                <a 
                  onClick={() => scrollToSection('contact')} 
                  className="text-white hover:text-[#00D1B2] transition-colors cursor-pointer font-medium"
                >
                  Contact
                </a>
                {user ? (
                  <Link to="/dashboard">
                    <Button 
                      className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-white font-medium"
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
                    className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-white font-medium"
                  >
                    Portal
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

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
