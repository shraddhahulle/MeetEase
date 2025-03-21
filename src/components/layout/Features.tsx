
import React from 'react';
import FeatureCard from '../ui/FeatureCard';
import { 
  Calendar, Clock, Users, Bot, Video, Bell, 
  PanelLeft, Moon, FileText, Laptop, Shield 
} from 'lucide-react';

const Features = () => {
  const features = [
  {
    title: 'AI-Powered Scheduling',
    description: 'Smart algorithm suggests optimal meeting times based on everyone\'s availability.',
    icon: Bot,
    iconColor: 'text-meetease-blue',
    action: () => suggestOptimalTimes()
  },
  {
    title: 'Calendar Integration',
    description: 'Seamlessly connects with Google Calendar, Outlook, and other platforms.',
    icon: Calendar,
    iconColor: 'text-meetease-green',
    action: () => integrateCalendars()
  },
  {
    title: 'Real-time Reminders',
    description: 'Sends timely notifications to ensure nobody misses important meetings.',
    icon: Bell,
    iconColor: 'text-meetease-orange',
    action: () => sendReminders()
  },
  {
    title: 'Responsive Dashboard',
    description: 'Beautiful interface that works perfectly on desktops, tablets, and mobile devices.',
    icon: PanelLeft,
    iconColor: 'text-meetease-purple',
    action: () => loadDashboard()
  },
  {
    title: 'Video Integration',
    description: 'One-click connections with Zoom, Google Meet, and Microsoft Teams.',
    icon: Video,
    iconColor: 'text-meetease-cyan',
    action: () => launchVideoCall()
  },
  {
    title: 'Meeting Insights',
    description: 'AI-generated meeting summaries and action items to keep teams aligned.',
    icon: FileText,
    iconColor: 'text-meetease-indigo',
    action: () => generateMeetingInsights()
  },
  {
    title: 'Dark Mode',
    description: 'Easy on the eyes with a beautiful dark theme option for night owls.',
    icon: Moon,
    iconColor: 'text-meetease-pink',
    action: () => toggleDarkMode()
  },
  {
    title: 'Secure & Private',
    description: 'Enterprise-grade security with end-to-end encryption for all your data.',
    icon: Shield,
    iconColor: 'text-meetease-red',
    action: () => enableSecurity()
  }
];

// Example functions (mocked for now)
function suggestOptimalTimes() {
  console.log('Suggesting optimal meeting times...');
}

function integrateCalendars() {
  console.log('Integrating with calendar services...');
}

function sendReminders() {
  console.log('Sending reminders...');
}

function loadDashboard() {
  console.log('Loading responsive dashboard...');
}

function launchVideoCall() {
  console.log('Launching video call...');
}

function generateMeetingInsights() {
  console.log('Generating meeting insights...');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function enableSecurity() {
  console.log('Enabling secure encryption...');
}

// Example to trigger actions
features.forEach(feature => feature.action());


  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-full">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-meetease-green/10 text-meetease-green text-sm font-medium mb-6">
              Features
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need for effortless scheduling</h2>
            
            <p className="text-muted-foreground text-lg mb-12">
              MeetEase combines powerful AI with a beautiful interface to make scheduling meetings a breeze.
              No more back-and-forth emails or calendar conflicts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  iconColor={feature.iconColor}
                  className="animate-fade-in [animation-delay:200ms]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
