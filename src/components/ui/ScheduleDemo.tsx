
import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, Mail, CalendarDays, Globe } from 'lucide-react';
import GradientButton from './GradientButton';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

const meetingTimes = [
  { id: 1, time: '9:00 AM', available: true },
  { id: 2, time: '10:30 AM', available: true },
  { id: 3, time: '1:00 PM', available: true },
  { id: 4, time: '3:30 PM', available: true },
  { id: 5, time: '5:00 PM', available: false },
];

// Current month dates for the calendar
const getCurrentMonthDays = () => {
  const days = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  
  // Get current day of week (0-6, 0 is Sunday)
  const dayOfWeek = now.getDay();
  
  // Calculate the Monday of this week
  const monday = new Date(now);
  monday.setDate(currentDay - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  // Generate 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    
    // Weekend check
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    days.push({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.getDay() === 0 ? 6 : date.getDay() - 1],
      date: date.getDate().toString(),
      status: isWeekend ? 'unavailable' : 'available',
      fullDate: date.toISOString().split('T')[0]
    });
  }
  
  return days;
};

const ScheduleDemo = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [calendarProvider, setCalendarProvider] = useState<string | null>(null);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const days = getCurrentMonthDays();

  const handleCalendarConnect = (provider: string) => {
    // Simulate OAuth flow
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setCalendarProvider(provider);
      setIsCalendarConnected(true);
      setIsSubmitting(false);
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${provider} calendar.`,
      });
    }, 1500);
  };

  const handleBookMeeting = () => {
    if (selectedDay === null || selectedTime === null) {
      toast({
        title: "Error",
        description: "Please select a day and time for your meeting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsBooked(true);
      setIsSubmitting(false);
      
      // Log meeting details (in a real app, you would save to database)
      const selectedDate = days[selectedDay].fullDate;
      const selectedTimeSlot = meetingTimes.find(t => t.id === selectedTime)?.time;
      console.log(`Booked: ${selectedDate} at ${selectedTimeSlot}, Calendar: ${calendarProvider || 'None'}, Name: ${name}, Email: ${email}`);
      
      toast({
        title: "Success!",
        description: "Your demo has been scheduled successfully!",
      });
    }, 2000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleScheduleAnother = () => {
    setIsBooked(false);
    setSelectedDay(null);
    setSelectedTime(null);
    setEmail('');
    setName('');
  };

  const handleStartFreeTrial = () => {
    toast({
      title: "Free Trial Started",
      description: "Welcome to MeetEase! Your 14-day free trial has begun.",
    });
    
    // Redirect to dashboard (in a real app)
    // For now, we'll just simulate this with a toast
    setTimeout(() => {
      toast({
        title: "Redirecting...",
        description: "Taking you to your new dashboard.",
      });
    }, 1500);
  };

  if (isBooked) {
    return (
      <div className="premium-card p-8 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-meetease-green/10 p-4">
            <CheckCircle className="w-12 h-12 text-meetease-green" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-2">Your Demo is Scheduled!</h3>
        <p className="text-muted-foreground mb-6">
          We've sent a confirmation to {email} with all the details.
          {calendarProvider && (
            <span className="block mt-2">
              The meeting has been added to your {calendarProvider} calendar.
            </span>
          )}
        </p>
        <div className="space-y-4">
          <GradientButton
            onClick={handleScheduleAnother}
            variant="outline"
            className="w-full"
          >
            Schedule Another Demo
          </GradientButton>
          
          <GradientButton
            onClick={handleStartFreeTrial}
            className="w-full"
          >
            Start Free Trial Now
          </GradientButton>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Schedule a Demo</h3>
      
      {!isCalendarConnected && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <CalendarDays className="w-5 h-5 text-meetease-blue mr-2" />
            <h4 className="font-medium">Connect your calendar</h4>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Connect your calendar to see availability and automatically add the meeting.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCalendarConnect('Google')}
              className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              <Globe className="w-5 h-5 text-red-500" />
              <span>{isSubmitting ? 'Connecting...' : 'Google Calendar'}</span>
            </button>
            <button
              onClick={() => handleCalendarConnect('Outlook')}
              className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <span>{isSubmitting ? 'Connecting...' : 'Outlook'}</span>
            </button>
          </div>
        </div>
      )}
      
      {isCalendarConnected && (
        <div className="mb-4 p-2 bg-meetease-blue/10 rounded-lg flex items-center">
          <CalendarDays className="w-5 h-5 text-meetease-blue mr-2" />
          <span className="text-sm">
            Connected to {calendarProvider} Calendar
          </span>
          <button
            onClick={() => setIsCalendarConnected(false)}
            className="ml-auto text-xs text-meetease-blue hover:underline"
          >
            Change
          </button>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Calendar className="w-5 h-5 text-meetease-blue mr-2" />
          <h4 className="font-medium">Select a Day</h4>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div 
              key={index}
              onClick={() => day.status === 'available' && !isSubmitting ? setSelectedDay(index) : null}
              className={cn(
                'p-2 rounded-lg text-center cursor-pointer transition-all',
                day.status === 'available' 
                  ? 'hover:bg-meetease-blue/10' 
                  : 'opacity-40 cursor-not-allowed',
                selectedDay === index && 'bg-meetease-blue text-white'
              )}
            >
              <div className="text-sm font-medium">{day.day}</div>
              <div className="text-lg">{day.date}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Clock className="w-5 h-5 text-meetease-blue mr-2" />
          <h4 className="font-medium">Select a Time</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {meetingTimes.map(slot => (
            <div 
              key={slot.id}
              onClick={() => slot.available && !isSubmitting ? setSelectedTime(slot.id) : null}
              className={cn(
                'p-3 rounded-lg text-center border transition-all',
                slot.available 
                  ? 'hover:border-meetease-blue cursor-pointer' 
                  : 'opacity-40 cursor-not-allowed',
                selectedTime === slot.id 
                  ? 'border-meetease-blue bg-meetease-blue/10' 
                  : 'border-gray-200'
              )}
            >
              {slot.time}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Users className="w-5 h-5 text-meetease-blue mr-2" />
          <h4 className="font-medium">Your Information</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="text-sm text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="w-full p-2 border rounded-md mt-1"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md mt-1" 
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      
      <GradientButton
        onClick={handleBookMeeting}
        disabled={selectedDay === null || selectedTime === null || !email || !name || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Booking...' : 'Book My Demo'}
      </GradientButton>
    </div>
  );
};

export default ScheduleDemo;
