
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Globe, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="w-full shadow-xl border-cyan-100 premium-card h-full transition-all duration-300 hover:shadow-cyan-200/20 dark:hover:shadow-cyan-800/20">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg pb-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 h-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={`p-5 transition-all duration-300 ${expanded ? 'max-h-[1000px]' : 'max-h-20 overflow-hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Globe size={14} className="mr-1.5" />
            <span>{timeZone}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-900/30"
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
        <div className="calendar-container w-full overflow-hidden rounded-lg border border-cyan-100 dark:border-cyan-800">
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
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                borderRadius: '100%' 
              }
            }}
          />
        </div>
        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all py-6 shadow-md shadow-cyan-500/20 rounded-xl"
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
