
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

  const selectedDateNotes = getNotesForDate(date);

  return (
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
              className="rounded-md border"
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
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">{note.note}</p>
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
  );
};
