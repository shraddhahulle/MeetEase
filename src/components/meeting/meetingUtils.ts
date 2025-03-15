
import { CalendarNote } from './types';
import { exportMeetingToPDF, exportMeetingsToPDF } from '@/utils/pdfExport';
import { toast } from '@/hooks/use-toast';

// Function to convert CalendarNote to the format expected by pdfExport
export const convertNoteToPdfFormat = (note: CalendarNote) => {
  // Create start and end time dates
  const startDate = new Date(note.date);
  const [startHours, startMinutes] = (note.startTime || '00:00').split(':').map(Number);
  startDate.setHours(startHours, startMinutes);
  
  const endDate = new Date(note.date);
  const [endHours, endMinutes] = (note.endTime || '00:00').split(':').map(Number);
  endDate.setHours(endHours, endMinutes);
  
  // Return meeting data in the format expected by PDF export
  return {
    id: Math.random().toString(36).substring(2, 9),
    title: note.title || 'Untitled Meeting',
    startTime: startDate,
    endTime: endDate,
    description: note.note,
    location: note.location,
    participants: note.participants,
    color: note.color,
    isRecurring: note.isRecurring,
    recurringPattern: note.recurringPattern,
    notes: [note.note],
    reminders: note.reminders
  };
};

// Handle export to PDF for a single meeting
export const handleExportMeetingToPDF = (meeting: CalendarNote) => {
  try {
    const meetingData = convertNoteToPdfFormat(meeting);
    exportMeetingToPDF(meetingData);
    
    toast({
      title: "PDF Generated",
      description: "Meeting details have been exported to PDF.",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({
      title: "Error",
      description: "Failed to export meeting to PDF.",
      variant: "destructive",
    });
  }
};

// Handle export of all meetings to PDF
export const handleExportAllToPDF = (calendarNotes: CalendarNote[]) => {
  try {
    // Convert calendar notes to meeting format
    const meetings = calendarNotes.map(convertNoteToPdfFormat);
    
    // Export to PDF
    exportMeetingsToPDF(meetings);
    
    toast({
      title: "PDF Calendar Generated",
      description: "Your calendar has been exported to PDF.",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({
      title: "Error",
      description: "Failed to export calendar to PDF.",
      variant: "destructive",
    });
  }
};

// Function to check if a day has notes
export const isDayWithNote = (calendarNotes: CalendarNote[], day: Date) => {
  return calendarNotes.some(note => 
    note.date.toDateString() === day.toDateString()
  );
};

// Function to get notes for a specific date
export const getNotesForDate = (calendarNotes: CalendarNote[], date: Date | undefined) => {
  if (!date) return [];
  return calendarNotes.filter(
    note => note.date.toDateString() === date.toDateString()
  );
};
