
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, Share2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

// Import types and components
import { CalendarNote, ViewMode } from './types';
import MeetingForm from './MeetingForm';
import MeetingDetails from './MeetingDetails';
import MeetingListView from './MeetingListView';
import CalendarSidebar from './CalendarSidebar';
import { 
  handleExportMeetingToPDF, 
  handleExportAllToPDF, 
  isDayWithNote as checkDayWithNote,
  getNotesForDate
} from './meetingUtils';

export const MeetingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [timeZone, setTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Add some example notes for demonstration
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const initialNotes: CalendarNote[] = [
      {
        date: today,
        note: "Weekly team sync meeting at 10:00 AM. Discuss Q2 roadmap priorities.",
        title: "Team Sync",
        startTime: "10:00",
        endTime: "11:00",
        participants: ["john@example.com", "sarah@example.com", "mike@example.com"],
        location: "Conference Room A",
        color: "indigo",
        reminders: [
          { time: new Date(today.getTime() - 24 * 60 * 60 * 1000), type: 'email' },
          { time: new Date(today.getTime() - 3 * 60 * 1000), type: 'notification' }
        ]
      },
      {
        date: tomorrow,
        note: "Follow up with Mike about the customer segmentation report.",
        title: "Customer Report Review",
        startTime: "14:00",
        endTime: "15:00",
        participants: ["mike@example.com"],
        location: "Virtual - Zoom",
        color: "purple",
        reminders: [
          { time: new Date(tomorrow.getTime() - 24 * 60 * 60 * 1000), type: 'email' }
        ]
      },
      {
        date: nextWeek,
        note: "Marketing review meeting - Assess results of TikTok campaign.",
        title: "Marketing Review",
        startTime: "11:00",
        endTime: "12:30",
        participants: ["marketing@example.com", "social@example.com"],
        location: "Conference Room B",
        color: "green",
        isRecurring: true,
        recurringPattern: "weekly",
        reminders: [
          { time: new Date(nextWeek.getTime() - 24 * 60 * 60 * 1000), type: 'email' },
          { time: new Date(nextWeek.getTime() - 30 * 60 * 1000), type: 'custom' }
        ]
      }
    ];
    
    setCalendarNotes(initialNotes);
  }, []);

  // Add a meeting note
  const addNote = (newNote: CalendarNote) => {
    setCalendarNotes([...calendarNotes, newNote]);
    setShowForm(false);

    toast({
      title: "Meeting Added",
      description: `Meeting "${newNote.title}" added for ${newNote.date.toLocaleDateString()}.`,
    });
  };

  // Delete a note from calendar view
  const deleteNote = (index: number) => {
    const selectedDateNotes = getNotesForDate(calendarNotes, date);
    if (selectedDateNotes[index]) {
      const noteToDelete = selectedDateNotes[index];
      const newNotes = calendarNotes.filter(note => 
        !(note.date.toDateString() === noteToDelete.date.toDateString() && 
          note.note === noteToDelete.note)
      );
      
      setCalendarNotes(newNotes);
      
      toast({
        title: "Meeting Deleted",
        description: "Calendar meeting has been removed.",
      });
    }
  };

  // Delete a note from list view
  const deleteNoteFromList = (noteDate: Date, listIndex: number) => {
    setDate(noteDate);
    const selectedDateNotes = getNotesForDate(calendarNotes, noteDate);
    if (selectedDateNotes[listIndex]) {
      deleteNote(listIndex);
    }
  };

  // Check if a day has notes
  const isDayWithNote = (day: Date) => {
    return checkDayWithNote(calendarNotes, day);
  };

  // Get notes for the selected date
  const selectedDateNotes = getNotesForDate(calendarNotes, date);

  // Switch to calendar view and show form
  const handleAddFirstMeeting = () => {
    setDate(new Date());
    setShowForm(true);
    setViewMode('calendar');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Meeting Schedule</h2>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText size={16} className="mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => handleExportAllToPDF(calendarNotes)}
                >
                  <FileText size={16} className="mr-2" />
                  Export All to PDF
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Google Calendar",
                      description: "Syncing with Google Calendar...",
                    });
                    
                    setTimeout(() => {
                      toast({
                        title: "Success",
                        description: "Calendar synced with Google Calendar",
                      });
                    }, 1500);
                  }}
                >
                  <Share2 size={16} className="mr-2" />
                  Sync with Google
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Outlook Calendar",
                      description: "Syncing with Outlook Calendar...",
                    });
                    
                    setTimeout(() => {
                      toast({
                        title: "Success",
                        description: "Calendar synced with Outlook Calendar",
                      });
                    }, 1500);
                  }}
                >
                  <Share2 size={16} className="mr-2" />
                  Sync with Outlook
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <CalendarSidebar
              date={date}
              onDateSelect={setDate}
              onAddMeeting={() => setShowForm(true)}
              timeZone={timeZone}
              isDayWithNote={isDayWithNote}
            />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {date ? format(date, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showForm ? (
                  <MeetingForm 
                    date={date}
                    onSave={addNote}
                    onCancel={() => setShowForm(false)}
                  />
                ) : (
                  <MeetingDetails
                    selectedDate={date}
                    selectedDateNotes={selectedDateNotes}
                    onDelete={deleteNote}
                    onExportToPDF={handleExportMeetingToPDF}
                    onShowForm={() => setShowForm(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <MeetingListView
          calendarNotes={calendarNotes}
          onDelete={deleteNoteFromList}
          onExportToPDF={handleExportMeetingToPDF}
          onAddMeeting={handleAddFirstMeeting}
        />
      )}
    </div>
  );
};

export default MeetingCalendar;
