
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarNote {
  date: Date;
  note: string;
}

export const MeetingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [noteText, setNoteText] = useState<string>('');
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

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
        note: "Weekly team sync meeting at 10:00 AM. Discuss Q2 roadmap priorities."
      },
      {
        date: tomorrow,
        note: "Follow up with Mike about the customer segmentation report."
      },
      {
        date: nextWeek,
        note: "Marketing review meeting - Assess results of TikTok campaign."
      }
    ];
    
    setCalendarNotes(initialNotes);
  }, []);

  const addNote = () => {
    if (!date || !noteText.trim()) {
      toast({
        title: "Cannot Add Note",
        description: "Please select a date and enter a note.",
        variant: "destructive",
      });
      return;
    }

    const newNote: CalendarNote = {
      date: new Date(date.getTime()),
      note: noteText.trim()
    };

    setCalendarNotes([...calendarNotes, newNote]);
    setNoteText('');
    setShowForm(false);

    toast({
      title: "Note Added",
      description: `Note added for ${date.toLocaleDateString()}.`,
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
        title: "Note Deleted",
        description: "Calendar note has been removed.",
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
                    Add Note for Selected Date
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {date ? date.toDateString() : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showForm ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your note for this date..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={addNote}>
                        Save Note
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false);
                          setNoteText('');
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
                          <div key={index} className="p-3 bg-gray-50 rounded-md flex justify-between">
                            <p className="text-sm">{note.note}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-red-500 hover:text-red-700"
                              onClick={() => deleteNote(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No notes for this date</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowForm(true)}
                          className="mt-2"
                        >
                          Add a note
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
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-indigo-600">
                            {note.date.toDateString()}
                          </p>
                          <p className="mt-1">{note.note}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 h-6"
                          onClick={() => {
                            setDate(note.date);
                            deleteNote(index);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No notes on your calendar</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setDate(new Date());
                      setShowForm(true);
                      setViewMode('calendar');
                    }}
                    className="mt-2"
                  >
                    Add your first note
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
