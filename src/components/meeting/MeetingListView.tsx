
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, FileText } from 'lucide-react';
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
  return (
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
                        onClick={() => onExportToPDF(note)}
                        className="h-8 px-2"
                      >
                        <FileText size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 h-8 px-2"
                        onClick={() => onDelete(note.date, index)}
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
                onClick={onAddMeeting}
                className="mt-2"
              >
                Add your first meeting
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingListView;
