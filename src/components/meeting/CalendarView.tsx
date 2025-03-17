
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarNote } from './types';
import MeetingForm from './MeetingForm';
import MeetingDetails from './MeetingDetails';
import CalendarSidebar from './CalendarSidebar';
import { handleExportMeetingToPDF, isDayWithNote } from './meetingUtils';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="md:col-span-1">
        <CalendarSidebar
          date={date}
          onDateSelect={setDate}
          onAddMeeting={() => setShowForm(true)}
          timeZone={timeZone}
          isDayWithNote={(day) => isDayWithNote(calendarNotes, day)}
        />
      </div>

      <div className="md:col-span-2">
        <Card className="border-purple-100 shadow-xl dark:border-purple-800 transition-all duration-300 hover:shadow-purple-200/20 dark:hover:shadow-purple-800/20">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg p-5">
            <CardTitle className="text-xl font-semibold flex items-center">
              {date ? format(date, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
            </CardTitle>
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
  );
};

export default CalendarView;
