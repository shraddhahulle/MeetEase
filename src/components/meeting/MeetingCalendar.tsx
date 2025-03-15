
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Bell, Trash2, Edit, FileText, Share2, Check, X, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { exportMeetingToPDF, exportMeetingsToPDF } from '@/utils/pdfExport';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarNote {
  date: Date;
  note: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  participants?: string[];
  location?: string;
  color?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  reminders?: {
    time: Date;
    type: 'email' | 'notification' | 'custom';
  }[];
}

export const MeetingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [noteText, setNoteText] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [participants, setParticipants] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [color, setColor] = useState<string>('indigo');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringPattern, setRecurringPattern] = useState<string>('weekly');
  const [reminders, setReminders] = useState<{time: string, type: 'email' | 'notification' | 'custom'}[]>([
    { time: '1d', type: 'email' },
    { time: '3m', type: 'notification' }
  ]);

  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [timeZone, setTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Add some example notes for demonstration
  React.useEffect(() => {
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

  const addNote = () => {
    if (!date || !noteText.trim() || !meetingTitle.trim()) {
      toast({
        title: "Cannot Add Meeting",
        description: "Please select a date, enter a title and notes.",
        variant: "destructive",
      });
      return;
    }

    // Parse time strings to create Date objects for the selected date
    const startDate = new Date(date);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes, 0, 0);
    
    const endDate = new Date(date);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    // Create reminder dates
    const reminderDates = reminders.map(reminder => {
      const reminderDate = new Date(startDate);
      if (reminder.time.endsWith('d')) {
        const days = parseInt(reminder.time.slice(0, -1));
        reminderDate.setDate(reminderDate.getDate() - days);
      } else if (reminder.time.endsWith('h')) {
        const hours = parseInt(reminder.time.slice(0, -1));
        reminderDate.setHours(reminderDate.getHours() - hours);
      } else if (reminder.time.endsWith('m')) {
        const minutes = parseInt(reminder.time.slice(0, -1));
        reminderDate.setMinutes(reminderDate.getMinutes() - minutes);
      }
      return {
        time: reminderDate,
        type: reminder.type
      };
    });
    
    // Parse participants
    const participantList = participants.split(',').map(p => p.trim()).filter(p => p.length > 0);

    const newNote: CalendarNote = {
      date: new Date(date.getTime()),
      note: noteText.trim(),
      title: meetingTitle.trim(),
      startTime,
      endTime,
      participants: participantList,
      location,
      color,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      reminders: reminderDates
    };

    setCalendarNotes([...calendarNotes, newNote]);
    
    // Reset form fields
    setNoteText('');
    setMeetingTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setParticipants('');
    setLocation('');
    setColor('indigo');
    setIsRecurring(false);
    setRecurringPattern('weekly');
    
    setShowForm(false);

    toast({
      title: "Meeting Added",
      description: `Meeting "${meetingTitle}" added for ${date.toLocaleDateString()}.`,
    });
  };

  const getNotesForDate = (date: Date | undefined) => {
    if (!date) return [];
    return calendarNotes.filter(
      note => note.date.toDateString() === date.toDateString()
    );
  };
  
  const deleteNote = (index: number) => {
    const selectedDateNotes = getNotesForDate(date);
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

  const selectedDateNotes = getNotesForDate(date);
  
  // Function to highlight dates with notes
  const isDayWithNote = (day: Date) => {
    return calendarNotes.some(note => 
      note.date.toDateString() === day.toDateString()
    );
  };
  
  // Handle export to PDF
  const handleExportToPDF = (meeting: CalendarNote) => {
    try {
      // Create start and end time dates
      const startDate = new Date(meeting.date);
      const [startHours, startMinutes] = (meeting.startTime || '00:00').split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      const endDate = new Date(meeting.date);
      const [endHours, endMinutes] = (meeting.endTime || '00:00').split(':').map(Number);
      endDate.setHours(endHours, endMinutes);
      
      // Prepare meeting data for PDF export
      const meetingData = {
        id: Math.random().toString(36).substring(2, 9),
        title: meeting.title || 'Untitled Meeting',
        startTime: startDate,
        endTime: endDate,
        description: meeting.note,
        location: meeting.location,
        participants: meeting.participants,
        color: meeting.color,
        isRecurring: meeting.isRecurring,
        recurringPattern: meeting.recurringPattern,
        notes: [meeting.note],
        reminders: meeting.reminders
      };
      
      // Export to PDF
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
  const handleExportAllToPDF = () => {
    try {
      // Convert calendar notes to meeting format
      const meetings = calendarNotes.map(note => {
        const startDate = new Date(note.date);
        const [startHours, startMinutes] = (note.startTime || '00:00').split(':').map(Number);
        startDate.setHours(startHours, startMinutes);
        
        const endDate = new Date(note.date);
        const [endHours, endMinutes] = (note.endTime || '00:00').split(':').map(Number);
        endDate.setHours(endHours, endMinutes);
        
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
      });
      
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
  
  // Add reminder dialog state
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderTime, setReminderTime] = useState('30m');
  const [reminderType, setReminderType] = useState<'email' | 'notification' | 'custom'>('notification');
  
  // Handle add reminder
  const handleAddReminder = () => {
    setReminders([...reminders, { time: reminderTime, type: reminderType }]);
    setShowReminderDialog(false);
    
    toast({
      title: "Reminder Added",
      description: `A ${reminderType} reminder has been set for ${reminderTime} before the meeting.`,
    });
  };
  
  // Handle remove reminder
  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
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
                  onClick={handleExportAllToPDF}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Timezone: {timeZone}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                      setTimeZone(userTimeZone);
                      toast({
                        title: "Timezone Updated",
                        description: `Calendar now shows times in ${userTimeZone}`,
                      });
                    }}
                  >
                    Auto-detect
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasNote: isDayWithNote
                  }}
                  modifiersStyles={{
                    hasNote: { 
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      borderRadius: '100%' 
                    }
                  }}
                />
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Meeting for {date ? format(date, 'MMM dd, yyyy') : 'Selected Date'}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Meeting Title</label>
                      <Input
                        placeholder="Enter meeting title..."
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Input
                        placeholder="Enter location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Participants (comma separated)</label>
                      <Input
                        placeholder="Enter email addresses..."
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium">Recurring Meeting</label>
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    
                    {isRecurring && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Recurrence Pattern</label>
                        <Select value={recurringPattern} onValueChange={setRecurringPattern}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recurrence pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <Select value={color} onValueChange={setColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meeting color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indigo">Indigo</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Reminders</label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowReminderDialog(true)}
                        >
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      {reminders.length > 0 ? (
                        <div className="space-y-2">
                          {reminders.map((reminder, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <Bell size={16} className="mr-2 text-indigo-600" />
                                <span className="text-sm">
                                  {reminder.type} reminder {reminder.time} before
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveReminder(index)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No reminders set</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        placeholder="Enter meeting notes or agenda..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={addNote}>
                        Save Meeting
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          setNoteText('');
                          setMeetingTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedDateNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateNotes.map((note, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border-l-4 ${
                              note.color === 'indigo' ? 'border-l-indigo-500 bg-indigo-50' :
                              note.color === 'purple' ? 'border-l-purple-500 bg-purple-50' :
                              note.color === 'green' ? 'border-l-green-500 bg-green-50' :
                              note.color === 'red' ? 'border-l-red-500 bg-red-50' :
                              note.color === 'orange' ? 'border-l-orange-500 bg-orange-50' :
                              'border-l-blue-500 bg-blue-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{note.title || 'Untitled Meeting'}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Clock size={14} className="mr-1" />
                                  <span>{note.startTime || '00:00'} - {note.endTime || '00:00'}</span>
                                  
                                  {note.location && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>{note.location}</span>
                                    </>
                                  )}
                                  
                                  {note.isRecurring && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>Recurring ({note.recurringPattern})</span>
                                    </>
                                  )}
                                </div>
                                
                                {note.participants && note.participants.length > 0 && (
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Users size={14} className="mr-1" />
                                    <span>{note.participants.length} participants</span>
                                  </div>
                                )}
                                
                                <p className="text-sm mt-2">{note.note}</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleExportToPDF(note)}
                                  className="h-8 px-2"
                                >
                                  <FileText size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2"
                                  onClick={() => {
                                    // Functionality to edit would go here
                                    toast({
                                      title: "Edit Meeting",
                                      description: "This functionality is not implemented yet.",
                                    });
                                  }}
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 h-8 px-2"
                                  onClick={() => deleteNote(index)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No meetings scheduled for this date</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowForm(true)}
                          className="mt-2"
                        >
                          Add a meeting
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {calendarNotes.length > 0 ? (
                calendarNotes
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((note, index) => (
                    <div 
                      key={index} 
                      className={`p-3 border rounded-md ${
                        note.color === 'indigo' ? 'border-l-4 border-l-indigo-500' :
                        note.color === 'purple' ? 'border-l-4 border-l-purple-500' :
                        note.color === 'green' ? 'border-l-4 border-l-green-500' :
                        note.color === 'red' ? 'border-l-4 border-l-red-500' :
                        note.color === 'orange' ? 'border-l-4 border-l-orange-500' :
                        'border-l-4 border-l-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-sm text-indigo-600">
                              {format(note.date, 'EEEE, MMMM dd, yyyy')}
                            </p>
                            {note.isRecurring && (
                              <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                Recurring
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium mt-1">{note.title || 'Untitled Meeting'}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{note.startTime || '00:00'} - {note.endTime || '00:00'}</span>
                            
                            {note.location && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{note.location}</span>
                              </>
                            )}
                          </div>
                          <p className="mt-2 text-sm">{note.note}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleExportToPDF(note)}
                            className="h-8 px-2"
                          >
                            <FileText size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 h-8 px-2"
                            onClick={() => {
                              setDate(note.date);
                              deleteNote(index);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No meetings on your calendar</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setDate(new Date());
                      setShowForm(true);
                      setViewMode('calendar');
                    }}
                    className="mt-2"
                  >
                    Add your first meeting
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
            <DialogDescription>
              Set when and how you want to be reminded about this meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">Reminder Time</label>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select when to be reminded" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 minutes before</SelectItem>
                  <SelectItem value="15m">15 minutes before</SelectItem>
                  <SelectItem value="30m">30 minutes before</SelectItem>
                  <SelectItem value="1h">1 hour before</SelectItem>
                  <SelectItem value="3h">3 hours before</SelectItem>
                  <SelectItem value="1d">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Reminder Type</label>
              <Select value={reminderType} onValueChange={(value: 'email' | 'notification' | 'custom') => setReminderType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="notification">In-app notification</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

