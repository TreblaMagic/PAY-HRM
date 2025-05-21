import React from 'react';

const FOOTER_LINKS = [
  {
    heading: 'Company',
    links: [
      { title: 'Home', href: '#hero' },
      { title: 'Services', href: '#services' },
      { title: 'MVNO', href: '#mvno' },
      { title: 'Contact', href: '#contact' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { title: 'Internet', href: '#services' },
      { title: 'Voice', href: '#services' },
      { title: 'SMS', href: '#services' },
      { title: 'Data', href: '#services' },
      { title: 'Solutions', href: '#services' },
    ],
  },
  {
    heading: 'Clients',
    links: [
      { title: 'MTN', href: 'https://www.mtn.ng/' },
      { title: 'Airtel', href: 'https://www.airtel.com.ng/' },
      { title: '9Mobile', href: 'https://9mobile.com.ng/' },
      { title: 'MainOne', href: 'https://mainone.net/' },
      { title: 'Effortel', href: 'https://www.effortel.com/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { title: 'SmartNet', href: '#' },
    ],
  },
  {
    heading: 'Governance',
    links: [
      { title: 'Nigerian Communications Commission', href: 'https://ncc.gov.ng/' },
    ],
  },
];

const FooterSection = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#152945] border-t border-[#315458]/20 pb-0 pt-12 mt-10">
      <div className="max-w-[1500px] mx-auto px-6 flex flex-col md:flex-row gap-10 md:gap-6 py-3">
        <div className="flex-[1.5] flex items-start pt-1">
          <img
            src="../public/assets/Bottom Logo.png"
            alt="Btel logo"
            className="h-20 w-auto mb-4 mr-2"
            style={{ filter: 'brightness(90%)'}}
          />
        </div>
        <div className="flex-[6] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-7">
          {FOOTER_LINKS.map(col => (
            <div key={col.heading} className="mb-7 md:mb-0">
              <div className="font-semibold text-sm uppercase tracking-wider text-[#9ec7c3] mb-3 opacity-80 select-none">{col.heading}</div>
              <ul>
                {col.links.map(link => (
                  <li key={link.title} className="mb-1.5">
                    <a 
                      href={link.href} 
                      className="text-[#dee6e7] text-xs opacity-90 hover:text-[#3ba7a6] transition-colors"
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          handleScroll(e, link.href);
                        }
                      }}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between border-t border-[#315458]/15 pt-5 pb-7 text-xs text-[#618b94]">
        <span>&copy; 2025 Briclinks Africa Plc. All rights reserved.</span>
        <span>Branding & Website by Albert Adams</span>
      </div>
    </footer>
  );
};

export default FooterSection;
