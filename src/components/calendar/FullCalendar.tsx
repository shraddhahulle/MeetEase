import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Bell, ArrowLeft, ArrowRight, Plus, Trash2, Edit, Check, X, Calendar as CalendarIcon, ChevronDown, BellRing, Clock1, Repeat, Globe, Check as CheckIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addDays, addMinutes, parseISO, isToday, isTomorrow } from 'date-fns';

// Define meeting type
interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[];
  notes: string;
  type: 'work' | 'personal' | 'other';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  reminders: {
    email: boolean;
    inApp: boolean;
    custom: number[];
  };
  timezone: string;
}

// Sample data
const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    participants: ['john@example.com', 'sarah@example.com'],
    notes: 'Discuss project progress and blockers',
    type: 'work',
    recurring: 'daily',
    reminders: {
      email: true,
      inApp: true,
      custom: [30]
    },
    timezone: 'America/New_York'
  },
  {
    id: '2',
    title: 'Client Presentation',
    date: addDays(new Date(), 1),
    startTime: '14:00',
    endTime: '15:30',
    participants: ['client@example.com', 'manager@example.com'],
    notes: 'Present the new feature roadmap',
    type: 'work',
    recurring: 'none',
    reminders: {
      email: true,
      inApp: true,
      custom: [60, 30]
    },
    timezone: 'America/New_York'
  },
  {
    id: '3',
    title: 'Lunch with Alex',
    date: addDays(new Date(), 3),
    startTime: '12:00',
    endTime: '13:00',
    participants: ['alex@example.com'],
    notes: 'Discuss partnership opportunities',
    type: 'personal',
    recurring: 'none',
    reminders: {
      email: false,
      inApp: true,
      custom: []
    },
    timezone: 'America/New_York'
  },
];

// Get dates for the current week
const getWeekDates = (currentDate: Date) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

// Get time slots for the day view
const getTimeSlots = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });
};

// Meeting colors by type
const meetingColors = {
  work: 'bg-blue-500 hover:bg-blue-600',
  personal: 'bg-green-500 hover:bg-green-600',
  other: 'bg-purple-500 hover:bg-purple-600'
};

