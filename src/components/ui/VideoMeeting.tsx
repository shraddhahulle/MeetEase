
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, MoreVertical, Search, ListChecks, Clock, Calendar, BrainCircuit } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import GradientButton from './GradientButton';

export const VideoMeeting = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('transcript');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTranscript, setLiveTranscript] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [keyDecisions, setKeyDecisions] = useState<any[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [elapsedInterval, setElapsedInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Scroll to the bottom of transcript when new entries are added
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveTranscript]);
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (elapsedInterval) {
        clearInterval(elapsedInterval);
      }
    };
  }, [elapsedInterval]);
  
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast({
      title: isMicOn ? "Microphone Off" : "Microphone On",
      description: isMicOn ? "Your microphone has been muted" : "Your microphone is now active",
    });
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video Off" : "Video On",
      description: isVideoOn ? "Your camera has been turned off" : "Your camera is now active",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "AI assistant is now transcribing and taking notes of your meeting.",
      });
      
      // Start recording timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setElapsedInterval(interval);
      
      // Simulate live transcription
      simulateLiveTranscription();
      
    } else {
      // Stop timer
      if (elapsedInterval) {
        clearInterval(elapsedInterval);
        setElapsedInterval(null);
      }
      
      toast({
        title: "Recording Stopped",
        description: "Recording has been saved and processed.",
      });
      
      // Generate final meeting notes
      generateMeetingNotes();
    }
  };
  
  const simulateLiveTranscription = () => {
    // This simulates AI transcribing the meeting in real-time
    const transcriptData = [
      { time: 2, speaker: 'Jane', text: "Let's review the progress on the new feature implementation." },
      { time: 8, speaker: 'Mark', text: "I've completed the backend API endpoints for user authentication and profile management." },
      { time: 15, speaker: 'Sara', text: "The UI components are about 80% done. I still need to work on the responsive design for mobile devices." },
      { time: 24, speaker: 'Alex', text: "I've been testing the implemented features. Found a few edge cases we need to address." },
      { time: 32, speaker: 'Jane', text: "Great progress everyone. Mark, when do you think the backend will be fully ready for integration testing?" },
      { time: 40, speaker: 'Mark', text: "I should have it ready by Friday. I need to add the documentation and finalize the error handling." },
      { time: 48, speaker: 'Sara', text: "I can finish the responsive design by Thursday. Then I'll help Alex with testing." },
      { time: 57, speaker: 'Jane', text: "Perfect. Let's aim to have the integration testing completed by next Monday." },
      { time: 65, speaker: 'Alex', text: "I've documented the edge cases in our project management tool. The major ones are related to user permissions and concurrent edits." },
      { time: 75, speaker: 'Jane', text: "Good catch, Alex. Mark, can you prioritize fixing those permission issues?" },
      { time: 83, speaker: 'Mark', text: "Yes, I'll tackle those first thing tomorrow. Should be straightforward to fix." },
      { time: 92, speaker: 'Sara', text: "I'm thinking we should also improve the UX for error messages when these edge cases occur." },
      { time: 100, speaker: 'Jane', text: "That's a good idea. Sara, can you create some mockups for those error states?" },
      { time: 108, speaker: 'Sara', text: "Sure, I'll have them ready by Wednesday for everyone to review." },
      { time: 116, speaker: 'Alex', text: "I'm also concerned about the performance on slower connections. We should add some loading states." },
      { time: 125, speaker: 'Jane', text: "Agreed. Let's all review the application's performance next week. Any other concerns?" },
      { time: 134, speaker: 'Mark', text: "We should decide on the rollout strategy. Do we want to do a phased rollout or launch all features at once?" },
      { time: 145, speaker: 'Jane', text: "Let's discuss that in our strategy meeting on Friday. I'll add it to the agenda." },
      { time: 153, speaker: 'Jane', text: "To summarize: Mark will fix permission issues and finish backend by Friday. Sara will complete responsive design by Thursday and create error mockups by Wednesday. Alex continues testing. Integration testing starts next Monday. We'll discuss rollout on Friday." },
      { time: 173, speaker: 'All', text: "Sounds good!" }
    ];
    
    const actionItemsData = [
      { assignee: 'Mark', task: 'Fix permission issues', deadline: 'Tomorrow' },
      { assignee: 'Mark', task: 'Complete backend including documentation and error handling', deadline: 'Friday' },
      { assignee: 'Sara', task: 'Complete responsive design for mobile devices', deadline: 'Thursday' },
      { assignee: 'Sara', task: 'Create mockups for error states', deadline: 'Wednesday' },
      { assignee: 'Alex', task: 'Continue testing and documenting edge cases', deadline: 'Ongoing' },
      { assignee: 'All', task: 'Start integration testing', deadline: 'Next Monday' },
      { assignee: 'All', task: 'Review application performance on slow connections', deadline: 'Next week' }
    ];
    
    const keyDecisionsData = [
      { time: 57, decision: 'Integration testing to be completed by next Monday' },
      { time: 145, decision: 'Rollout strategy to be discussed in Friday meeting' },
      { time: 125, decision: 'Team to review application performance next week' },
      { time: 108, decision: 'Error state mockups to be created by Wednesday' }
    ];
    
    // Simulate real-time transcription by adding entries with delays
    let transcriptIndex = 0;
    
    const addTranscript = () => {
      if (transcriptIndex < transcriptData.length) {
        const entry = transcriptData[transcriptIndex];
        
        setLiveTranscript(prev => [...prev, {
          id: transcriptIndex + 1,
          timestamp: formatTime(entry.time),
          speaker: entry.speaker,
          text: entry.text,
          seconds: entry.time
        }]);
        
        transcriptIndex++;
        setTimeout(addTranscript, Math.random() * 2000 + 1000); // Random delay between 1-3s
      }
    };
    
    setTimeout(addTranscript, 1000);
    
    // Update action items and key decisions
    setTimeout(() => {
      setActionItems(actionItemsData);
      setKeyDecisions(keyDecisionsData);
    }, 30000); // After 30 seconds
  };
  
  const generateMeetingNotes = () => {
    const notes = `
    ## Meeting Notes - Feature Development Review
    **Date:** ${new Date().toLocaleDateString()}
    **Duration:** ${formatTime(recordingTime)}
    **Participants:** Jane, Mark, Sara, Alex
    
    ### Summary
    The team reviewed progress on the new feature implementation. Mark reported completing backend API endpoints for authentication and profile management. Sara has completed 80% of UI components but needs to finish responsive design for mobile. Alex found several edge cases during testing, particularly around user permissions and concurrent edits.
    
    The team agreed on deadlines: Mark will fix permission issues and complete backend work by Friday, Sara will finish responsive design by Thursday and provide error state mockups by Wednesday, and integration testing will begin next Monday. The team also decided to review application performance on slow connections next week and discuss rollout strategy in Friday's meeting.
    
    ### Key Discussion Points
    1. Backend API implementation status (completed: authentication and profile management)
    2. UI components development (80% complete, mobile responsiveness pending)
    3. Testing progress and edge cases (permissions and concurrent editing issues)
    4. Integration timeline (testing to begin next Monday)
    5. UX for error messages (mockups needed by Wednesday)
    6. Performance considerations for slow connections
    7. Rollout strategy options (phased vs. full launch)
    
    ### Action Items
    - **Mark**: Fix permission issues (Tomorrow), Complete backend with documentation (Friday)
    - **Sara**: Finish responsive design (Thursday), Create error state mockups (Wednesday)
    - **Alex**: Continue testing and documenting edge cases (Ongoing)
    - **All**: Begin integration testing (Next Monday), Review performance (Next week)
    
    ### AI Suggestions
    - Consider implementing feature flags to manage the phased rollout
    - Add automated tests for the identified edge cases to prevent regression
    - Create a user feedback channel when launching to quickly identify issues
    - Document the error handling approach for future development reference
    - Schedule a dedicated performance optimization sprint based on initial findings
    `;
    
    setMeetingNotes(notes);
  };
  
  const shareScreen = () => {
    toast({
      title: "Screen Sharing",
      description: "You are now sharing your screen with all participants.",
    });
  };
  
  const filterTranscript = () => {
    if (!searchQuery) return liveTranscript;
    
    return liveTranscript.filter(entry => 
      entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const jumpToTimestamp = (seconds: number) => {
    toast({
      title: "Timestamp Navigation",
      description: `Jumped to ${formatTime(seconds)} in the recording.`,
    });
    // In a real implementation, this would control the video playback position
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {/* Example meeting video display */}
        <div className="bg-gray-800 aspect-video relative">
          <img 
            src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1000&auto=format&fit=crop" 
            alt="Team meeting" 
            className={`w-full h-full object-cover ${isVideoOn ? 'opacity-80' : 'hidden'}`}
          />
          
          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-white text-xl font-medium">DU</span>
              </div>
            </div>
          )}
          
          {/* Participant videos */}
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 1" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 2" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 3" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Recording indicator and timer */}
          {isRecording && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md flex items-center">
              <span className="animate-pulse mr-2">●</span> 
              Recording {formatTime(recordingTime)}
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xl font-medium">
              Product Review Meeting
            </span>
          </div>
        </div>
        
        {/* Meeting controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex justify-center space-x-2">
            <Button 
              variant="ghost" 
              className="bg-white/20 text-white hover:bg-white/40"
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              className="bg-white/20 text-white hover:bg-white/40"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              className="bg-white/20 text-white hover:bg-white/40"
              onClick={shareScreen}
            >
              <Share className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="bg-white/20 text-white hover:bg-white/40"
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button 
              variant={isRecording ? "destructive" : "ghost"}
              className={isRecording ? "" : "bg-white/20 text-white hover:bg-white/40"}
              onClick={handleRecord}
            >
              {isRecording ? "Stop Recording" : "Record Meeting"}
            </Button>
            <Button 
              variant="ghost" 
              className="bg-red-500/80 text-white hover:bg-red-600/80"
            >
              End Call
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI Transcription and Notes Panel */}
      {(isRecording || meetingNotes) && (
        <div className="border-t">
          {/* Tabs for different AI features */}
          <div className="flex border-b">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'transcript' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('transcript')}
            >
              Live Transcript
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'actionItems' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('actionItems')}
            >
              Action Items
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'decisions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('decisions')}
            >
              Key Decisions
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('summary')}
            >
              AI Summary
            </button>
          </div>
          
          {/* Search bar */}
          {activeTab === 'transcript' && (
            <div className="p-3 border-b bg-gray-50 flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search transcript..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </Button>
            </div>
          )}
          
          {/* Content based on active tab */}
          <div className="p-4">
            {/* Live Transcript */}
            {activeTab === 'transcript' && (
              <div className="h-64 overflow-y-auto">
                {filterTranscript().length > 0 ? (
                  <div className="space-y-3">
                    {filterTranscript().map((entry) => (
                      <div key={entry.id} className="flex">
                        <button 
                          className="text-xs font-mono text-gray-500 pt-1 pr-3 min-w-16 text-right hover:text-indigo-600 transition-colors"
                          onClick={() => jumpToTimestamp(entry.seconds)}
                        >
                          {entry.timestamp}
                        </button>
                        <div className="flex-1">
                          <span className={`font-medium ${
                            entry.speaker === 'Jane' ? 'text-pink-600' :
                            entry.speaker === 'Mark' ? 'text-blue-600' :
                            entry.speaker === 'Sara' ? 'text-purple-600' :
                            entry.speaker === 'Alex' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            {entry.speaker}:
                          </span>
                          <span className="ml-2">{entry.text}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    {searchQuery ? (
                      <p>No results found for "{searchQuery}"</p>
                    ) : (
                      <>
                        <MessageSquare className="h-8 w-8 mb-2 text-gray-400" />
                        <p>Transcript will appear here during recording</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Action Items */}
            {activeTab === 'actionItems' && (
              <div className="h-64 overflow-y-auto">
                {actionItems.length > 0 ? (
                  <div className="space-y-3">
                    {actionItems.map((item, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 flex items-start">
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 ${
                          item.assignee === 'Mark' ? 'bg-blue-100 text-blue-600' :
                          item.assignee === 'Sara' ? 'bg-purple-100 text-purple-600' :
                          item.assignee === 'Alex' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.assignee.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.task}</div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Assigned to: {item.assignee}</span>
                            <span className="text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {item.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ListChecks className="h-8 w-8 mb-2 text-gray-400" />
                    <p>Action items will be extracted during the meeting</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Key Decisions */}
            {activeTab === 'decisions' && (
              <div className="h-64 overflow-y-auto">
                {keyDecisions.length > 0 ? (
                  <div className="space-y-3">
                    {keyDecisions.map((item, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.decision}</div>
                          <button 
                            className="text-xs text-gray-500 hover:text-indigo-600"
                            onClick={() => jumpToTimestamp(item.time)}
                          >
                            {formatTime(item.time)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Clock className="h-8 w-8 mb-2 text-gray-400" />
                    <p>Key decisions will be highlighted during the meeting</p>
                  </div>
                )}
              </div>
            )}
            
            {/* AI Summary */}
            {activeTab === 'summary' && (
              <div className="h-64 overflow-y-auto">
                {meetingNotes ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm p-0 m-0 font-sans">
                      {meetingNotes}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <BrainCircuit className="h-8 w-8 mb-2 text-gray-400" />
                    <p>AI will generate a meeting summary when recording ends</p>
                    {isRecording && liveTranscript.length > 10 && (
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500 mb-2">AI is analyzing the conversation...</p>
                        <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 animate-pulse rounded-full" style={{width: `${Math.min(liveTranscript.length * 5, 100)}%`}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer with controls and info */}
          <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {meetingNotes ? 
                "Meeting notes saved and processed" : 
                isRecording ? 
                  "AI is analyzing the conversation in real-time" : 
                  "Start recording to enable AI transcription"
              }
            </div>
            <div className="flex gap-2">
              {meetingNotes && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Notes Copied",
                        description: "Meeting notes copied to clipboard",
                      });
                    }}
                  >
                    Copy Notes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Notes Exported",
                        description: "Meeting notes exported as PDF",
                      });
                    }}
                  >
                    Export PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
