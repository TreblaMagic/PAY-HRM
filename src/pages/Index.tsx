
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Counters from '@/components/Counters';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Partners from '@/components/Partners';

const Index = () => {
  // Apply smooth scrolling behavior to the entire document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#004052]">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <Partners />
        
        <section id="services" className="bg-white">
          <Services />
        </section>
        
        <Counters />
        
        <section id="testimonials" className="bg-white">
          <Testimonials />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
