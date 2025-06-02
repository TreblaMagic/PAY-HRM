import React from 'react';

const contactDetails = [
  {
    label: 'Address',
    value: '77 Nelson Mandela Street Asokoro, Abuja',
    href: '#',
  },
  {
    label: 'Call us on',
    value: '0 (209) 292 2093',
    href: 'tel:02092922093',
  },
  {
    label: 'Email Here',
    value: 'connect@btel.com.ng',
    href: 'mailto:connect@btel.com.ng',
  },
];

const ArrowIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#23272F" />
    <path d="M10 8l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 bg-[#101f34] overflow-hidden">
      {/* Glowing orb background */}
      {/* <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[420px] bg-[#3ba7a6]/40 rounded-full blur-[80px] opacity-80 pointer-events-none z-0" 
        aria-hidden="true"
      /> */}
      {/* Inner orb for extra glow/effect */}
      {/* <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[315px] bg-[#175f67]/60 rounded-full blur-[40px] opacity-60 pointer-events-none z-0" 
        aria-hidden="true"
      /> */}
      <div className="relative max-w-6xl mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
          {contactDetails.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className="flex-1 bg-[#152945]/90 rounded-2xl border border-[#295860]/30 shadow-lg flex items-center justify-between p-8 min-w-[220px] max-w-full backdrop-blur-md transition-transform hover:scale-[1.03] group"
              style={{ minHeight: 120 }}
            >
              <div>
                <div className="text-sm text-[#c2d0cf] font-medium mb-2">{item.label}</div>
                <div className="text-lg md:text-xl font-semibold text-white break-words">{item.value}</div>
              </div>
              <span className="ml-4 flex-shrink-0 rounded-full bg-[#23272F] w-10 h-10 flex items-center justify-center group-hover:bg-[#3ba7a6] transition-colors">
                <ArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 