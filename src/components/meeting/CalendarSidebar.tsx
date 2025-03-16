
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Globe } from 'lucide-react';
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
    <Card className="w-full shadow-xl border-purple-100 premium-card">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg pb-4">
        <CardTitle className="text-xl flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Globe size={14} className="mr-1.5" />
            <span>{timeZone}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
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
        <div className="calendar-container w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            className="rounded-md border w-full pointer-events-auto max-w-none premium-calendar"
            modifiers={{
              hasNote: isDayWithNote
            }}
            modifiersStyles={{
              hasNote: { 
                fontWeight: 'bold',
                backgroundColor: 'rgba(126, 34, 206, 0.15)',
                borderRadius: '100%' 
              }
            }}
          />
        </div>
        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all py-6 shadow-md shadow-purple-500/20"
            onClick={onAddMeeting}
          >
            <Plus size={20} className="mr-2" />
            Add Meeting for {date ? format(date, 'MMM dd, yyyy') : 'Selected Date'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
