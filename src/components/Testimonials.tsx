
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "BTEL's VoIP solutions have transformed our customer service operations. The call quality is exceptional and their support team is always available to assist.",
    author: "Sarah Johnson",
    position: "Operations Director, TechCorp Ltd"
  },
  {
    id: 2,
    quote: "Implementing BTEL's Network-as-a-Service has significantly improved our network reliability and reduced our IT maintenance costs by over 30%.",
    author: "Michael Chen",
    position: "CTO, Global Finance Group"
  },
  {
    id: 3,
    quote: "The banking integration solutions provided by BTEL have streamlined our payment processing systems, resulting in faster transactions and improved customer satisfaction.",
    author: "Amara Okafor",
    position: "Head of Digital Banking, Premier Bank"
  },
  {
    id: 4,
    quote: "As a telecom partner, BTEL's interconnect exchange services have been instrumental in expanding our network reach across multiple African countries.",
    author: "Daniel Mwangi",
    position: "Network Operations Manager, East Africa Telecom"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full p-6">
                    <div className="bg-white rounded-xl p-8 shadow-lg">
                      <svg 
                        className="w-10 h-10 text-accent/30 mb-4" 
                        fill="currentColor" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 8v6a6 6 0 01-6 6H2v4c4.41 0 8-3.59 8-8h2v-8H4v8h2l-.0001-2A4.0001 4.0001 0 0010 8zm18-8v6a6 6 0 01-6 6h-2v4c4.41 0 8-3.59 8-8h2v-8h-8v8h2l-.0001-2A4.0001 4.0001 0 0028 0z"></path>
                      </svg>
                      <p className="text-lg md:text-xl text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-primary font-bold text-xl">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-primary">{testimonial.author}</h4>
                          <p className="text-sm text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-primary hover:text-accent transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg text-primary hover:text-accent transition-colors z-10"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-accent' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
