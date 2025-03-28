
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[];
  notes: string;
  location?: string;
  reminderSent: boolean;
}

/**
 * Generate and download a PDF with meeting details
 * This ensures the file downloads to the user's actual downloads folder
 */
export const downloadMeetingPDF = (meeting: Meeting) => {
  // Initialize jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add title with vibrant styling
  doc.setFontSize(22);
  doc.setTextColor(252, 82, 151); // Vibrant pink
  doc.text('Meeting Details', 105, 20, { align: 'center' });
  
  // Add logo or branding
  doc.setFontSize(14);
  doc.setTextColor(113, 47, 255); // Vibrant purple
  doc.text('MeetEase', 105, 30, { align: 'center' });
  
  // Add a gradient-like horizontal line
  doc.setDrawColor(252, 82, 151); // Vibrant pink
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add meeting title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(meeting.title, 20, 45);
  
  // Add date and time
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);
  const formattedDate = format(meeting.date, 'MMMM dd, yyyy');
  doc.text(`Date: ${formattedDate}`, 20, 55);
  doc.text(`Time: ${meeting.startTime} - ${meeting.endTime}`, 20, 62);
  
  // Add location if available
  if (meeting.location) {
    doc.text(`Location: ${meeting.location}`, 20, 69);
  }
  
  // Add participants
  if (meeting.participants.length > 0) {
    const yPos = meeting.location ? 76 : 69;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 210, 255); // Vibrant cyan
    doc.text('Participants', 20, yPos);
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    
    meeting.participants.forEach((participant, index) => {
      doc.text(`• ${participant}`, 25, yPos + 7 + (index * 7));
    });
  }
  
  // Add notes
  if (meeting.notes) {
    const participantsOffset = meeting.participants.length > 0 ? 
      meeting.participants.length * 7 + 15 : 0;
    const locationOffset = meeting.location ? 7 : 0;
    const yPos = 69 + locationOffset + participantsOffset;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 210, 255); // Vibrant cyan
    doc.text('Notes', 20, yPos);
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    
    // Break long notes into multiple lines if needed
    const splitNotes = doc.splitTextToSize(meeting.notes, 160);
    doc.text(splitNotes, 25, yPos + 7);
  }
  
  // Add reminder information
  const notesOffset = meeting.notes ? 50 : 0;
  const participantsOffset = meeting.participants.length > 0 ? 
    meeting.participants.length * 7 + 15 : 0;
  const locationOffset = meeting.location ? 7 : 0;
  const yPos = 69 + locationOffset + participantsOffset + notesOffset;
  
  doc.setFontSize(14);
  doc.setTextColor(113, 47, 255); // Vibrant purple
  doc.text('Reminders', 20, yPos);
  
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);
  doc.text('• Email reminder: 1 day before meeting', 25, yPos + 7);
  
  // Add a decorative element at the bottom
  doc.setDrawColor(252, 82, 151); // Vibrant pink
  doc.setLineWidth(0.5);
  doc.line(20, 270, 190, 270);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(113, 47, 255); // Vibrant purple
  doc.text('Generated by MeetEase Calendar', 105, 280, { align: 'center' });
  doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 105, 285, { align: 'center' });
  
  // Download the PDF to the user's actual download folder
  const fileName = `meeting-${meeting.title.replace(/\s+/g, '-').toLowerCase()}-${format(meeting.date, 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
