
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import GradientButton from '@/components/ui/GradientButton';
import { CalendarDays, Mail, Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // This would normally check authentication state
  React.useEffect(() => {
    toast({
      title: "Welcome to MeetEase",
      description: "You're now on the dashboard. This is a demo version.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-meetease-blue rounded-full"></span>
            <h1 className="text-xl font-bold">MeetEase</h1>
          </div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            This is a demo version of the MeetEase dashboard. In the full application, 
            you would see your scheduled meetings, upcoming events, and have access to
            all the powerful AI scheduling features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-meetease-blue/10 rounded-lg p-4 flex items-center">
              <Calendar className="w-10 h-10 text-meetease-blue mr-3" />
              <div>
                <h3 className="font-medium">Upcoming Meetings</h3>
                <p className="text-sm text-gray-600">You have no meetings scheduled yet</p>
              </div>
            </div>
            
            <div className="bg-meetease-purple/10 rounded-lg p-4 flex items-center">
              <Clock className="w-10 h-10 text-meetease-purple mr-3" />
              <div>
                <h3 className="font-medium">AI Suggestions</h3>
                <p className="text-sm text-gray-600">Connect your calendar to get started</p>
              </div>
            </div>
            
            <div className="bg-meetease-indigo/10 rounded-lg p-4 flex items-center">
              <Users className="w-10 h-10 text-meetease-indigo mr-3" />
              <div>
                <h3 className="font-medium">Team Members</h3>
                <p className="text-sm text-gray-600">Invite your team to collaborate</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <GradientButton onClick={() => {
              toast({
                title: "Calendar Integration",
                description: "Connecting to your calendar would happen here.",
              });
            }}>
              <CalendarDays className="w-4 h-4 mr-2" />
              Connect Calendar
            </GradientButton>
            
            <GradientButton variant="secondary" onClick={() => {
              toast({
                title: "Schedule Meeting",
                description: "You can create a new meeting here.",
              });
            }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Schedule Meeting
            </GradientButton>
            
            <GradientButton variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </GradientButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
