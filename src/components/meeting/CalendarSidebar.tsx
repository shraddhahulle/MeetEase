
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CalendarSidebarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onAddMeeting: () => void;
  timeZone: string;
  isDayWithNote: (day: Date) => boolean;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  date,
  onDateSelect,
  onAddMeeting,
  timeZone,
  isDayWithNote
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Timezone: {timeZone}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              toast({
                title: "Timezone Updated",
                description: `Calendar now shows times in ${userTimeZone}`,
              });
            }}
          >
            Auto-detect
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          className="rounded-md border pointer-events-auto"
          modifiers={{
            hasNote: isDayWithNote
          }}
          modifiersStyles={{
            hasNote: { 
              fontWeight: 'bold',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '100%' 
            }
          }}
        />
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onAddMeeting}
          >
            <Plus size={16} className="mr-2" />
            Add Meeting for {date ? format(date, 'MMM dd, yyyy') : 'Selected Date'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
