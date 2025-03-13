
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import GradientButton from '@/components/ui/GradientButton';
import { LogoImage } from '@/components/ui/LogoImage';
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
  LogOut,
  BellRing,
  MessageSquare,
  VideoIcon
} from 'lucide-react';
import { ScheduleDemo } from '@/components/ui/ScheduleDemo';
import { VideoMeeting } from '@/components/ui/VideoMeeting';
import { TeamMembers } from '@/components/ui/TeamMembers';
import { ReminderExample } from '@/components/ui/ReminderExample';

// Sample meetings data - in a real app, this would come from an API
const initialMeetings = [
  { id: 1, title: 'Team Standup', date: '2025-10-24', time: '09:00 AM', attendees: 5, notified: false },
  { id: 2, title: 'Product Review', date: '2025-10-25', time: '02:30 PM', attendees: 3, notified: false },
];

// Sample previous meeting notes
const previousMeetingNotes = [
  {
    id: 1,
    title: 'Marketing Strategy',
    date: '2025-10-20',
    summary: 'Discussed Q4 marketing plans, social media strategy, and upcoming product launch campaign.',
    aiSuggestions: [
      'Increase budget allocation for Instagram ads based on previous performance',
      'Consider creating short-form video content for TikTok',
      'Schedule follow-up meeting with design team about new brand assets'
    ]
  },
  {
    id: 2,
    title: 'Development Sprint Planning',
    date: '2025-10-18',
    summary: 'Assigned tasks for the new sprint, discussed technical challenges with the payment integration.',
    aiSuggestions: [
      'Consider implementing a staged rollout for the new features',
      'Allocate more time for testing the payment gateway',
      'Schedule a dedicated security review session'
    ]
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [meetingFormData, setMeetingFormData] = useState({
    title: '',
    date: '',
    time: '',
    participants: '',
    description: ''
  });

  // Check if any meetings are coming up in 2 days and notify
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const today = new Date();
      const twoDaysLater = new Date();
      twoDaysLater.setDate(today.getDate() + 2);
      twoDaysLater.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      meetings.forEach(meeting => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);
        
        if (
          meetingDate.getTime() === twoDaysLater.getTime() && 
          !meeting.notified
        ) {
          // In a real app, this would send an email
          toast({
            title: "Upcoming Meeting Reminder",
            description: `Your meeting "${meeting.title}" is coming up in 2 days on ${meeting.date} at ${meeting.time}`,
          });
          
          // Mark as notified
          setMeetings(prevMeetings => 
            prevMeetings.map(m => 
              m.id === meeting.id ? { ...m, notified: true } : m
            )
          );
          
          console.info(`Reminder would be sent for meeting: ${meeting.title} on ${meeting.date}`);
        }
      });
    };
    
    // Check immediately and then every hour
    checkUpcomingMeetings();
    const interval = setInterval(checkUpcomingMeetings, 3600000);
    
    return () => clearInterval(interval);
  }, [meetings]);

  useEffect(() => {
    toast({
      title: "Welcome to Your Dashboard",
      description: "You're now on the dashboard. Your upcoming meetings will be shown here.",
    });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewMeeting = () => {
    setShowNewMeetingForm(true);
    setMeetingFormData({
      title: '',
      date: '',
      time: '',
      participants: '',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeetingFormData({
      ...meetingFormData,
      [name]: value
    });
  };

  const handleCreateMeeting = () => {
    if (!meetingFormData.title || !meetingFormData.date || !meetingFormData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const participantsCount = meetingFormData.participants.split(',').filter(p => p.trim()).length;
    
    const newMeeting = {
      id: meetings.length + 1,
      title: meetingFormData.title,
      date: meetingFormData.date,
      time: meetingFormData.time,
      attendees: participantsCount + 1, // +1 for the organizer
      notified: false
    };
    
    setMeetings([...meetings, newMeeting]);
    setShowNewMeetingForm(false);
    
    toast({
      title: "Meeting Scheduled",
      description: "Your new meeting has been scheduled successfully!",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };
  
  const connectCalendar = () => {
    toast({
      title: "Calendar Connected",
      description: "Your calendar has been successfully connected!",
    });
  };
  
  const handleAISuggestions = () => {
    toast({
      title: "AI Suggestions",
      description: "Analyzing your schedule for optimal meeting times...",
    });
    
    setTimeout(() => {
      toast({
        title: "AI Suggestions Ready",
        description: "Based on your team's availability, Tuesday at 2:00 PM is the optimal meeting time.",
      });
    }, 2000);
  };
  
  const handleInviteTeam = () => {
    toast({
      title: "Team Invitations",
      description: "Invitations have been sent to your team members",
    });
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
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 bg-white shadow-md w-48 transition-transform duration-300 ease-in-out z-40 lg:z-auto`}>
        <div className="p-2 border-b flex items-center justify-center">
          <LogoImage size="sm" />
        </div>
        
        <nav className="p-1">
          <ul className="space-y-0.5">
            <li>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Calendar className="w-4 h-4" />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('meetings')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'meetings' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Clock className="w-4 h-4" />
                <span>My Meetings</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('schedule')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'schedule' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Schedule</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('team')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'team' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <Users className="w-4 h-4" />
                <span>Team</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('videos')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'videos' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <VideoIcon className="w-4 h-4" />
                <span>Video Meeting</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('ai')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'ai' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Notes</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('reminders')} 
                className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'reminders' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
              >
                <BellRing className="w-4 h-4" />
                <span>Reminders</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-3 pt-3 border-t">
            <ul className="space-y-0.5">
              <li>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-meetease-blue text-white' : 'hover:bg-gray-100'}`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left p-2 rounded-lg flex items-center gap-2 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <h1 className="text-lg font-bold">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'meetings' && 'My Meetings'}
              {activeTab === 'schedule' && 'Schedule'}
              {activeTab === 'team' && 'Team Members'}
              {activeTab === 'videos' && 'Video Meeting'}
              {activeTab === 'ai' && 'AI Meeting Notes'}
              {activeTab === 'reminders' && 'Meeting Reminders'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                size="sm"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-3">Welcome to Your Dashboard</h2>
                <p className="text-gray-600 mb-4">
                  Use the dashboard to manage your meetings and schedule. You'll receive email reminders two days before your meetings.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <button 
                    onClick={() => setActiveTab('meetings')}
                    className="bg-meetease-blue/10 rounded-lg p-3 flex items-center hover:bg-meetease-blue/20 transition-colors"
                  >
                    <Calendar className="w-8 h-8 text-meetease-blue mr-3" />
                    <div className="text-left">
                      <h3 className="font-medium">Upcoming Meetings</h3>
                      <p className="text-sm text-gray-600">{meetings.length} meetings scheduled</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('ai')}
                    className="bg-meetease-purple/10 rounded-lg p-3 flex items-center hover:bg-meetease-purple/20 transition-colors"
                  >
                    <MessageSquare className="w-8 h-8 text-meetease-purple mr-3" />
                    <div className="text-left">
                      <h3 className="font-medium">AI Suggestions</h3>
                      <p className="text-sm text-gray-600">View your meeting notes</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('team')}
                    className="bg-meetease-indigo/10 rounded-lg p-3 flex items-center hover:bg-meetease-indigo/20 transition-colors"
                  >
                    <Users className="w-8 h-8 text-meetease-indigo mr-3" />
                    <div className="text-left">
                      <h3 className="font-medium">Team Members</h3>
                      <p className="text-sm text-gray-600">4 team members</p>
                    </div>
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <GradientButton onClick={connectCalendar} size="sm">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Connect Calendar
                  </GradientButton>
                  
                  <GradientButton variant="secondary" onClick={handleNewMeeting} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Meeting
                  </GradientButton>
                  
                  <GradientButton variant="outline" onClick={() => setActiveTab('videos')} size="sm">
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Join Video Call
                  </GradientButton>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="text-lg font-bold mb-3">Upcoming Meetings</h3>
                  {meetings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {meetings.map((meeting) => (
                            <tr key={meeting.id}>
                              <td className="px-4 py-2 whitespace-nowrap">{meeting.title}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{meeting.date}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{meeting.time}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{meeting.attendees}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No meetings scheduled yet.</p>
                  )}
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="text-lg font-bold mb-3">Team Members</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex -space-x-2">
                      <img 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User profile"
                      />
                      <img 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User profile"
                      />
                      <img 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User profile"
                      />
                      <img 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User profile"
                      />
                    </div>
                    <span className="text-sm text-gray-500 self-center">4 team members</span>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('team')} 
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    View All Team Members
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold">Recent AI Meeting Notes</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('ai')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {previousMeetingNotes.map(note => (
                    <div key={note.id} className="border rounded-lg p-3 hover:shadow-sm">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">{note.title}</h4>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{note.summary}</p>
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="text-xs text-blue-600 font-medium mb-1">AI Suggestions:</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {note.aiSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-2 mt-1"></span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Meetings Tab */}
          {activeTab === 'meetings' && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Meetings</h2>
                <GradientButton onClick={handleNewMeeting} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </GradientButton>
              </div>
              
              {meetings.length > 0 ? (
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          <p className="text-gray-600">{meeting.date} at {meeting.time}</p>
                          <p className="text-gray-600">{meeting.attendees} attendees</p>
                          {meeting.notified && (
                            <div className="flex items-center text-green-600 text-sm mt-1">
                              <BellRing className="w-3 h-3 mr-1" />
                              <span>Reminder sent</span>
                            </div>
                          )}
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
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No meetings yet</h3>
                  <p className="text-gray-500 mb-4">Schedule your first meeting to get started</p>
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
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Schedule a Meeting</h2>
                <ScheduleDemo />
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <TeamMembers />
            </div>
          )}
          
          {/* Video Meeting Tab */}
          {activeTab === 'videos' && (
            <div>
              <div className="mb-4">
                <VideoMeeting />
              </div>
            </div>
          )}
          
          {/* AI Notes Tab */}
          {activeTab === 'ai' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">AI Meeting Notes</h2>
                
                <div className="mb-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-lg mb-2">How AI Helps Your Meetings</h3>
                    <ul className="space-y-2">
                      <li className="flex">
                        <div className="mr-3 text-purple-500">1.</div>
                        <div>
                          <span className="font-medium">Automatic Transcription</span>
                          <p className="text-sm text-gray-600">Our AI records and transcribes your entire meeting in real-time</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-3 text-purple-500">2.</div>
                        <div>
                          <span className="font-medium">Smart Summarization</span>
                          <p className="text-sm text-gray-600">Get concise meeting summaries with key points highlighted</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-3 text-purple-500">3.</div>
                        <div>
                          <span className="font-medium">Action Item Detection</span>
                          <p className="text-sm text-gray-600">AI automatically identifies and assigns action items from discussions</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-3 text-purple-500">4.</div>
                        <div>
                          <span className="font-medium">Personalized Suggestions</span>
                          <p className="text-sm text-gray-600">Receive tailored insights and recommendations based on meeting content</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3">Recent Meeting Notes</h3>
                  <div className="space-y-4">
                    {previousMeetingNotes.map(note => (
                      <div key={note.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                          <div>
                            <h4 className="font-medium">{note.title}</h4>
                            <p className="text-sm text-gray-500">{note.date}</p>
                          </div>
                          <Button variant="outline" size="sm">View Full Transcript</Button>
                        </div>
                        <div className="p-3">
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Summary</h5>
                          <p className="text-sm text-gray-600 mb-3">{note.summary}</p>
                          
                          <h5 className="font-medium text-sm text-gray-700 mb-2">AI Suggestions</h5>
                          <ul className="text-sm space-y-2">
                            {note.aiSuggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 text-xs flex items-center justify-center mr-2 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-gray-500 mb-3">Start recording your meeting to generate AI notes</p>
                  <Button 
                    onClick={() => setActiveTab('videos')}
                    className="bg-meetease-purple hover:bg-meetease-purple/90"
                  >
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Join Video Meeting
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div>
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Meeting Reminders</h2>
                <ReminderExample />
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        defaultValue="demo@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
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
                    <div className="flex items-center justify-between">
                      <span>Two-Day Meeting Reminders</span>
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
                    size="sm"
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
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-3">Schedule New Meeting</h3>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title*</label>
                    <input 
                      type="text" 
                      name="title"
                      value={meetingFormData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md" 
                      placeholder="Enter meeting title" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                      <input 
                        type="date" 
                        name="date"
                        value={meetingFormData.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
                      <input 
                        type="time" 
                        name="time"
                        value={meetingFormData.time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Participants (emails)</label>
                    <textarea 
                      name="participants"
                      value={meetingFormData.participants}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md" 
                      rows={3} 
                      placeholder="Enter email addresses separated by commas" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name="description"
                      value={meetingFormData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md" 
                      rows={3} 
                      placeholder="Enter meeting description" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewMeetingForm(false)}
                  >
                    Cancel
                  </Button>
                  <GradientButton onClick={handleCreateMeeting}>
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
