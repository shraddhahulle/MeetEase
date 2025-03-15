
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FullCalendar } from '@/components/calendar/FullCalendar';
import { Plus, FileText, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MeetingCalendar } from '@/components/meeting/MeetingCalendar';
import { toast } from '@/hooks/use-toast';
import { exportMeetingsToPDF } from '@/utils/pdfExport';

// Sample meeting data for demonstration
const sampleMeetings = [
  {
    id: 1,
    title: "Weekly Team Sync",
    startTime: new Date(new Date().setHours(10, 0)),
    endTime: new Date(new Date().setHours(11, 0)),
    description: "Weekly team sync meeting to discuss progress and blockers",
    location: "Conference Room A",
    participants: ["john@example.com", "sarah@example.com", "mike@example.com"],
  },
  {
    id: 2,
    title: "Product Planning",
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: "Plan the roadmap for the next quarter",
    location: "Virtual Meeting",
    participants: ["product@example.com", "design@example.com", "dev@example.com"],
  }
];

const MeetingCalendarPage: React.FC = () => {
  const [viewType, setViewType] = useState<'fullCalendar' | 'compact'>('fullCalendar');
  
  // Function to handle exporting all meetings
  const handleExportAll = () => {
    exportMeetingsToPDF(sampleMeetings);
    toast({
      title: "PDF Generated",
      description: "Your meeting calendar has been exported to PDF",
    });
  };

  // Function to auto-remove past meetings (would connect to backend in real implementation)
  useEffect(() => {
    // This would be a real API call in a production app
    const cleanupPastMeetings = () => {
      console.log("Cleaning up past meetings automatically...");
      // Simulate success with toast
      toast({
        title: "Calendar Cleaned",
        description: "Past meetings have been automatically archived",
      });
    };
    
    // Run once when component mounts
    cleanupPastMeetings();
    
    // Set up a daily interval to clean past meetings
    const interval = setInterval(cleanupPastMeetings, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Meeting Calendar</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewType(viewType === 'fullCalendar' ? 'compact' : 'fullCalendar')}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
          >
            {viewType === 'fullCalendar' ? 'Simple View' : 'Calendar View'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportAll}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
          >
            <FileText size={16} className="mr-2" />
            Export All
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2">
            <Plus size={16} />
            <span>New Meeting</span>
          </Button>
        </div>
      </div>
      
      <Card className="p-4 shadow-lg border border-indigo-100 bg-white/80 backdrop-blur-sm">
        {viewType === 'fullCalendar' ? (
          <FullCalendar />
        ) : (
          <MeetingCalendar />
        )}
      </Card>
      
      {/* Floating Add Meeting Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default MeetingCalendarPage;
