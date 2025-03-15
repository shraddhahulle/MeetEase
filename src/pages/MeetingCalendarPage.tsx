
import React from 'react';
import { Card } from '@/components/ui/card';
import { FullCalendar } from '@/components/calendar/FullCalendar';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MeetingCalendarPage: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meeting Calendar</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} />
          <span>New Meeting</span>
        </Button>
      </div>
      <Card className="p-4 shadow-lg">
        <FullCalendar />
      </Card>
      
      {/* Floating Add Meeting Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-indigo-600 hover:bg-indigo-700">
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default MeetingCalendarPage;
