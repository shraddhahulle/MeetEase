
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import GradientButton from '@/components/ui/GradientButton';
import { 
  CalendarDays, 
  Mail, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  Menu, 
  X,
  Plus,
  Settings,
  LogOut
} from 'lucide-react';
import { ScheduleDemo } from '@/components/ui/ScheduleDemo';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Team Standup', date: '2023-10-24', time: '09:00 AM', attendees: 5 },
    { id: 2, title: 'Product Review', date: '2023-10-25', time: '02:30 PM', attendees: 3 },
  ]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);

  // This would normally check authentication state
  useEffect(() => {
    toast({
      title: "Welcome to MeetEase",
      description: "You're now on the dashboard. This is a demo version.",
    });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewMeeting = () => {
    setShowNewMeetingForm(true);
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full bg-white shadow-md"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 bg-white shadow-md w-64 transition-transform duration-300 ease-in-out z-40 lg:z-auto`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-meetease-blue rounded-full"></span>
            <h1 className="text-xl font-bold">MeetEase</h1>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Calendar className="w-5 h-5" />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('meetings')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'meetings' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Clock className="w-5 h-5" />
                <span>My Meetings</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('schedule')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'schedule' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <CalendarDays className="w-5 h-5" />
                <span>Schedule</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('team')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'team' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Users className="w-5 h-5" />
                <span>Team</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-8 pt-6 border-t">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'meetings' && 'My Meetings'}
              {activeTab === 'schedule' && 'Schedule'}
              {activeTab === 'team' && 'Team Members'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  This is a fully functional demo version of the MeetEase dashboard. Explore the features and see how AI scheduling can transform your meeting experience.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-meetease-blue/10 rounded-lg p-4 flex items-center">
                    <Calendar className="w-10 h-10 text-meetease-blue mr-3" />
                    <div>
                      <h3 className="font-medium">Upcoming Meetings</h3>
                      <p className="text-sm text-gray-600">{meetings.length} meetings scheduled</p>
                    </div>
                  </div>
                  
                  <div className="bg-meetease-purple/10 rounded-lg p-4 flex items-center">
                    <Clock className="w-10 h-10 text-meetease-purple mr-3" />
                    <div>
                      <h3 className="font-medium">AI Suggestions</h3>
                      <p className="text-sm text-gray-600">3 free suggestions available</p>
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
                      description: "Connected to your calendar successfully!",
                    });
                  }}>
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Connect Calendar
                  </GradientButton>
                  
                  <GradientButton variant="secondary" onClick={handleNewMeeting}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Meeting
                  </GradientButton>
                  
                  <GradientButton variant="outline" onClick={() => navigate('/')}>
                    Back to Home
                  </GradientButton>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Recent Meetings</h3>
                {meetings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {meetings.map((meeting) => (
                          <tr key={meeting.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{meeting.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{meeting.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{meeting.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{meeting.attendees}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  toast({
                                    title: "Meeting Details",
                                    description: `Viewing details for ${meeting.title}`,
                                  });
                                }}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No meetings scheduled yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Meetings Tab */}
          {activeTab === 'meetings' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Meetings</h2>
                <GradientButton onClick={handleNewMeeting}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </GradientButton>
              </div>
              
              {meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          <p className="text-gray-600">{meeting.date} at {meeting.time}</p>
                          <p className="text-gray-600">{meeting.attendees} attendees</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Edit Meeting",
                                description: `Editing ${meeting.title}`,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setMeetings(meetings.filter(m => m.id !== meeting.id));
                              toast({
                                title: "Meeting Canceled",
                                description: `${meeting.title} has been canceled`,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No meetings yet</h3>
                  <p className="text-gray-500 mb-6">Schedule your first meeting to get started</p>
                  <GradientButton onClick={handleNewMeeting}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Meeting
                  </GradientButton>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Schedule a Meeting</h2>
                <ScheduleDemo />
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Team Management</h2>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Invite Your Team</h3>
                <p className="text-gray-500 mb-6">Add team members to collaborate on scheduling</p>
                <GradientButton 
                  onClick={() => {
                    toast({
                      title: "Team Invitations",
                      description: "Invitations have been sent to your team members",
                    });
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitations
                </GradientButton>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="Demo User"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="demo@meetease.example"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meetease-blue"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Calendar Reminders</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meetease-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <GradientButton 
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Your account settings have been updated",
                      });
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </GradientButton>
                </div>
              </div>
            </div>
          )}

          {/* New Meeting Form */}
          {showNewMeetingForm && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Schedule New Meeting</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                    <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter meeting title" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input type="time" className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Participants (emails)</label>
                    <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Enter email addresses separated by commas" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Enter meeting description" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewMeetingForm(false)}
                  >
                    Cancel
                  </Button>
                  <GradientButton 
                    onClick={() => {
                      const newMeeting = {
                        id: meetings.length + 1,
                        title: 'New Meeting',
                        date: '2023-11-01',
                        time: '10:00 AM',
                        attendees: 2,
                      };
                      setMeetings([...meetings, newMeeting]);
                      setShowNewMeetingForm(false);
                      toast({
                        title: "Meeting Scheduled",
                        description: "Your new meeting has been scheduled successfully!",
                      });
                    }}
                  >
                    Schedule Meeting
                  </GradientButton>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
