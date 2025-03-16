
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
  Link
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
        // Parse the dates from strings to Date objects
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
    // Check if we need to send reminders for meetings happening the next day
    const checkReminders = () => {
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      meetings.forEach(meeting => {
        // If meeting is tomorrow and reminder not yet sent
        if (isSameDay(meeting.date, tomorrow) && !meeting.reminderSent) {
          // Send email reminder
          scheduleEmailReminder(meeting);
          
          // Show notification
          toast({
            title: 'Meeting Tomorrow',
            description: `Reminder: "${meeting.title}" is scheduled for tomorrow at ${meeting.startTime}`,
          });
          
          // Mark reminder as sent
          setMeetings(prev => 
            prev.map(m => 
              m.id === meeting.id ? { ...m, reminderSent: true } : m
            )
          );
        }
      });
    };
    
    // Check immediately and then every hour
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
    
    // Remove past meetings
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
    
    // Parse participants
    const participants = formData.participants
      ? formData.participants.split(',').map(p => p.trim()).filter(p => p)
      : [];
    
    if (editingMeeting) {
      // Update existing meeting
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
              reminderSent: false // Reset reminder status on edit
            }
          : meeting
      ));
      
      toast({
        title: 'Meeting Updated',
        description: 'Your meeting has been updated successfully',
      });
    } else {
      // Create new meeting
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
  
  // Get meetings for the selected date
  const filteredMeetings = meetings.filter(meeting => 
    selectedDate && isSameDay(meeting.date, selectedDate)
  );
  
  // Calendar date modifier to show dates with meetings
  const hasMeeting = (date: Date) => {
    return meetings.some(meeting => isSameDay(meeting.date, date));
  };
  
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border border-meetease-gray4/30">
            <CardHeader className="bg-gradient-to-r from-meetease-blue/5 to-meetease-purple/5 rounded-t-xl pb-3">
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-meetease-blue" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border-0"
                modifiers={{
                  hasMeeting: hasMeeting
                }}
                modifiersStyles={{
                  hasMeeting: { 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, rgba(155, 135, 245, 0.15), rgba(94, 92, 230, 0.15))',
                    color: '#5E5CE6',
                    borderRadius: '100%' 
                  }
                }}
              />
              
              <div className="mt-5">
                <Button 
                  onClick={handleAddMeeting}
                  className="w-full bg-gradient-to-r from-meetease-blue to-meetease-indigo hover:from-meetease-indigo hover:to-meetease-blue text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Meeting for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Selected Date'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Meeting details or form */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border border-meetease-gray4/30">
            <CardHeader className="bg-gradient-to-r from-meetease-blue/5 to-meetease-purple/5 rounded-t-xl pb-3">
              <CardTitle className="text-lg">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM dd, yyyy') : "Select a Date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {showMeetingForm ? (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold text-meetease-indigo mb-2">
                    {editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="border-meetease-gray4/50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveMeeting}
                      className="bg-gradient-to-r from-meetease-blue to-meetease-indigo hover:from-meetease-indigo hover:to-meetease-blue text-white"
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
                              <h3 className="font-semibold text-xl text-meetease-indigo">{meeting.title}</h3>
                              <p className="text-gray-600 flex items-center text-sm mt-1">
                                <Clock className="h-4 w-4 mr-1 text-meetease-blue" />
                                {meeting.startTime} - {meeting.endTime}
                              </p>
                              {meeting.location && (
                                <p className="text-gray-600 flex items-center text-sm mt-1">
                                  {meeting.location.includes('http') ? (
                                    <Link className="h-4 w-4 mr-1 text-meetease-blue" />
                                  ) : (
                                    <MapPin className="h-4 w-4 mr-1 text-meetease-blue" />
                                  )}
                                  {meeting.location}
                                </p>
                              )}
                              {meeting.participants.length > 0 && (
                                <p className="text-gray-600 flex items-center text-sm mt-1">
                                  <Users className="h-4 w-4 mr-1 text-meetease-blue" />
                                  {meeting.participants.join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-meetease-gray4/50 text-meetease-blue hover:bg-meetease-blue/5 hover:text-meetease-indigo"
                                onClick={() => handleEditMeeting(meeting)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-meetease-gray4/50 text-meetease-blue hover:bg-meetease-blue/5 hover:text-meetease-indigo"
                                onClick={() => handleDownloadPDF(meeting)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-meetease-gray4/50 text-red-500 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteMeeting(meeting.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {meeting.notes && (
                            <div className="mt-3 p-4 bg-meetease-blue/5 rounded-xl">
                              <h4 className="text-sm font-medium mb-1 text-meetease-indigo">Meeting Notes:</h4>
                              <p className="text-sm text-gray-600">{meeting.notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 text-sm pt-2 border-t border-meetease-gray4/30">
                            <div className="flex justify-between items-center text-gray-500">
                              <span className="flex items-center">
                                <Bell className="h-4 w-4 mr-1 text-meetease-blue" />
                                Reminder: 1 day before
                              </span>
                              {meeting.reminderSent && (
                                <span className="flex items-center text-meetease-green">
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
                      <div className="bg-meetease-blue/5 rounded-full p-4 inline-block mb-3">
                        <CalendarDays className="h-12 w-12 text-meetease-blue mx-auto" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-meetease-indigo">No meetings for this date</h3>
                      <p className="text-gray-500 mb-5">Schedule a meeting to get started</p>
                      <Button 
                        onClick={handleAddMeeting}
                        className="bg-gradient-to-r from-meetease-blue to-meetease-indigo hover:from-meetease-indigo hover:to-meetease-blue text-white px-6"
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
    </div>
  );
};
