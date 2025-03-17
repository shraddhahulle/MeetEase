
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarNote } from './types';
import MeetingForm from './MeetingForm';
import MeetingDetails from './MeetingDetails';
import CalendarSidebar from './CalendarSidebar';
import { handleExportMeetingToPDF, isDayWithNote } from './meetingUtils';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

interface CalendarViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  timeZone: string;
  calendarNotes: CalendarNote[];
  selectedDateNotes: CalendarNote[];
  onAddNote: (note: CalendarNote) => void;
  onDeleteNote: (index: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  setDate,
  showForm,
  setShowForm,
  timeZone,
  calendarNotes,
  selectedDateNotes,
  onAddNote,
  onDeleteNote
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className={`grid grid-cols-1 ${expanded ? 'md:grid-cols-1' : 'md:grid-cols-3'} gap-4 md:gap-6 transition-all duration-300`}>
        <div className={expanded ? 'hidden md:block' : 'md:col-span-1'}>
          <CalendarSidebar
            date={date}
            onDateSelect={setDate}
            onAddMeeting={() => setShowForm(true)}
            timeZone={timeZone}
            isDayWithNote={(day) => isDayWithNote(calendarNotes, day)}
          />
        </div>

        <div className={expanded ? 'md:col-span-1' : 'md:col-span-2'}>
          <Card className="border-purple-100 shadow-xl dark:border-purple-800 transition-all duration-300 hover:shadow-purple-200/20 dark:hover:shadow-purple-800/20">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg p-5 flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-semibold flex items-center">
                {date ? format(date, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleExpanded}
                className="text-white hover:bg-white/20"
                title={expanded ? "Collapse calendar" : "Expand calendar"}
              >
                {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {showForm ? (
                <MeetingForm 
                  date={date}
                  onSave={onAddNote}
                  onCancel={() => setShowForm(false)}
                />
              ) : (
                <MeetingDetails
                  selectedDate={date}
                  selectedDateNotes={selectedDateNotes}
                  onDelete={onDeleteNote}
                  onExportToPDF={handleExportMeetingToPDF}
                  onShowForm={() => setShowForm(true)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {expanded && (
        <div className="md:hidden">
          <CalendarSidebar
            date={date}
            onDateSelect={setDate}
            onAddMeeting={() => setShowForm(true)}
            timeZone={timeZone}
            isDayWithNote={(day) => isDayWithNote(calendarNotes, day)}
          />
        </div>
      )}

      <div className="flex justify-center md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          className="text-purple-700 border-purple-200 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand View
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CalendarView;
