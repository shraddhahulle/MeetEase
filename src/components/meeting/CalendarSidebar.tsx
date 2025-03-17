
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
    <Card className="w-full shadow-xl border-yellow-100 bg-yellow-50/80 premium-card h-full transition-all duration-300 hover:shadow-yellow-200/20 dark:hover:shadow-yellow-800/20 dark:bg-yellow-900/30 dark:border-yellow-800/50">
      <CardHeader className="bg-gradient-to-r from-yellow-400 to-amber-300 text-gray-800 rounded-t-lg pb-4">
        <CardTitle className="text-xl flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Globe size={14} className="mr-1.5" />
            <span>{timeZone}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/30"
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
        <div className="calendar-container w-full overflow-hidden rounded-lg border border-yellow-100 dark:border-yellow-800 bg-white dark:bg-gray-800">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            className="rounded-md w-full pointer-events-auto max-w-none premium-calendar"
            modifiers={{
              hasNote: isDayWithNote
            }}
            modifiersStyles={{
              hasNote: { 
                fontWeight: 'bold',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '100%' 
              }
            }}
          />
        </div>
        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-800 hover:from-amber-500 hover:to-yellow-400 transition-all py-6 shadow-md shadow-amber-500/20 rounded-xl"
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
