
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
      description: "Signing in to your account...",
    });
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    toast({
      title: "Getting Started",
      description: "Creating your account...",
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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
          <a href="/" className="flex items-center no-highlight">
            <AnimatedLogo />
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const sectionId = item.href.replace('#', '');
                  scrollToSection(sectionId);
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
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
                  onClick={(e) => {
                    e.preventDefault();
                    const sectionId = item.href.replace('#', '');
                    scrollToSection(sectionId);
                  }}
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
                  className="block py-2 font-medium text-cyan-600"
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
