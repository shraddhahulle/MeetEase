
import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import GradientButton from './GradientButton';
import { cn } from '@/lib/utils';

const meetingTimes = [
  { id: 1, time: '9:00 AM', available: true },
  { id: 2, time: '10:30 AM', available: true },
  { id: 3, time: '1:00 PM', available: true },
  { id: 4, time: '3:30 PM', available: true },
  { id: 5, time: '5:00 PM', available: false },
];

const ScheduleDemo = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  
  const days = [
    { day: 'Mon', date: '24', status: 'available' },
    { day: 'Tue', date: '25', status: 'available' },
    { day: 'Wed', date: '26', status: 'available' },
    { day: 'Thu', date: '27', status: 'available' },
    { day: 'Fri', date: '28', status: 'available' },
    { day: 'Sat', date: '29', status: 'unavailable' },
    { day: 'Sun', date: '30', status: 'unavailable' },
  ];

  const handleBookMeeting = () => {
    if (selectedDay !== null && selectedTime !== null) {
      setIsBooked(true);
      // In a real app, you would make an API call here
      console.log(`Booked: Day ${selectedDay}, Time ${selectedTime}`);
    }
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
          We've sent a confirmation to your email with all the details.
        </p>
        <GradientButton
          onClick={() => setIsBooked(false)}
          variant="outline"
        >
          Schedule Another Demo
        </GradientButton>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Schedule a Demo</h3>
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Calendar className="w-5 h-5 text-meetease-blue mr-2" />
          <h4 className="font-medium">Select a Day</h4>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div 
              key={index}
              onClick={() => day.status === 'available' ? setSelectedDay(index) : null}
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
              onClick={() => slot.available ? setSelectedTime(slot.id) : null}
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
          <h4 className="font-medium">Participants</h4>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-full bg-meetease-blue text-white flex items-center justify-center text-sm font-medium">
            You
          </div>
          <div className="w-8 h-8 rounded-full bg-meetease-purple text-white flex items-center justify-center text-sm font-medium">
            AI
          </div>
        </div>
      </div>
      
      <GradientButton
        onClick={handleBookMeeting}
        disabled={selectedDay === null || selectedTime === null}
        className="w-full"
      >
        Book My Demo
      </GradientButton>
    </div>
  );
};

export default ScheduleDemo;
