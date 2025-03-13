
import React, { useState } from 'react';
import { Calendar, Bell, Mail, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { toast } from '@/hooks/use-toast';

export const ReminderExample = () => {
  const [showPreview, setShowPreview] = useState(false);
  
  const handleDemoReminder = () => {
    toast({
      title: "Demo Reminder Triggered",
      description: "This shows how users receive email and app notifications 2 days before meetings",
    });
    
    setShowPreview(true);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-bold mb-3">How Reminders Work</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Our system automatically sends email reminders and app notifications 2 days before scheduled meetings.
      </p>
      
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-start border rounded-lg p-3 bg-blue-50">
          <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Scheduled Meeting</h4>
            <p className="text-sm text-gray-600">When a meeting is scheduled, it's added to the system</p>
          </div>
        </div>
        
        <div className="flex items-start border rounded-lg p-3 bg-purple-50">
          <Bell className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium">2 Days Before</h4>
            <p className="text-sm text-gray-600">The system automatically checks upcoming meetings and triggers reminders</p>
          </div>
        </div>
        
        <div className="flex items-start border rounded-lg p-3 bg-green-50">
          <Mail className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Reminder Sent</h4>
            <p className="text-sm text-gray-600">Users receive both email notifications and in-app reminders</p>
          </div>
        </div>
      </div>
      
      <Button onClick={handleDemoReminder} className="w-full mb-4">
        See an Example Reminder
      </Button>
      
      {showPreview && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Meeting Reminder Email</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Upcoming Meeting Reminder</div>
                <div className="text-sm text-gray-500">From: noreply@meetease.com</div>
              </div>
              <div className="text-sm text-gray-500">2 days ago</div>
            </div>
            
            <div className="border-t pt-3">
              <p className="font-medium mb-2">Hello there,</p>
              <p className="text-sm text-gray-700 mb-3">
                This is a friendly reminder that you have an upcoming meeting:
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <p className="font-medium">Team Standup</p>
                <p className="text-sm">Date: Oct 24, 2025</p>
                <p className="text-sm">Time: 09:00 AM</p>
                <p className="text-sm">Attendees: 5</p>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                Please make sure to prepare any necessary materials and join on time.
              </p>
              
              <div className="text-center">
                <Button className="w-full mb-2">View Meeting Details</Button>
                <Button variant="outline" className="w-full">Add to Calendar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
