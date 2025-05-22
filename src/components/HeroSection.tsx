import React from 'react';

const LOGO_LIST = [
  {
    alt: 'NCC',
    src: '/assets/NCC.png',
    style: { height: 38, maxWidth: 120 }
  },
  {
    alt: 'MTN',
    src: '/assets/MTN.png',
    style: { height: 28, maxWidth: 70 }
  },
  {
    alt: 'Airtel',
    src: '/assets/Airtel.png',
    style: { height: 27, maxWidth: 57 }
  },
  {
    alt: '9Mobile',
    src: '/assets/9Mobile.png',
    style: { height: 38, maxWidth: 120 }
  },
  {
    alt: 'MainOne',
    src: '/assets/MainOne.png',
    style: { height: 36, maxWidth: 95 }
  },
  {
    alt: 'Effortel',
    src: '/assets/Effortel.png',
    style: { height: 26, maxWidth: 80 }
  }
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center text-center min-h-[85vh] w-full">
      <img 
            src="/assets/1.png" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover -z-5" 
          />
      {/* Orb background for depth */}
      <div
        className="pointer-events-none absolute inset-0 -top-24 w-full h-[600px] mx-auto"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-40 w-[900px] h-[380px] rounded-full bg-[#3ba7a644] blur-3xl opacity-80"
          style={{ filter: 'blur(76px)', background: 'radial-gradient(circle,rgb(59, 86, 167) 0%,rgb(16, 32, 52) 80%)' }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center mt-8 mb-7">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-4">
        Redefining Digital<br />
        Infrastructure in Africa
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed text-[#c2d0cf] mb-4">
        Leading provider of VoIP, DID solutions, and innovative telecom services empowering businesses across Africa with<br className="hidden sm:block" /> seamless connectivity.
        </p>
      </div>
      {/* Logo Bar */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mx-auto w-full max-w-3xl rounded-2xl px-4 sm:px-8 pt-4 pb-3 bg-[#152945]/80 border border-[#29686e]/50 backdrop-blur-md mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#b6e4df] mb-1 opacity-85">
            Our Partners
          </p>
          <div className="flex justify-center gap-5 flex-wrap md:gap-7 items-center pb-2 pt-1">
            {LOGO_LIST.map(logo => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                style={logo.style}
                className="object-contain grayscale-[0.1] brightness-125 opacity-90 hover:opacity-100 transition-opacity h-7 sm:h-9"
                loading="lazy"
                draggable="false"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
