
import React from 'react';
import { Card } from '@/components/ui/card';
import { FullCalendar } from '@/components/calendar/FullCalendar';

const MeetingCalendarPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Meeting Calendar</h1>
      <Card className="p-4">
        <FullCalendar />
      </Card>
    </div>
  );
};

export default MeetingCalendarPage;
