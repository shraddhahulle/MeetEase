
import React, { useEffect, useRef } from 'react';
import GradientButton from '../ui/GradientButton';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!heroRef.current) return;
    
    const createGradientBlur = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      // Remove existing gradient blurs
      const existingBlurs = heroRef.current.querySelectorAll('.gradient-blur');
      if (existingBlurs.length > 5) {
        existingBlurs[0].remove();
      }
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const blur = document.createElement('div');
      blur.classList.add('gradient-blur');
      blur.style.left = `${x}px`;
      blur.style.top = `${y}px`;
      
      heroRef.current.appendChild(blur);
      
      setTimeout(() => {
        blur.remove();
      }, 4000);
    };
    
    const heroElement = heroRef.current;
    heroElement.addEventListener('mousemove', createGradientBlur);
    
    return () => {
      heroElement.removeEventListener('mousemove', createGradientBlur);
    };
  }, []);

  return (
    <div className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24" ref={heroRef}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-meetease-blue/5 to-transparent" />
        <div className="absolute left-0 top-1/4 w-72 h-72 bg-meetease-purple/20 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-meetease-blue/20 rounded-full filter blur-3xl opacity-20" />
      </div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block animate-fade-in">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-meetease-blue/10 text-meetease-blue text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-meetease-blue mr-2"></span>
              AI-Powered Scheduling
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:200ms] max-w-4xl">
            <span className="text-gradient">Schedule Meetings</span> with 
            <br className="hidden md:block" /> the Power of AI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-in [animation-delay:400ms]">
            MeetEase uses artificial intelligence to find the perfect meeting time for everyone, 
            eliminating scheduling headaches and boosting productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:600ms]">
            <GradientButton size="lg" className="group">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 inline-block transition-transform group-hover:translate-x-1" />
            </GradientButton>
            <GradientButton size="lg" variant="outline">
              Watch Demo
            </GradientButton>
          </div>
          
          <div className="mt-16 w-full max-w-5xl mx-auto animate-fade-in [animation-delay:800ms]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-20 bottom-0" />
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80" 
                alt="MeetEase Dashboard" 
                className="w-full h-auto object-cover rounded-t-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
