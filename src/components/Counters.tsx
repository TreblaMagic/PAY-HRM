
import React, { useState, useEffect, useRef } from 'react';

type CounterProps = {
  end: number;
  suffix?: string;
  duration?: number;
};

const Counter = ({ end, suffix = '', duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Counters = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 animate-counter-up">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
              <Counter end={500} suffix="+" />
            </div>
            <p className="text-lg font-medium">Clients Served</p>
          </div>
          
          <div className="p-6 animate-counter-up" style={{ animationDelay: '200ms' }}>
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
              <Counter end={99} suffix=".9%" />
            </div>
            <p className="text-lg font-medium">Uptime Guarantee</p>
          </div>
          
          <div className="p-6 animate-counter-up" style={{ animationDelay: '400ms' }}>
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
              <Counter end={24} suffix="/7" />
            </div>
            <p className="text-lg font-medium">Technical Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counters;
