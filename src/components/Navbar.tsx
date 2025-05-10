
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <span className="text-2xl font-bold text-primary">BTEL</span>
                <span className="ml-1 text-2xl font-bold text-accent">.</span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                onClick={() => scrollToSection('home')} 
                className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
              >
                Home
              </a>
              <a 
                onClick={() => scrollToSection('services')} 
                className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
              >
                Services
              </a>
              <a 
                onClick={() => scrollToSection('testimonials')} 
                className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
              >
                Testimonials
              </a>
              <a 
                onClick={() => scrollToSection('contact')} 
                className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
              >
                Contact
              </a>
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-accent hover:bg-accent/90 text-white font-medium"
              >
                Portal
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-primary p-2 focus:outline-none"
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
            <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-0 right-0 mx-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <a 
                  onClick={() => scrollToSection('home')} 
                  className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
                >
                  Home
                </a>
                <a 
                  onClick={() => scrollToSection('services')} 
                  className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
                >
                  Services
                </a>
                <a 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
                >
                  Testimonials
                </a>
                <a 
                  onClick={() => scrollToSection('contact')} 
                  className="text-primary hover:text-accent transition-colors cursor-pointer font-medium"
                >
                  Contact
                </a>
                <Button 
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-accent hover:bg-accent/90 text-white font-medium"
                >
                  Portal
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">HRM Portal Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the HRM system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="font-medium text-sm">Email</label>
              <input 
                id="email" 
                type="email" 
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your email" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="font-medium text-sm">Password</label>
              <input 
                id="password" 
                type="password" 
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your password" 
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 mt-2">Login</Button>
            <div className="text-sm text-center text-gray-500">
              <a href="#" className="text-accent hover:underline">Forgot password?</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
