
export interface CalendarNote {
  date: Date;
  note: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  participants?: string[];
  location?: string;
  color?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  reminders?: {
    time: Date;
    type: 'email' | 'notification' | 'custom';
  }[];
}

export interface ReminderInput {
  time: string;
  type: 'email' | 'notification' | 'custom';
}

export type ViewMode = 'calendar' | 'list';
