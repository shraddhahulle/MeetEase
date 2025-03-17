
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import Features from '@/components/layout/Features';
import GradientButton from '@/components/ui/GradientButton';
import { CheckCircle, ArrowRight, CalendarClock, Users, BrainCircuit, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  
  const stats = [
    { value: '150,000+', label: 'Active Users' },
    { value: '15M+', label: 'Meetings Scheduled' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const testimonials = [
    {
      content: "MeetEase has completely transformed how we schedule meetings. The AI suggestions are spot-on, and we've reduced scheduling time by 80%.",
      author: "Sarah Johnson",
      role: "Product Manager, Airbnb",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      content: "The interface is gorgeous, and the functionality is even better. Our team loves how seamless the calendar integration is.",
      author: "Michael Chen",
      role: "CTO, Dropbox",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      content: "As someone who schedules dozens of meetings weekly, MeetEase has been a game-changer. The time savings alone are worth it.",
      author: "Emma Rodriguez",
      role: "Executive Assistant, Salesforce",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals getting started with smart scheduling",
      features: [
        "5 meetings per month",
        "Google Calendar integration",
        "Basic AI scheduling",
        "Email notifications",
      ],
      cta: "Get Started",
      popular: false,
      action: () => {
        toast({
          title: "Free Plan Selected",
          description: "Setting up your free account...",
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    },
    {
      name: "Pro",
      price: "$12",
      description: "For professionals who need advanced scheduling features",
      features: [
        "Unlimited meetings",
        "All calendar integrations",
        "Advanced AI suggestions",
        "Meeting insights & summaries",
        "Custom branding",
        "Priority support",
      ],
      cta: "Start 14-Day Trial",
      popular: true,
      action: () => {
        toast({
          title: "Pro Plan Selected",
          description: "Starting your 14-day free trial...",
        });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams that need collaborative scheduling power",
      features: [
        "Everything in Pro",
        "Team scheduling",
        "Admin controls",
        "Analytics dashboard",
        "API access",
        "SSO & advanced security",
      ],
      cta: "Contact Sales",
      popular: false,
      action: () => {
        toast({
          title: "Team Plan Inquiry",
          description: "Connecting you with our sales team...",
        });
        setTimeout(() => {
          toast({
            title: "Request Received",
            description: "Our sales team will contact you shortly.",
          });
        }, 2000);
      }
    },
  ];

  const faqItems = [
    {
      question: "How does MeetEase's AI scheduling work?",
      answer: "MeetEase analyzes everyone's calendar availability, past meeting preferences, time zones, and even working hours to suggest the optimal meeting times. Our AI learns from your preferences over time, making increasingly accurate suggestions."
    },
    {
      question: "Which calendar platforms do you integrate with?",
      answer: "We integrate seamlessly with Google Calendar, Microsoft Outlook, Apple Calendar, and Zoom Scheduler. We're constantly adding more integrations based on user demand."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! MeetEase is available on iOS and Android, offering the same beautiful experience you get on desktop, optimized for mobile devices."
    },
    {
      question: "How secure is my calendar data?",
      answer: "Very secure. We use enterprise-grade encryption, never store your credentials, and only access the calendar information needed to suggest optimal meeting times. We're also SOC 2 Type II compliant."
    },
    {
      question: "Can I customize the meeting invitation emails?",
      answer: "Absolutely! Pro and Team plans offer fully customizable email templates, including your own branding, custom messages, and even personalized elements for each recipient."
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Stats Section */}
        <section className="py-16 bg-cyan-500/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Features />
        
        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-sm font-medium mb-6">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, smart, and efficient</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                MeetEase streamlines the entire meeting process from start to finish.
                Here's how our platform makes scheduling effortless.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
              {[
                {
                  icon: CalendarClock,
                  title: "Sync Calendars",
                  description: "Connect your calendars for instant availability detection across platforms."
                },
                {
                  icon: Users,
                  title: "Add Participants",
                  description: "Invite team members, clients, or anyone else you need in your meeting."
                },
                {
                  icon: BrainCircuit,
                  title: "AI Suggestion",
                  description: "Our AI analyzes everyone's availability and suggests optimal times."
                },
                {
                  icon: Globe,
                  title: "Book & Notify",
                  description: "Confirm the time and automated invitations are sent to all participants."
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full transform -translate-x-1 -translate-y-1"></div>
                    <div className="relative w-16 h-16 rounded-full bg-white border border-cyan-500/20 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-cyan-500" />
                    </div>
                    {index < 3 && (
                      <div className="absolute top-1/2 left-full w-full h-px bg-cyan-500/20 hidden lg:block"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 bg-cyan-500/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 text-sm font-medium mb-6">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Loved by teams everywhere</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See what our users have to say about how MeetEase has transformed their scheduling experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="premium-card p-6 relative overflow-hidden hover-scale"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full transform translate-x-8 -translate-y-8"></div>
                  <blockquote className="text-foreground mb-6 relative z-10">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-6">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the plan that works best for you and your team. All plans include a 14-day free trial.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`premium-card p-8 relative hover-scale ${
                    plan.popular ? 'border-cyan-500 shadow-[0_0_0_2px_rgba(6,182,212,0.1)]' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && (
                      <span className="text-muted-foreground ml-2">/month</span>
                    )}
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <GradientButton 
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                      onClick={plan.action}
                    >
                      {plan.cta}
                    </GradientButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ */}
        <section id="faq" className="py-20 bg-cyan-500/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-medium mb-6">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently asked questions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to know about MeetEase and how it can transform your scheduling process.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y">
              {faqItems.map((item, index) => (
                <details key={index} className="group py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <span className="relative ml-4 flex-shrink-0 w-5 h-5">
                      <span className="absolute inset-0 flex items-center justify-center transition-opacity group-open:opacity-0">
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-open:opacity-100">
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </span>
                  </summary>
                  <div className="mt-4 text-muted-foreground">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center premium-card p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to transform your scheduling experience?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of teams and individuals who have already discovered the power of AI-driven scheduling with MeetEase.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <GradientButton 
                    size="lg" 
                    className="group"
                    onClick={() => {
                      toast({
                        title: "Getting Started",
                        description: "Setting up your free account...",
                      });
                      setTimeout(() => navigate('/dashboard'), 1500);
                    }}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 inline-block transition-transform group-hover:translate-x-1" />
                  </GradientButton>
                  <GradientButton 
                    size="lg" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Demo Scheduled",
                        description: "A member of our team will contact you shortly to schedule a personalized demo.",
                      });
                    }}
                  >
                    Book a Demo
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 text-white mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-xl">MeetEase</span>
              </div>
              <p className="text-white/60 mb-4">
                The AI-powered scheduling platform that saves time and eliminates scheduling headaches.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Integrations', 'Pricing', 'Demo', 'Security'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: item,
                          description: `Navigating to ${item.toLowerCase()} page...`,
                        });
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Blog', 'Guides', 'Support', 'API', 'Status'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: item,
                          description: `Navigating to ${item.toLowerCase()} page...`,
                        });
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Careers', 'Press', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: item,
                          description: `Navigating to ${item.toLowerCase()} page...`,
                        });
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-white/60 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "Legal Information",
                          description: `Viewing ${item.toLowerCase()} information...`,
                        });
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 mb-4 md:mb-0">
              © {new Date().getFullYear()} MeetEase. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: social,
                      description: `Opening ${social} in a new tab...`,
                    });
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
