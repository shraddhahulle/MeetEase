
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FileText, Share2, Sun, Moon } from 'lucide-react';
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
import { 
  saveCalendarNotes, 
  loadCalendarNotes, 
  getUserTheme, 
  saveUserTheme,
  getUpcomingReminders
} from '../../utils/calendarStorage';

export const MeetingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [timeZone, setTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [theme, setTheme] = useState<'light' | 'dark'>(getUserTheme());

  // Load notes from localStorage on initial mount
  useEffect(() => {
    const savedNotes = loadCalendarNotes();
    if (savedNotes.length > 0) {
      setCalendarNotes(savedNotes);
    } else {
      // If no saved notes, add some example notes for demonstration
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
      saveCalendarNotes(initialNotes);
    }

    // Set theme on body element
    document.body.classList.toggle('dark', theme === 'dark');
    
    // Check for upcoming reminders
    checkReminders();
    
    // Set interval to check reminders every hour
    const reminderInterval = setInterval(checkReminders, 60 * 60 * 1000);
    
    return () => {
      clearInterval(reminderInterval);
    };
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (calendarNotes.length > 0) {
      saveCalendarNotes(calendarNotes);
    }
  }, [calendarNotes]);

  // Update document theme when theme state changes
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    saveUserTheme(theme);
  }, [theme]);

  // Function to check for upcoming reminders
  const checkReminders = () => {
    const upcomingMeetings = getUpcomingReminders();
    
    upcomingMeetings.forEach(meeting => {
      const meetingTime = new Date(meeting.date);
      const [hours, minutes] = (meeting.startTime || "00:00").split(':').map(Number);
      meetingTime.setHours(hours, minutes);
      
      // Only show reminder if meeting is within the next 24 hours
      const now = new Date();
      const timeDiff = meetingTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff > 0 && hoursDiff <= 24) {
        toast({
          title: "Upcoming Meeting",
          description: `${meeting.title} at ${meeting.startTime} ${hoursDiff < 1 ? 'in less than an hour' : 'today'}`,
        });
      }
    });
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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

  // Sync with Google Calendar (simulated)
  const syncWithGoogleCalendar = () => {
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
  };

  // Sync with Outlook Calendar (simulated)
  const syncWithOutlookCalendar = () => {
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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Meeting Schedule</h2>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            className={viewMode === 'calendar' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30'}
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30">
                <FileText size={16} className="mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                  onClick={() => handleExportAllToPDF(calendarNotes)}
                >
                  <FileText size={16} className="mr-2" />
                  Export All to PDF
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                  onClick={syncWithGoogleCalendar}
                >
                  <Share2 size={16} className="mr-2" />
                  Sync with Google
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                  onClick={syncWithOutlookCalendar}
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
            <Card className="border-purple-100 shadow-lg dark:border-purple-800">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-lg">
                  {date ? format(date, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
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