export const FullCalendar: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(currentDate));
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    participants: [],
    notes: '',
    type: 'work',
    recurring: 'none',
    reminders: {
      email: true,
      inApp: true,
      custom: []
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState<Meeting | null>(null);
  const [newParticipant, setNewParticipant] = useState('');
  const [customReminder, setCustomReminder] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  
  // Show upcoming meetings reminders
  useEffect(() => {
    // Check if there are any meetings today or tomorrow
    const upcomingMeetings = meetings.filter(meeting => 
      isToday(meeting.date) || isTomorrow(meeting.date)
    );
    
    if (upcomingMeetings.length > 0) {
      setShowReminders(true);
    }
  }, [meetings]);

  // Update week dates when current date changes
  useEffect(() => {
    setWeekDates(getWeekDates(currentDate));
  }, [currentDate]);

  // Navigation functions
  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Meeting functions
  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.startTime || !newMeeting.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title || '',
      date: newMeeting.date || new Date(),
      startTime: newMeeting.startTime || '09:00',
      endTime: newMeeting.endTime || '10:00',
      participants: newMeeting.participants || [],
      notes: newMeeting.notes || '',
      type: newMeeting.type as 'work' | 'personal' | 'other' || 'work',
      recurring: newMeeting.recurring as 'none' | 'daily' | 'weekly' | 'monthly' || 'none',
      reminders: newMeeting.reminders || {
        email: true,
        inApp: true,
        custom: []
      },
      timezone: newMeeting.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      setMeetings([...meetings, meeting]);
      setNewMeeting({
        title: '',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        participants: [],
        notes: '',
        type: 'work',
        recurring: 'none',
        reminders: {
          email: true,
          inApp: true,
          custom: []
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      setShowAddMeeting(false);
      setIsUpdating(false);
      
      toast({
        title: "Meeting Added",
        description: "Your meeting has been scheduled successfully.",
      });
      
      // Simulate calendar sync
      toast({
        title: "Calendar Sync",
        description: "Meeting has been synced with your connected calendars.",
      });
    }, 1500);
  };

  const handleUpdateMeeting = () => {
    if (!editedMeeting) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setMeetings(meetings.map(m => m.id === editedMeeting.id ? editedMeeting : m));
      setSelectedMeeting(editedMeeting);
      setEditMode(false);
      setIsUpdating(false);
      
      toast({
        title: "Meeting Updated",
        description: "Your meeting has been updated successfully.",
      });
    }, 1500);
  };

  const handleDeleteMeeting = (id: string) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setMeetings(meetings.filter(m => m.id !== id));
      setSelectedMeeting(null);
      setShowMeetingDetails(false);
      setIsUpdating(false);
      
      toast({
        title: "Meeting Deleted",
        description: "Your meeting has been deleted successfully.",
      });
    }, 1500);
  };

  const handleAddParticipant = () => {
    if (!newParticipant) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newParticipant)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && editedMeeting) {
      setEditedMeeting({
        ...editedMeeting,
        participants: [...editedMeeting.participants, newParticipant]
      });
    } else {
      setNewMeeting({
        ...newMeeting,
        participants: [...(newMeeting.participants || []), newParticipant]
      });
    }
    
    setNewParticipant('');
  };

  const handleRemoveParticipant = (email: string) => {
    if (editMode && editedMeeting) {
      setEditedMeeting({
        ...editedMeeting,
        participants: editedMeeting.participants.filter(p => p !== email)
      });
    } else {
      setNewMeeting({
        ...newMeeting,
        participants: (newMeeting.participants || []).filter(p => p !== email)
      });
    }
  };

  const handleAddCustomReminder = () => {
    if (!customReminder) return;
    
    const minutes = parseInt(customReminder);
    if (isNaN(minutes) || minutes <= 0) {
      toast({
        title: "Invalid Reminder",
        description: "Please enter a valid number of minutes.",
        variant: "destructive"
      });
      return;
    }
    
    if (editMode && editedMeeting) {
      setEditedMeeting({
        ...editedMeeting,
        reminders: {
          ...editedMeeting.reminders,
          custom: [...editedMeeting.reminders.custom, minutes]
        }
      });
    } else {
      setNewMeeting({
        ...newMeeting,
        reminders: {
          ...(newMeeting.reminders || { email: true, inApp: true, custom: [] }),
          custom: [...(newMeeting.reminders?.custom || []), minutes]
        }
      });
    }
    
    setCustomReminder('');
  };

  const handleRemoveCustomReminder = (minutes: number) => {
    if (editMode && editedMeeting) {
      setEditedMeeting({
        ...editedMeeting,
        reminders: {
          ...editedMeeting.reminders,
          custom: editedMeeting.reminders.custom.filter(m => m !== minutes)
        }
      });
    } else {
      setNewMeeting({
        ...newMeeting,
        reminders: {
          ...(newMeeting.reminders || { email: true, inApp: true, custom: [] }),
          custom: (newMeeting.reminders?.custom || []).filter(m => m !== minutes)
        }
      });
    }
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetails(true);
  };

  const handleEditMeeting = () => {
    if (!selectedMeeting) return;
    setEditedMeeting({ ...selectedMeeting });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedMeeting(null);
  };

  const handleDismissReminders = () => {
    setShowReminders(false);
  };

  const exportMeetingPDF = (meeting: Meeting) => {
    toast({
      title: "PDF Exported",
      description: "Meeting details have been exported to PDF and downloaded.",
    });
  };

  const shareMeetingEmail = (meeting: Meeting) => {
    toast({
      title: "Meeting Shared",
      description: "Meeting details have been shared via email.",
    });
  };

  // Connect to external calendar
  const connectCalendar = (provider: 'google' | 'outlook') => {
    toast({
      title: "Connecting to Calendar",
      description: `Initiating connection to ${provider} Calendar...`,
    });
    
    // Simulate OAuth flow
    setTimeout(() => {
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${provider} Calendar.`,
      });
    }, 2000);
  };

  // Render Day View
  const renderDayView = () => {
    const timeSlots = getTimeSlots();
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    
    const dayMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      meetingDate.setHours(0, 0, 0, 0);
      return meetingDate.getTime() === today.getTime();
    });
    
    return (
      <div className="h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map((time, index) => {
            const hour = parseInt(time.split(':')[0]);
            const meetingsAtTime = dayMeetings.filter(meeting => {
              const startHour = parseInt(meeting.startTime.split(':')[0]);
              return startHour === hour;
            });
            
            return (
              <div key={index} className="relative h-16 border-t">
                <div className="absolute left-0 -top-3 text-xs text-gray-500">
                  {time}
                </div>
                
                {meetingsAtTime.map(meeting => (
                  <div 
                    key={meeting.id}
                    className={`absolute top-0 right-0 left-10 p-1 text-white rounded-md cursor-pointer text-sm ${meetingColors[meeting.type]}`}
                    style={{ 
                      height: `${calculateMeetingHeight(meeting)}px`,
                      zIndex: 10 
                    }}
                    onClick={() => handleMeetingClick(meeting)}
                  >
                    <div className="font-semibold">{meeting.title}</div>
                    <div className="text-xs">{meeting.startTime} - {meeting.endTime}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    return (
      <div className="h-[600px] overflow-y-auto">
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const formattedDate = format(date, 'EEE, MMM d');
            const isCurrentDay = isToday(date);
            
            const dayMeetings = meetings.filter(meeting => {
              const meetingDate = new Date(meeting.date);
              return (
                meetingDate.getDate() === date.getDate() &&
                meetingDate.getMonth() === date.getMonth() &&
                meetingDate.getFullYear() === date.getFullYear()
              );
            });
            
            return (
              <div key={index} className="space-y-2">
                <div className={`text-center font-medium p-2 rounded-md ${isCurrentDay ? 'bg-primary text-primary-foreground' : ''}`}>
                  {formattedDate}
                </div>
                
                <div className="space-y-1">
                  {dayMeetings.map(meeting => (
                    <div 
                      key={meeting.id}
                      className={`p-2 text-white rounded-md cursor-pointer text-sm ${meetingColors[meeting.type]}`}
                      onClick={() => handleMeetingClick(meeting)}
                    >
                      <div className="font-semibold">{meeting.title}</div>
                      <div className="text-xs">{meeting.startTime} - {meeting.endTime}</div>
                      {meeting.recurring !== 'none' && (
                        <div className="text-xs flex items-center mt-1">
                          <Repeat className="h-3 w-3 mr-1" /> {meeting.recurring}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    // Calculate total cells needed (previous month days + current month days + next month days)
    const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
    
    const cells = [];
    
    // Add previous month days
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(currentYear, currentMonth, -firstDayOfWeek + i + 1);
      cells.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        day: prevMonthDay.getDate()
      });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentMonthDay = new Date(currentYear, currentMonth, i);
      cells.push({
        date: currentMonthDay,
        isCurrentMonth: true,
        day: i
      });
    }
    
    // Add next month days
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(currentYear, currentMonth + 1, i);
      cells.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        day: i
      });
    }
    
    return (
      <div className="h-[600px] overflow-y-auto">
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
          
          {cells.map((cell, index) => {
            const isToday = new Date().toDateString() === cell.date.toDateString();
            
            const cellMeetings = meetings.filter(meeting => {
              const meetingDate = new Date(meeting.date);
              return (
                meetingDate.getDate() === cell.date.getDate() &&
                meetingDate.getMonth() === cell.date.getMonth() &&
                meetingDate.getFullYear() === cell.date.getFullYear()
              );
            });
            
            return (
              <div 
                key={index}
                className={`h-24 border rounded-md p-1 ${cell.isCurrentMonth ? 'bg-white' : 'bg-gray-100'} ${isToday ? 'border-blue-500 border-2' : ''}`}
              >
                <div className="text-right text-sm font-medium mb-1">
                  {cell.day}
                </div>
                
                <div className="space-y-1 overflow-y-auto h-16">
                  {cellMeetings.length > 0 ? (
                    cellMeetings.slice(0, 2).map(meeting => (
                      <div 
                        key={meeting.id}
                        className={`p-1 text-white rounded-md cursor-pointer text-xs ${meetingColors[meeting.type]}`}
                        onClick={() => handleMeetingClick(meeting)}
                      >
                        {meeting.title}
                      </div>
                    ))
                  ) : null}
                  
                  {cellMeetings.length > 2 && (
                    <div className="text-xs text-center text-gray-500">
                      + {cellMeetings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper function to calculate meeting display height based on duration
  const calculateMeetingHeight = (meeting: Meeting) => {
    const startHour = parseInt(meeting.startTime.split(':')[0]);
    const startMinute = parseInt(meeting.startTime.split(':')[1]);
    const endHour = parseInt(meeting.endTime.split(':')[0]);
    const endMinute = parseInt(meeting.endTime.split(':')[1]);
    
    const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    // Scale factor (16px per hour = 0.26px per minute)
    return Math.max(durationMinutes * 0.26, 16);
  };
  
  return (
    <div className="space-y-4">
      {/* Reminder Notifications */}
      {showReminders && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BellRing className="h-5 w-5 mr-2 text-amber-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {meetings.filter(meeting => isToday(meeting.date)).map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between p-2 bg-white rounded-md border border-amber-200">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-gray-500">Today at {meeting.startTime}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleMeetingClick(meeting)}>View</Button>
                </div>
              ))}
              
              {meetings.filter(meeting => isTomorrow(meeting.date)).map(meeting => (
                <div key={meeting.id} className="flex items-center justify-between p-2 bg-white rounded-md border border-amber-200">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-gray-500">Tomorrow at {meeting.startTime}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleMeetingClick(meeting)}>View</Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={handleDismissReminders} className="ml-auto">
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPeriod}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextPeriod}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="week" value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Dialog open={showAddMeeting} onOpenChange={setShowAddMeeting}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule a New Meeting</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new meeting. All participants will receive notifications.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Meeting Title</label>
                    <Input 
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newMeeting.date ? format(newMeeting.date, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={newMeeting.date}
                          onSelect={(date) => setNewMeeting({...newMeeting, date})}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <Select 
                        value={newMeeting.startTime}
                        onValueChange={(value) => setNewMeeting({...newMeeting, startTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const formattedHour = hour < 10 ? `0${hour}` : hour;
                            const formattedMinute = minute === 0 ? '00' : minute;
                            return `${formattedHour}:${formattedMinute}`;
                          }).map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <Select 
                        value={newMeeting.endTime}
                        onValueChange={(value) => setNewMeeting({...newMeeting, endTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const formattedHour = hour < 10 ? `0${hour}` : hour;
                            const formattedMinute = minute === 0 ? '00' : minute;
                            return `${formattedHour}:${formattedMinute}`;
                          }).map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Meeting Type</label>
                    <Select 
                      value={newMeeting.type}
                      onValueChange={(value: 'work' | 'personal' | 'other') => setNewMeeting({...newMeeting, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Recurring</label>
                    <Select 
                      value={newMeeting.recurring}
                      onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => setNewMeeting({...newMeeting, recurring: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurring pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Participants</label>
                    <div className="flex space-x-2 mb-2">
                      <Input 
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        placeholder="Enter email address"
                      />
                      <Button type="button" variant="outline" onClick={handleAddParticipant}>Add</Button>
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {newMeeting.participants?.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 rounded p-2 text-sm">
                          <span>{participant}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveParticipant(participant)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      value={newMeeting.notes}
                      onChange={(e) => setNewMeeting({...newMeeting, notes: e.target.value})}
                      placeholder="Enter meeting notes"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Reminders</label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Reminder (1 day before)</span>
                        <Switch 
                          checked={newMeeting.reminders?.email || false}
                          onCheckedChange={(checked) => setNewMeeting({
                            ...newMeeting, 
                            reminders: {
                              ...(newMeeting.reminders || { inApp: true, custom: [] }),
                              email: checked
                            }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In-App Reminder (1 day before & 3 min before)</span>
                        <Switch 
                          checked={newMeeting.reminders?.inApp || false}
                          onCheckedChange={(checked) => setNewMeeting({
                            ...newMeeting, 
                            reminders: {
                              ...(newMeeting.reminders || { email: true, custom: [] }),
                              inApp: checked
                            }
                          })}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Custom Reminders (minutes before)</div>
                        <div className="flex space-x-2">
                          <Input 
                            type="number"
                            value={customReminder}
                            onChange={(e) => setCustomReminder(e.target.value)}
                            placeholder="Minutes"
                          />
                          <Button type="button" variant="outline" onClick={handleAddCustomReminder}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newMeeting.reminders?.custom?.map((minutes, index) => (
                            <div key={index} className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center">
                              {minutes} minutes
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCustomReminder(minutes)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Select 
                      value={newMeeting.timezone}
                      onValueChange={(value) => setNewMeeting({...newMeeting, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowAddMeeting(false)}>Cancel</Button>
                <Button onClick={handleAddMeeting} disabled={isUpdating}>
                  {isUpdating ? 'Scheduling...' : 'Schedule Meeting'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Calendar Views */}
      <div className="border rounded-md p-4 bg-white">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </div>
      
      {/* Meeting Details Dialog */}
      <Dialog open={showMeetingDetails} onOpenChange={setShowMeetingDetails}>
        <DialogContent className="max-w-2xl">
          {selectedMeeting && !editMode && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedMeeting.title}</DialogTitle>
                  <div className={`px-2 py-1 rounded text-white text-xs ${meetingColors[selectedMeeting.type]}`}>
                    {selectedMeeting.type.charAt(0).toUpperCase() + selectedMeeting.type.slice(1)}
                  </div>
                </div>
                <DialogDescription>
                  {format(selectedMeeting.date, 'PPPP')} • {selectedMeeting.startTime} - {selectedMeeting.endTime}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                {selectedMeeting.recurring !== 'none' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Repeat className="h-4 w-4 mr-2" />
                    Recurring {selectedMeeting.recurring}
                  </div>
                )}
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-sm">{selectedMeeting.startTime} - {selectedMeeting.endTime}</div>
                    <div className="text-xs text-gray-500">Timezone: {selectedMeeting.timezone}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Participants ({selectedMeeting.participants.length})</div>
                    <div className="text-sm">
                      {selectedMeeting.participants.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedMeeting.participants.map((participant, index) => (
                            <li key={index}>{participant}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500">No participants</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Bell className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Reminders</div>
                    <div className="space-y-1 text-sm">
                      {selectedMeeting.reminders.email && (
                        <div className="flex items-center">
                          <CheckIcon className="h-4 w-4 mr-1 text-green-500" /> Email (1 day before)
                        </div>
                      )}
                      {selectedMeeting.reminders.inApp && (
                        <div className="flex items-center">
                          <CheckIcon className="h-4 w-4 mr-1 text-green-500" /> In-App (1 day before & 3 min before)
                        </div>
                      )}
                      {selectedMeeting.reminders.custom.length > 0 && (
                        <div>
                          <div>Custom reminders:</div>
                          <ul className="list-disc list-inside">
                            {selectedMeeting.reminders.custom.map((minutes, index) => (
                              <li key={index}>{minutes} minutes before</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedMeeting.notes && (
                  <div className="border-t pt-3">
                    <div className="font-medium mb-1">Notes</div>
                    <div className="text-sm bg-gray-50 p-3 rounded">
                      {selectedMeeting.notes}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMeeting(selectedMeeting.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEditMeeting}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                
                <div className="space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => exportMeetingPDF(selectedMeeting)}>
                    Export PDF
                  </Button>
                  <Button size="sm" onClick={() => shareMeetingEmail(selectedMeeting)}>
                    Share via Email
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Edit Meeting Mode */}
          {editMode && editedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Meeting</DialogTitle>
                <DialogDescription>
                  Make changes to the meeting details.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Meeting Title</label>
                    <Input 
                      value={editedMeeting.title}
                      onChange={(e) => setEditedMeeting({...editedMeeting, title: e.target.value})}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(editedMeeting.date, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={editedMeeting.date}
                          onSelect={(date) => date && setEditedMeeting({...editedMeeting, date})}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <Select 
                        value={editedMeeting.startTime}
                        onValueChange={(value) => setEditedMeeting({...editedMeeting, startTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const formattedHour = hour < 10 ? `0${hour}` : hour;
                            const formattedMinute = minute === 0 ? '00' : minute;
                            return `${formattedHour}:${formattedMinute}`;
                          }).map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <Select 
                        value={editedMeeting.endTime}
                        onValueChange={(value) => setEditedMeeting({...editedMeeting, endTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 4 }, (_, i) => {
                            const hour = Math.floor(i / 4);
                            const minute = (i % 4) * 15;
                            const formattedHour = hour < 10 ? `0${hour}` : hour;
                            const formattedMinute = minute === 0 ? '00' : minute;
                            return `${formattedHour}:${formattedMinute}`;
                          }).map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Meeting Type</label>
                    <Select 
                      value={editedMeeting.type}
                      onValueChange={(value: 'work' | 'personal' | 'other') => setEditedMeeting({...editedMeeting, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Recurring</label>
                    <Select 
                      value={editedMeeting.recurring}
                      onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => setEditedMeeting({...editedMeeting, recurring: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurring pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Participants</label>
                    <div className="flex space-x-2 mb-2">
                      <Input 
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        placeholder="Enter email address"
                      />
                      <Button type="button" variant="outline" onClick={handleAddParticipant}>Add</Button>
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {editedMeeting.participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 rounded p-2 text-sm">
                          <span>{participant}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveParticipant(participant)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      value={editedMeeting.notes}
                      onChange={(e) => setEditedMeeting({...editedMeeting, notes: e.target.value})}
                      placeholder="Enter meeting notes"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Reminders</label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Reminder (1 day before)</span>
                        <Switch 
                          checked={editedMeeting.reminders.email}
                          onCheckedChange={(checked) => setEditedMeeting({
                            ...editedMeeting, 
                            reminders: {
                              ...editedMeeting.reminders,
                              email: checked
                            }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In-App Reminder (1 day before & 3 min before)</span>
                        <Switch 
                          checked={editedMeeting.reminders.inApp}
                          onCheckedChange={(checked) => setEditedMeeting({
                            ...editedMeeting, 
                            reminders: {
                              ...editedMeeting.reminders,
                              inApp: checked
                            }
                          })}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Custom Reminders (minutes before)</div>
                        <div className="flex space-x-2">
                          <Input 
                            type="number"
                            value={customReminder}
                            onChange={(e) => setCustomReminder(e.target.value)}
                            placeholder="Minutes"
                          />
                          <Button type="button" variant="outline" onClick={handleAddCustomReminder}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {editedMeeting.reminders.custom.map((minutes, index) => (
                            <div key={index} className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center">
                              {minutes} minutes
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCustomReminder(minutes)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Select 
                      value={editedMeeting.timezone}
                      onValueChange={(value) => setEditedMeeting({...editedMeeting, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleUpdateMeeting} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Meeting'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Connect Calendar Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="fixed bottom-8 right-8 shadow-lg flex items-center gap-2 bg-white">
            <Calendar className="h-4 w-4" />
            <span>Connect Calendar</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Calendar</DialogTitle>
            <DialogDescription>
              Connect with external calendar services to sync your meetings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2" 
              onClick={() => connectCalendar('google')}
            >
              <Globe className="h-5 w-5 text-red-500" />
              <span>Google Calendar</span>
            </Button>
            <Button 
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => connectCalendar('outlook')}
            >
              <Globe className="h-5 w-5 text-blue-500" />
              <span>Outlook</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

