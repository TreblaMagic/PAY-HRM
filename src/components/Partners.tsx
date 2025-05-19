
import React from 'react';

const partners = [
  {
    id: 1,
    name: "MTN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/1200px-New-mtn-logo.svg.png"
  },
  {
    id: 2,
    name: "Airtel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Airtel_logo.svg/1280px-Airtel_logo.svg.png"
  },
  {
    id: 3,
    name: "GLOO",
    logo: "https://www.gloworld.com/ng/images/glo-logo.svg"
  },
  {
    id: 4,
    name: "9Mobile",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/9mobile_Logo.png/800px-9mobile_Logo.png"
  },
  {
    id: 5,
    name: "NCC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/NCC_Nigeria_logo.svg/1200px-NCC_Nigeria_logo.svg.png"
  }
];

const Partners = () => {
  return (
    <div className="partners-section w-full max-w-5xl mx-auto my-12">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-white">Our Partners</h3>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center justify-center p-2">
            <img 
              src={partner.logo} 
              alt={`${partner.name} logo`} 
              className="partner-logo object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
