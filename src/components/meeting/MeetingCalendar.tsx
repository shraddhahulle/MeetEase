
import React from 'react';
import { useCalendarState } from '@/hooks/useCalendarState';
import MeetingListView from './MeetingListView';
import CalendarView from './CalendarView';
import CalendarViewControls from './CalendarViewControls';
import { handleExportAllToPDF, handleExportMeetingToPDF } from './meetingUtils';

export const MeetingCalendar: React.FC = () => {
  const {
    date,
    setDate,
    calendarNotes,
    showForm,
    setShowForm,
    viewMode,
    setViewMode,
    timeZone,
    theme,
    selectedDateNotes,
    toggleTheme,
    addNote,
    deleteNote,
    deleteNoteFromList
  } = useCalendarState();

  // Switch to calendar view and show form
  const handleAddFirstMeeting = () => {
    setDate(new Date());
    setShowForm(true);
    setViewMode('calendar');
  };

  // Handle exporting all to PDF
  const handleExportAll = () => {
    handleExportAllToPDF(calendarNotes);
  };

  return (
    <div className="space-y-4">
      <CalendarViewControls 
        viewMode={viewMode}
        setViewMode={setViewMode}
        toggleTheme={toggleTheme}
        theme={theme}
        handleExportAll={handleExportAll}
      />
      
      {viewMode === 'calendar' ? (
        <CalendarView
          date={date}
          setDate={setDate}
          showForm={showForm}
          setShowForm={setShowForm}
          timeZone={timeZone}
          calendarNotes={calendarNotes}
          selectedDateNotes={selectedDateNotes}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
        />
      ) : (
        <MeetingListView
          calendarNotes={calendarNotes}
          onDelete={deleteNoteFromList}
          onExportToPDF={(meeting) => handleExportMeetingToPDF(meeting)}
          onAddMeeting={handleAddFirstMeeting}
        />
      )}
    </div>
  );
};

export default MeetingCalendar;
