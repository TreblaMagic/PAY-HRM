import React from 'react';

const PRODUCTS = [
  {
    key: 'custody',
    title: 'VoIP & DID Solutions',
    icon: 'https://ext.same-assets.com/753208737/2465267896.svg',
    desc: 'Premium voice over IP services and direct inward dialing solutions for seamless communication across borders.',
    link: '#',
    cta: 'Find out more',
  },
  {
    key: 'interchange',
    title: 'Internet Service',
    icon: 'https://ext.same-assets.com/753208737/2465267896.svg',
    desc: 'Btel SmartNet revelages cutting-edge Cisco technology for reliable, scalable, and secure cloud-managed Internet/networks service.',
    link: '#',
    cta: 'Find out more',
  },
  {
    key: 'gateway',
    title: 'SMS and Messaging',
    icon: 'https://ext.same-assets.com/753208737/2465267896.svg',
    desc: 'Bulk SMS solutions for businesses Personal and promotional SMS packages, Integration with messaging apps for seamless communication.',
    link: '#',
    cta: 'Find out more',
  },
];

const ProductsServicesSection = () => (
  <section id="services" className="relative z-10 w-full max-w-[1150px] mx-auto flex flex-col items-center mb-14">
    {/* Background image positioned absolutely */}
    <img
      src="/assets/3.png"
      alt="Background"
      className="absolute inset-0 w-full h-full object-cover rounded-3xl"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
    <div className="w-full rounded-3xl bg-[#152945]/70 border border-[#32595e]/30 px-4 md:px-14 pt-10 pb-6 backdrop-blur-lg ring-1 ring-[#32595e]/10 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-2">Products & services</h2>
      <div className="text-[#b2c9c8] font-light mb-8 text-center max-w-[440px]">
        Discover our institution-ready solutions for all your digital asset needs
      </div>
      <div className="w-full flex flex-col md:flex-row gap-7 justify-center items-start mt-2">
        {PRODUCTS.map(product => (
          <div key={product.key} className="flex-1 max-w-xs bg-[#101f34] border border-[#295860]/25 rounded-2xl px-5 py-8 mx-auto shadow-[0_2px_16px_-2px_rgba(40,219,208,0.04)] flex flex-col items-center justify-between min-h-[285px]">
            <img src={product.icon} alt={product.title + ' icon'} className="h-11 w-11 mb-5" />
            <div className="font-medium text-lg mb-2 opacity-90">{product.title}</div>
            <div className="text-sm text-[#c2d0cf] font-light mb-6 text-center">{product.desc}</div>
            {/* <a href={product.link} className="rounded-full px-6 py-2 bg-[#3ba7a6] text-[#103134] font-semibold mt-auto transition-colors hover:bg-[#43c6b6] text-sm shadow">
              {product.cta}
            </a> */}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsServicesSection;
