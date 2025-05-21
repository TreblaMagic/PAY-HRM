import React from 'react';

const PILLARS = [
  {
    title: 'Regulatory compliance',
    text: `Committed to ensuring the highest standards of regulatory compliance and implementation of robust controls, including Financial crime, Data Privacy, Travel Rule, Conduct and more`,
  },
  {
    title: 'Mobile Voice and Data Plans',
    text: `Affordable prepaid and postpaid plans, National and international calling services, High-speed mobile data packages for browsing, streaming, and downloading.`,
  },
  {
    title: 'Security & governance',
    text: `Ensuring bank-grade compliance with 24x7 cold storage availability, zero central points of compromise, and SOC 1 and ISO 27001 certification`,
  },
  {
    title: 'SIM Cards and Devices',
    text: `Regular SIM, eSIM, and multi-SIM card options, Partnered sales of mobile devices, routers, and IoT-enabled gadgets, Managed connectivity solutions tailored for corporate clients.`,
  },
];

const positions = [
  'left-0 top-0 md:left-[6%] md:top-[10%]', // Regulatory
  'right-0 top-0 md:right-[6%] md:top-[10%]', // Ecosystem
  'left-0 bottom-0 md:left-[6%] md:bottom-[10%]', // Security
  'right-0 bottom-0 md:right-[6%] md:bottom-[10%]', // Agile
];

const CustodyOrbSection = () => (
  <section id="mvno" className="relative z-0 flex flex-col items-center justify-center py-24 mt-2 mb-10 min-h-[570px] max-w-[1100px] mx-auto">
    {/* Glowing orb background */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[420px] bg-[#3ba7a6]/40 rounded-full blur-[80px] opacity-80 pointer-events-none" aria-hidden="true"></div>
    {/* Inner orb for extra glow/effect */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] h-[315px] bg-[#175f67]/60 rounded-full blur-[40px] opacity-60 pointer-events-none" aria-hidden="true"></div>
    {/* New Image */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[300px] h-[300px] flex items-center justify-center pointer-events-none">
      <img 
        src="../public/assets/2.png" 
        alt="Orb Image" 
        className="object-contain transition-transform duration-300 ease-in-out"
        style={{ transform: 'scale(3.5)' }}
      />
    </div>    
    {/* Orb center text */}
    <div className="relative text-center z-10 flex flex-col items-center justify-center h-[350px] w-full">
      <span className="text-2xl md:text-3xl lg:text-4xl font-light ">MVNO<br />Mobile Virtual <br /> Network Operator</span>
    </div>
    {/* 4 Pillar floating cards */}
    <div className="absolute inset-0 flex flex-col md:block h-full w-full z-20 pointer-events-none">
      {PILLARS.map((pillar, i) => (
        <div
          key={pillar.title}
          className={`absolute ${positions[i]} max-w-[300px] w-[92vw] md:w-[290px] bg-[#152945] border border-[#295860]/30 rounded-xl p-6 shadow-lg text-left pointer-events-auto select-none`}
          style={{ minHeight: 120 }}
        >
          <div className="font-semibold text-base mb-2 opacity-90">{pillar.title}</div>
          <div className="text-sm text-[#c2d0cf] font-light opacity-80 leading-relaxed">{pillar.text}</div>
        </div>
      ))}
    </div>
  </section>
);

export default CustodyOrbSection;
