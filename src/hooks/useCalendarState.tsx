
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { CalendarNote, ViewMode } from '@/components/meeting/types';
import { 
  loadCalendarNotes, 
  saveCalendarNotes, 
  getUserTheme, 
  saveUserTheme,
  getUpcomingReminders 
} from '@/utils/calendarStorage';
import { getNotesForDate } from '@/components/meeting/meetingUtils';

export const useCalendarState = () => {
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

  // Get notes for the selected date
  const selectedDateNotes = getNotesForDate(calendarNotes, date);

  return {
    date,
    setDate,
    calendarNotes,
    showForm,
    setShowForm,
    viewMode,
    setViewMode,
    timeZone,
    theme,
    selectedDateNotes,
    toggleTheme,
    addNote,
    deleteNote,
    deleteNoteFromList
  };
};
