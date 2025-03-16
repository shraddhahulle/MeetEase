
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Users, Trash2, Edit, FileText, MapPin, Link, CalendarClock } from 'lucide-react';
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
        <div className="space-y-4">
          {selectedDateNotes.map((note, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 shadow-md transition-all hover:-translate-y-1 ${
                note.color === 'indigo' ? 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' :
                note.color === 'purple' ? 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                note.color === 'green' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' :
                note.color === 'red' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                note.color === 'orange' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{note.title || 'Untitled Meeting'}</h3>
                  
                  <div className="flex flex-wrap gap-y-2 mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mr-4">
                      <Clock size={14} className="mr-1.5 flex-shrink-0" />
                      <span>{note.startTime || '00:00'} - {note.endTime || '00:00'}</span>
                    </div>
                    
                    {note.location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mr-4">
                        {note.location.includes('http') || note.location.toLowerCase().includes('zoom') || note.location.toLowerCase().includes('meet') ? (
                          <Link size={14} className="mr-1.5 flex-shrink-0" />
                        ) : (
                          <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                        )}
                        <span>{note.location}</span>
                      </div>
                    )}
                    
                    {note.isRecurring && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarClock size={14} className="mr-1.5 flex-shrink-0" />
                        <span>Recurring ({note.recurringPattern})</span>
                      </div>
                    )}
                  </div>
                  
                  {note.participants && note.participants.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <Users size={14} className="mr-1.5 flex-shrink-0" />
                      <span>
                        {note.participants.length === 1 
                          ? note.participants[0] 
                          : `${note.participants.length} participants`}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{note.note}</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1 ml-4">
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
                    className="h-8 w-8 p-0 rounded-full"
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
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-8 w-8 p-0 rounded-full"
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
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <CalendarClock size={28} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">No meetings scheduled for this date</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Plan your day by adding meetings to your calendar</p>
          <Button 
            onClick={onShowForm}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            Schedule a Meeting
          </Button>
        </div>
      )}
    </>
  );
};

export default MeetingDetails;
