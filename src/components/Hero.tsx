
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Network nodes and connections
    const particlesArray: Particle[] = [];
    const numberOfParticles = window.innerWidth > 768 ? 100 : 50;
    const connectionDistance = window.innerWidth > 768 ? 150 : 100;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Boundary checking
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00D1B2';
        ctx.fill();
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 209, 178, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section id="home" className="hero-section min-h-screen flex items-center">
      <div className="hero-overlay"></div>
      <div className="hero-blob top-[20%] right-[10%]"></div>
      <div className="hero-blob bottom-[20%] left-[10%]"></div>
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      <div className="container mx-auto px-4 md:px-6 z-10 py-20">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 animate-fade-up">
            Redefining Digital Infrastructure in Africa
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fade-up animate-delay-200">
            Leading provider of VoIP, DID solutions, and innovative telecom services 
            empowering businesses across Africa with seamless connectivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
            <Button 
              className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-white font-medium"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Partner with Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
