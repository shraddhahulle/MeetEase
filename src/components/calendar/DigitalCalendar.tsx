import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, isAfter, parseISO, isBefore } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Download,
  Plus,
  CalendarDays,
  Bell,
  Mail,
  Trash,
  Save,
  Clock,
  Users,
  Edit,
  MapPin,
  Link,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { scheduleEmailReminder } from '@/services/reminder';
import { downloadMeetingPDF } from '@/services/pdfService';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[];
  notes: string;
  location?: string;
  reminderSent: boolean;
}

export const DigitalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [expandCalendar, setExpandCalendar] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    participants: '',
    notes: '',
    location: '',
  });
  
  // Initialize with some example meetings
  useEffect(() => {
    const exampleMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Team Standup',
        date: addDays(new Date(), 1),
        startTime: '09:00',
        endTime: '09:30',
        participants: ['john@example.com', 'sarah@example.com'],
        notes: 'Daily standup meeting to discuss progress and blockers.',
        location: 'Zoom',
        reminderSent: false
      },
      {
        id: '2',
        title: 'Product Demo',
        date: addDays(new Date(), 2),
        startTime: '14:00',
        endTime: '15:00',
        participants: ['client@example.com', 'manager@example.com', 'developer@example.com'],
        notes: 'Product demonstration for the client. Show the new features.',
        location: 'Conference Room A',
        reminderSent: false
      }
    ];
    
    setMeetings(exampleMeetings);
    localStorage.setItem('meetings', JSON.stringify(exampleMeetings));
  }, []);
  
  // Load meetings from localStorage
  useEffect(() => {
    const storedMeetings = localStorage.getItem('meetings');
    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings).map((meeting: any) => ({
          ...meeting,
          date: new Date(meeting.date)
        }));
        setMeetings(parsedMeetings);
      } catch (error) {
        console.error('Error parsing meetings from localStorage:', error);
      }
    }
  }, []);
  
  // Check for meeting reminders
  useEffect(() => {
    const checkReminders = () => {
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      meetings.forEach(meeting => {
        if (isSameDay(meeting.date, tomorrow) && !meeting.reminderSent) {
          scheduleEmailReminder(meeting);
          
          toast({
            title: 'Meeting Tomorrow',
            description: `Reminder: "${meeting.title}" is scheduled for tomorrow at ${meeting.startTime}`,
          });
          
          setMeetings(prev => 
            prev.map(m => 
              m.id === meeting.id ? { ...m, reminderSent: true } : m
            )
          );
        }
      });
    };
    
    checkReminders();
    const interval = setInterval(checkReminders, 3600000);
    
    return () => clearInterval(interval);
  }, [meetings]);
  
  // Clean up past meetings
  useEffect(() => {
    const now = new Date();
    const isInPast = (meeting: Meeting) => {
      const meetingDate = new Date(meeting.date);
      meetingDate.setHours(
        parseInt(meeting.endTime.split(':')[0]), 
        parseInt(meeting.endTime.split(':')[1]), 
        0, 0
      );
      
      return isBefore(meetingDate, now);
    };
    
    const currentMeetings = meetings.filter(meeting => !isInPast(meeting));
    
    if (currentMeetings.length !== meetings.length) {
      setMeetings(currentMeetings);
      localStorage.setItem('meetings', JSON.stringify(currentMeetings));
      
      toast({
        title: 'Calendar Updated',
        description: 'Past meetings have been automatically removed',
      });
    }
  }, [meetings]);
  
  // Save meetings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };
  
  const handleAddMeeting = () => {
    setShowMeetingForm(true);
    setEditingMeeting(null);
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      participants: '',
      notes: '',
      location: '',
    });
  };
  
  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowMeetingForm(true);
    setFormData({
      title: meeting.title,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      participants: meeting.participants.join(', '),
      notes: meeting.notes,
      location: meeting.location || '',
    });
  };
  
  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    toast({
      title: 'Meeting Deleted',
      description: 'The meeting has been removed from your calendar',
    });
  };
  
  const handleDownloadPDF = (meeting: Meeting) => {
    downloadMeetingPDF(meeting);
    toast({
      title: 'PDF Downloaded',
      description: 'Meeting details have been saved to your downloads folder',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveMeeting = () => {
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive'
      });
      return;
    }
    
    const participants = formData.participants
      ? formData.participants.split(',').map(p => p.trim()).filter(p => p)
      : [];
    
    if (editingMeeting) {
      setMeetings(meetings.map(meeting => 
        meeting.id === editingMeeting.id
          ? {
              ...meeting,
              title: formData.title,
              startTime: formData.startTime,
              endTime: formData.endTime,
              participants,
              notes: formData.notes,
              location: formData.location,
              reminderSent: false
            }
          : meeting
      ));
      
      toast({
        title: 'Meeting Updated',
        description: 'Your meeting has been updated successfully',
      });
    } else {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: formData.title,
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        participants,
        notes: formData.notes,
        location: formData.location,
        reminderSent: false
      };
      
      setMeetings([...meetings, newMeeting]);
      
      toast({
        title: 'Meeting Scheduled',
        description: 'Your new meeting has been added to the calendar',
      });
    }
    
    setShowMeetingForm(false);
    setEditingMeeting(null);
  };
  
  const filteredMeetings = meetings.filter(meeting => 
    selectedDate && isSameDay(meeting.date, selectedDate)
  );
  
  const hasMeeting = (date: Date) => {
    return meetings.some(meeting => isSameDay(meeting.date, date));
  };
  
  const toggleCalendarSize = () => {
    setExpandCalendar(!expandCalendar);
  };
  
  return (
    <div className="digital-calendar-container">
      <div className={`digital-calendar-grid ${expandCalendar ? 'grid-cols-1' : ''}`}>
        <div className={`digital-calendar-sidebar ${expandCalendar ? 'hidden md:block' : ''}`}>
          <Card className="shadow-lg border border-purple-100 dark:border-purple-800 h-full">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl pb-3 flex flex-row justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleCalendarSize}
                className="text-white hover:bg-white/20"
                title={expandCalendar ? "Show sidebar" : "Hide sidebar"}
              >
                {expandCalendar ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="calendar-container w-full overflow-hidden rounded-lg border border-purple-100 dark:border-purple-800 transition-all duration-300">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border-0 w-full calendar-transition"
                  modifiers={{
                    hasMeeting: hasMeeting
                  }}
                  modifiersStyles={{
                    hasMeeting: { 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))',
                      color: '#8B5CF6',
                      borderRadius: '100%' 
                    }
                  }}
                />
              </div>
              
              <div className="mt-5">
                <Button 
                  onClick={handleAddMeeting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all py-6 rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Meeting for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Selected Date'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="digital-calendar-main">
          <Card className="shadow-lg border border-purple-100 dark:border-purple-800 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl pb-3 flex justify-between items-center">
              <CardTitle className="text-lg calendar-heading">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
              </CardTitle>
              {expandCalendar && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleCalendarSize}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize2 size={18} className="mr-1" /> Show Calendar
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-5">
              {showMeetingForm ? (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    {editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meeting Title*
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter meeting title"
                        className="premium-input"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Time*
                        </label>
                        <Input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="premium-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Time*
                        </label>
                        <Input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="premium-input"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter meeting location or link"
                        className="premium-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Participants (comma separated)
                      </label>
                      <Input
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        placeholder="john@example.com, jane@example.com"
                        className="premium-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meeting Notes
                      </label>
                      <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Enter meeting agenda or notes"
                        className="premium-input"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowMeetingForm(false);
                        setEditingMeeting(null);
                      }}
                      className="border-purple-200 dark:border-purple-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveMeeting}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingMeeting ? 'Update Meeting' : 'Save Meeting'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {filteredMeetings.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMeetings.map(meeting => (
                        <div key={meeting.id} className="meeting-card p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-xl text-purple-700 dark:text-purple-300">{meeting.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm mt-1">
                                <Clock className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                                {meeting.startTime} - {meeting.endTime}
                              </p>
                              {meeting.location && (
                                <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm mt-1">
                                  {meeting.location.includes('http') ? (
                                    <Link className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  ) : (
                                    <MapPin className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  )}
                                  {meeting.location}
                                </p>
                              )}
                              {meeting.participants.length > 0 && (
                                <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm mt-1">
                                  <Users className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                                  {meeting.participants.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
                                onClick={() => handleEditMeeting(meeting)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30"
                                onClick={() => handleDownloadPDF(meeting)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-200 text-red-500 hover:bg-red-50 hover:text-red-700 dark:border-purple-800 dark:hover:bg-red-900/30"
                                onClick={() => handleDeleteMeeting(meeting.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {meeting.notes && (
                            <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                              <h4 className="text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">Meeting Notes:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{meeting.notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 text-sm pt-2 border-t border-purple-100 dark:border-purple-800">
                            <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Bell className="h-4 w-4 mr-1 text-purple-600 dark:text-purple-400" />
                                Reminder: 1 day before
                              </span>
                              {meeting.reminderSent && (
                                <span className="flex items-center text-green-600 dark:text-green-400">
                                  <Mail className="h-4 w-4 mr-1" />
                                  Email reminder sent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-full p-4 inline-block mb-3">
                        <CalendarDays className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-purple-700 dark:text-purple-300">No meetings for this date</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-5">Schedule a meeting to get started</p>
                      <Button 
                        onClick={handleAddMeeting}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Meeting
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCalendarSize}
          className="text-purple-700 border-purple-200 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30"
        >
          {expandCalendar ? (
            <>
              <Maximize2 className="h-4 w-4 mr-1" />
              Show Calendar
            </>
          ) : (
            <>
              <Minimize2 className="h-4 w-4 mr-1" />
              Hide Calendar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
