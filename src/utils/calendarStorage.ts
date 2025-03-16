
import { CalendarNote } from "../components/meeting/types";

// Save calendar notes to localStorage
export const saveCalendarNotes = (notes: CalendarNote[]): void => {
  try {
    // Convert Date objects to ISO strings for storage
    const serializedNotes = notes.map(note => ({
      ...note,
      date: note.date.toISOString(),
      reminders: note.reminders?.map(reminder => ({
        ...reminder,
        time: reminder.time.toISOString()
      }))
    }));
    
    localStorage.setItem('calendarNotes', JSON.stringify(serializedNotes));
  } catch (error) {
    console.error('Failed to save calendar notes:', error);
  }
};

// Load calendar notes from localStorage
export const loadCalendarNotes = (): CalendarNote[] => {
  try {
    const savedNotes = localStorage.getItem('calendarNotes');
    
    if (!savedNotes) {
      return [];
    }
    
    // Parse stored data and convert ISO strings back to Date objects
    const parsedNotes = JSON.parse(savedNotes);
    
    return parsedNotes.map((note: any) => ({
      ...note,
      date: new Date(note.date),
      reminders: note.reminders?.map((reminder: any) => ({
        ...reminder,
        time: new Date(reminder.time)
      }))
    }));
  } catch (error) {
    console.error('Failed to load calendar notes:', error);
    return [];
  }
};

// Delete a specific calendar note
export const deleteCalendarNote = (noteToDelete: CalendarNote): void => {
  try {
    const notes = loadCalendarNotes();
    const filteredNotes = notes.filter(note => 
      !(note.date.toDateString() === new Date(noteToDelete.date).toDateString() && 
        note.title === noteToDelete.title && 
        note.startTime === noteToDelete.startTime)
    );
    
    saveCalendarNotes(filteredNotes);
  } catch (error) {
    console.error('Failed to delete calendar note:', error);
  }
};

// Check for upcoming meetings and return reminders
export const getUpcomingReminders = (): CalendarNote[] => {
  const notes = loadCalendarNotes();
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);
  
  return notes.filter(note => {
    const noteDate = new Date(note.date);
    return noteDate >= now && noteDate <= tomorrow;
  });
};

// Get user's preferred theme from localStorage
export const getUserTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('userTheme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  
  // Default to user's system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

// Save user's theme preference
export const saveUserTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem('userTheme', theme);
};
