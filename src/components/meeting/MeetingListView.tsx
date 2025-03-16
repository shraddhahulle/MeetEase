
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, FileText, MapPin, Link, Users, CalendarClock, CalendarPlus } from 'lucide-react';
import { CalendarNote } from './types';

interface MeetingListViewProps {
  calendarNotes: CalendarNote[];
  onDelete: (date: Date, index: number) => void;
  onExportToPDF: (meeting: CalendarNote) => void;
  onAddMeeting: () => void;
}

const MeetingListView: React.FC<MeetingListViewProps> = ({ 
  calendarNotes, 
  onDelete, 
  onExportToPDF,
  onAddMeeting
}) => {
  // Group meetings by date
  const groupedMeetings = React.useMemo(() => {
    const groups: { [key: string]: CalendarNote[] } = {};
    
    calendarNotes
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach(note => {
        const dateKey = format(note.date, 'yyyy-MM-dd');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(note);
      });
      
    return groups;
  }, [calendarNotes]);

  return (
    <Card className="border-purple-100 shadow-lg dark:border-purple-800">
      <CardContent className="pt-6">
        {calendarNotes.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedMeetings).map(([dateKey, meetings]) => (
              <div key={dateKey} className="space-y-3">
                <h3 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-3 border-b border-purple-100 dark:border-purple-800 pb-2">
                  {format(new Date(dateKey), 'EEEE, MMMM dd, yyyy')}
                </h3>
                
                {meetings.map((note, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      note.color === 'indigo' ? 'border-l-4 border-l-indigo-500' :
                      note.color === 'purple' ? 'border-l-4 border-l-purple-500' :
                      note.color === 'green' ? 'border-l-4 border-l-green-500' :
                      note.color === 'red' ? 'border-l-4 border-l-red-500' :
                      note.color === 'orange' ? 'border-l-4 border-l-orange-500' :
                      'border-l-4 border-l-blue-500'
                    } transition-all hover:-translate-y-1 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{note.title || 'Untitled Meeting'}</h3>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-3 mt-1.5">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} className="mr-1.5 flex-shrink-0" />
                            <span>{note.startTime || '00:00'} - {note.endTime || '00:00'}</span>
                          </div>
                          
                          {note.location && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {note.location.includes('http') || note.location.toLowerCase().includes('zoom') || note.location.toLowerCase().includes('meet') ? (
                                <Link size={14} className="mr-1.5 flex-shrink-0" />
                              ) : (
                                <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                              )}
                              <span>{note.location}</span>
                            </div>
                          )}
                          
                          {note.isRecurring && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <CalendarClock size={14} className="mr-1.5 flex-shrink-0" />
                              <span>Recurring</span>
                            </div>
                          )}
                          
                          {note.participants && note.participants.length > 0 && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Users size={14} className="mr-1.5 flex-shrink-0" />
                              <span>
                                {note.participants.length === 1 
                                  ? note.participants[0] 
                                  : `${note.participants.length} participants`}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="mt-2 text-sm">{note.note}</p>
                      </div>
                      <div className="flex space-x-1 ml-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onExportToPDF(note)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <FileText size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-8 w-8 p-0 rounded-full"
                          onClick={() => onDelete(note.date, index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CalendarPlus size={28} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">No meetings on your calendar</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first meeting</p>
            <Button 
              onClick={onAddMeeting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Add Your First Meeting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingListView;
