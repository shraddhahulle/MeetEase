
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedLogo from '../ui/AnimatedLogo';
import GradientButton from '../ui/GradientButton';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleSignIn = () => {
    toast({
      title: "Sign In",
      description: "Sign in functionality will be available soon!",
    });
    // In a real app, this would navigate to the sign in page or open a modal
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    toast({
      title: "Getting Started",
      description: "Creating your account...",
    });
    // Simulate account creation process
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-subtle' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2 no-highlight">
            <AnimatedLogo />
            <span className="font-semibold text-xl">MeetEase</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="font-medium text-meetease-blue hover:text-meetease-blue/80 transition-colors"
            >
              Sign In
            </button>
            <GradientButton size="sm" onClick={handleGetStarted}>Get Started</GradientButton>
          </div>
          
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-card animate-fade-in">
          <div className="container mx-auto py-4 px-6">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground py-2 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t">
                <button 
                  onClick={() => {
                    handleSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block py-2 font-medium text-meetease-blue"
                >
                  Sign In
                </button>
                <div className="mt-3">
                  <GradientButton 
                    className="w-full"
                    onClick={() => {
                      handleGetStarted();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </GradientButton>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
