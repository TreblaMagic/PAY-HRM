import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductServicesSection from '@/components/ProductServicesSection';
import CustodyOrbSection from '@/components/CustodyOrbSection';
import ContactSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#101f34] text-[#dae5e5]">
      <Navbar />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <ProductServicesSection />
        <CustodyOrbSection />
        <ContactSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default Index;
