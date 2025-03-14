
import React from 'react';
import { Check, Download, Send, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MeetingEndedScreenProps {
  meetingNotes: string | null;
  meetingTopic: string;
  recordingTime: number;
  startNewMeeting: () => void;
}

export const MeetingEndedScreen: React.FC<MeetingEndedScreenProps> = ({
  meetingNotes,
  meetingTopic,
  recordingTime,
  startNewMeeting
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadPDF = () => {
    toast({
      title: "PDF Downloaded",
      description: "Meeting notes have been downloaded as PDF.",
    });
  };

  const emailNotes = () => {
    toast({
      title: "Notes Shared",
      description: "Meeting notes have been emailed to all participants.",
    });
  };

  const scheduleFollowUp = () => {
    toast({
      title: "Follow-up Scheduled",
      description: "A follow-up meeting has been scheduled for next week.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="h-12 w-12 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Meeting Ended</h2>
      <p className="text-gray-500 mb-6">{meetingTopic} - Duration: {formatTime(recordingTime)}</p>
      
      <div className="bg-gray-50 border rounded-lg p-4 mb-8 w-full max-w-md">
        <h3 className="font-medium mb-2">AI has processed your meeting</h3>
        <p className="text-sm text-gray-600 mb-4">
          We've generated notes, action items, and insights from your conversation.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button variant="outline" className="flex items-center justify-center" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center" onClick={emailNotes}>
            <Send className="h-4 w-4 mr-2" />
            Email Notes
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center" onClick={scheduleFollowUp}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
          
          <Button onClick={startNewMeeting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            New Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};
