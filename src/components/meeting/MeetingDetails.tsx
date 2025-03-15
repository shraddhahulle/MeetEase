
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock, Users, Trash2, Edit, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarNote } from './types';

interface MeetingDetailsProps {
  selectedDate: Date | undefined;
  selectedDateNotes: CalendarNote[];
  onDelete: (index: number) => void;
  onExportToPDF: (meeting: CalendarNote) => void;
  onShowForm: () => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ 
  selectedDate, 
  selectedDateNotes, 
  onDelete, 
  onExportToPDF,
  onShowForm
}) => {
  return (
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
                    onClick={() => onExportToPDF(note)}
                    className="h-8 px-2"
                  >
                    <FileText size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => {
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
                    onClick={() => onDelete(index)}
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
            onClick={onShowForm}
            className="mt-2"
          >
            Add a meeting
          </Button>
        </div>
      )}
    </>
  );
};

export default MeetingDetails;
