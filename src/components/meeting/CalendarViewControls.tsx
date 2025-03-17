
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Share2, Sun, Moon, Calendar as CalendarIcon, List } from 'lucide-react';
import { ViewMode } from './types';
import { toast } from '@/hooks/use-toast';

interface CalendarViewControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  handleExportAll: () => void;
}

const CalendarViewControls: React.FC<CalendarViewControlsProps> = ({
  viewMode,
  setViewMode,
  toggleTheme,
  theme,
  handleExportAll
}) => {
  // Sync with Google Calendar (simulated)
  const syncWithGoogleCalendar = () => {
    toast({
      title: "Google Calendar",
      description: "Syncing with Google Calendar...",
    });
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Calendar synced with Google Calendar",
      });
    }, 1500);
  };

  // Sync with Outlook Calendar (simulated)
  const syncWithOutlookCalendar = () => {
    toast({
      title: "Outlook Calendar",
      description: "Syncing with Outlook Calendar...",
    });
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Calendar synced with Outlook Calendar",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Meeting Schedule
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={viewMode === 'calendar' ? 'default' : 'outline'} 
          size="sm"
          className={viewMode === 'calendar' 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
            : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30'}
          onClick={() => setViewMode('calendar')}
        >
          <CalendarIcon size={16} className="mr-2" />
          Calendar
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'} 
          size="sm"
          className={viewMode === 'list' 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
            : 'border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30'}
          onClick={() => setViewMode('list')}
        >
          <List size={16} className="mr-2" />
          List View
        </Button>
        <Button
          variant="outline"
          size="sm"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30"
            >
              <FileText size={16} className="mr-2" />
              Export
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 shadow-lg border-purple-100 dark:border-purple-800">
            <div className="p-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                onClick={handleExportAll}
              >
                <FileText size={16} className="mr-2" />
                Export All to PDF
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                onClick={syncWithGoogleCalendar}
              >
                <Share2 size={16} className="mr-2" />
                Sync with Google
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-200"
                onClick={syncWithOutlookCalendar}
              >
                <Share2 size={16} className="mr-2" />
                Sync with Outlook
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CalendarViewControls;
