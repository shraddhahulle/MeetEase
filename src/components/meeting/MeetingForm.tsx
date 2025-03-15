
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { CalendarNote, ReminderInput } from './types';

interface MeetingFormProps {
  date: Date | undefined;
  onSave: (note: CalendarNote) => void;
  onCancel: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ date, onSave, onCancel }) => {
  const [noteText, setNoteText] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [participants, setParticipants] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [color, setColor] = useState<string>('indigo');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringPattern, setRecurringPattern] = useState<string>('weekly');
  const [reminders, setReminders] = useState<ReminderInput[]>([
    { time: '1d', type: 'email' },
    { time: '3m', type: 'notification' }
  ]);
  
  // Reminder Dialog state
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderTime, setReminderTime] = useState('30m');
  const [reminderType, setReminderType] = useState<'email' | 'notification' | 'custom'>('notification');
  
  // Handle adding a new reminder
  const handleAddReminder = () => {
    setReminders([...reminders, { time: reminderTime, type: reminderType }]);
    setShowReminderDialog(false);
    
    toast({
      title: "Reminder Added",
      description: `A ${reminderType} reminder has been set for ${reminderTime} before the meeting.`,
    });
  };
  
  // Handle removing a reminder
  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
  };
  
  const handleSave = () => {
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

    onSave(newNote);
  };
  
  return (
    <>
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
          <Button onClick={handleSave}>
            Save Meeting
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      
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
    </>
  );
};

export default MeetingForm;
