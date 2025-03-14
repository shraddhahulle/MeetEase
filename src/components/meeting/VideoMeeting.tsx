import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, 
  Download, Send, Calendar, BookmarkPlus, AlertTriangle, Mail,
  ListChecks, CheckCircle2, FileText, BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GradientButton from '@/components/ui/GradientButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MeetingControls } from './MeetingControls';
import { TranscriptPanel } from './TranscriptPanel';
import { ActionItemsPanel } from './ActionItemsPanel';
import { KeyDecisionsPanel } from './KeyDecisionsPanel';
import { AISummaryPanel } from './AISummaryPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { MeetingEndedScreen } from './MeetingEndedScreen';
import { MeetingCalendar } from './MeetingCalendar';

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
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [elapsedInterval, setElapsedInterval] = useState<NodeJS.Timeout | null>(null);
  const [meetingTopic, setMeetingTopic] = useState("Product Review Meeting");
  const [keyword, setKeyword] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true); // Default to showing calendar when meeting ends
  
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
      // Generate sentiment analysis
      generateSentimentAnalysis();
    }
  };

  const endCall = () => {
    // If recording is still active, stop it first
    if (isRecording) {
      if (elapsedInterval) {
        clearInterval(elapsedInterval);
        setElapsedInterval(null);
      }
      
      // Generate final meeting notes if not already generated
      if (!meetingNotes) {
        generateMeetingNotes();
        generateSentimentAnalysis();
      }
    }
    
    toast({
      title: "Meeting Ended",
      description: "Your meeting has ended. Meeting notes are now available for download.",
    });
    
    // Automatically trigger PDF download when ending the call
    setTimeout(() => {
      downloadPDF();
    }, 1000);
    
    setMeetingEnded(true);
  };

  const downloadPDF = () => {
    toast({
      title: "PDF Downloaded",
      description: "Meeting notes have been downloaded as PDF.",
    });
  };

  const startNewMeeting = () => {
    setMeetingEnded(false);
    setMeetingNotes(null);
    setIsRecording(false);
    setRecordingTime(0);
    setLiveTranscript([]);
    setActionItems([]);
    setKeyDecisions([]);
    setAiSuggestions([]);
    setSentimentAnalysis(null);
    setMeetingTopic("New Meeting");
    setActiveTab('transcript');
    
    toast({
      title: "New Meeting",
      description: "You can start a new meeting now.",
    });
  };
  
  const simulateLiveTranscription = () => {
    // This simulates AI transcribing the meeting in real-time
    const transcriptData = [
      { time: 2, speaker: 'John (Marketing Lead)', text: "Let's review the progress on the marketing strategy for Q2. I think we should increase our ad budget for social media platforms.", sentiment: "positive" },
      { time: 8, speaker: 'Sarah (Content Manager)', text: "I've prepared the A/B testing plan for email campaigns. I'll have the setup ready by Monday.", sentiment: "positive" },
      { time: 15, speaker: 'Mike (Data Analyst)', text: "The customer segmentation isn't as effective as we hoped. We should refine our approach based on the latest data.", sentiment: "concerned" },
      { time: 24, speaker: 'Lisa (Design Lead)', text: "I've assigned specific tasks to the design team for creating new ad creatives. They'll be ready by Friday.", sentiment: "neutral" },
      { time: 32, speaker: 'John (Marketing Lead)', text: "Great progress everyone. Sarah, how confident are you about the A/B testing results?", sentiment: "positive" },
      { time: 40, speaker: 'Sarah (Content Manager)', text: "I'm pretty confident. Our previous tests showed a 15% increase in open rates with personalized subject lines.", sentiment: "positive" },
      { time: 48, speaker: 'Mike (Data Analyst)', text: "I can provide the customer data segmentation report by Wednesday, which should help with targeting.", sentiment: "neutral" },
      { time: 57, speaker: 'John (Marketing Lead)', text: "Perfect. Let's aim to have all this implemented by next Friday, then review results the following Monday.", sentiment: "positive" },
      { time: 65, speaker: 'Lisa (Design Lead)', text: "I'd like to suggest we try TikTok ads alongside Instagram. Our audience demographics match well.", sentiment: "positive" },
      { time: 75, speaker: 'John (Marketing Lead)', text: "That's an interesting idea, Lisa. How much additional budget would we need?", sentiment: "positive" },
      { time: 83, speaker: 'Mike (Data Analyst)', text: "Based on competitor analysis, we'd need about $5,000 for an initial TikTok campaign to test effectiveness.", sentiment: "neutral" },
      { time: 92, speaker: 'Sarah (Content Manager)', text: "I can work with Lisa to create TikTok-specific content if we decide to move forward with this.", sentiment: "positive" },
      { time: 100, speaker: 'John (Marketing Lead)', text: "Let's allocate $5,000 for the TikTok test. Mike, can you ensure we have proper tracking set up?", sentiment: "positive" },
      { time: 108, speaker: 'Mike (Data Analyst)', text: "Yes, I'll set up the analytics by the end of this week.", sentiment: "positive" },
      { time: 116, speaker: 'Lisa (Design Lead)', text: "I'm also concerned about our current brand consistency across platforms. We should update our style guide.", sentiment: "concerned" },
      { time: 125, speaker: 'John (Marketing Lead)', text: "Good point. Lisa, please lead a style guide refresh. When can you have that completed?", sentiment: "neutral" },
      { time: 134, speaker: 'Lisa (Design Lead)', text: "I can have a draft ready for review by next Wednesday.", sentiment: "positive" },
      { time: 145, speaker: 'John (Marketing Lead)', text: "Great. Let's also schedule a follow-up meeting in two weeks to review all our progress.", sentiment: "positive" },
      { time: 153, speaker: 'John (Marketing Lead)', text: "To summarize: Sarah will set up email A/B testing by Monday. Mike will provide customer segmentation by Wednesday and set up TikTok analytics. Lisa will deliver ad creatives by Friday and a style guide draft by next Wednesday. We'll allocate $5,000 for TikTok testing. Follow-up meeting in two weeks.", sentiment: "positive" },
      { time: 173, speaker: 'All', text: "Sounds good!", sentiment: "positive" }
    ];
    
    const actionItemsData = [
      { assignee: 'Sarah', task: 'Set up A/B testing for email campaigns', deadline: 'Monday', priority: 'High' },
      { assignee: 'Mike', task: 'Generate customer segmentation report', deadline: 'Wednesday', priority: 'Medium' },
      { assignee: 'Mike', task: 'Set up analytics tracking for TikTok campaign', deadline: 'Friday', priority: 'Medium' },
      { assignee: 'Lisa', task: 'Finalize new ad creatives', deadline: 'Friday', priority: 'High' },
      { assignee: 'Lisa', task: 'Draft updated style guide', deadline: 'Next Wednesday', priority: 'Medium' },
      { assignee: 'John', task: 'Allocate $5,000 budget for TikTok campaign', deadline: 'This week', priority: 'Medium' },
      { assignee: 'All', task: 'Attend follow-up meeting', deadline: 'In two weeks', priority: 'Medium' }
    ];
    
    const keyDecisionsData = [
      { time: 57, decision: 'Implement all marketing changes by next Friday' },
      { time: 100, decision: 'Allocate $5,000 for TikTok test campaign' },
      { time: 134, decision: 'Update company style guide for brand consistency' },
      { time: 145, decision: 'Schedule follow-up meeting in two weeks' }
    ];
    
    const aiSuggestionsData = [
      { category: 'Strategy', suggestion: 'Consider running Instagram and TikTok campaigns simultaneously to compare performance metrics directly.' },
      { category: 'Analytics', suggestion: 'Implement UTM parameters for all campaign links to better track conversion paths.' },
      { category: 'Content', suggestion: 'Based on the discussion, short-form video content should be prioritized across all platforms.' },
      { category: 'Process', suggestion: 'Create a shared dashboard for real-time campaign performance visibility for all team members.' },
      { category: 'Follow-up', suggestion: 'Schedule individual check-ins before the two-week follow-up to address any blockers.' },
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
          seconds: entry.time,
          sentiment: entry.sentiment
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
      setAiSuggestions(aiSuggestionsData);
    }, 30000); // After 30 seconds
  };
  
  const generateSentimentAnalysis = () => {
    // Generate sentiment analysis based on the transcript
    const sentimentData = {
      overall: "positive",
      breakdown: {
        positive: 65,
        neutral: 25,
        concerned: 10,
        negative: 0
      },
      insights: "The team showed mostly positive sentiment throughout the meeting, with occasional concerns around customer segmentation and brand consistency. The meeting ended on a positive note with clear action items.",
      participants: [
        { name: "John", sentiment: "highly positive", engagement: "high" },
        { name: "Sarah", sentiment: "positive", engagement: "medium" },
        { name: "Mike", sentiment: "neutral", engagement: "medium" },
        { name: "Lisa", sentiment: "mostly positive", engagement: "high" }
      ]
    };
    
    setSentimentAnalysis(sentimentData);
  };
  
  const generateMeetingNotes = () => {
    const notes = `
    ## Meeting Notes - Q2 Marketing Strategy
    **Date:** ${new Date().toLocaleDateString()}
    **Duration:** ${formatTime(recordingTime)}
    **Participants:** John (Marketing Lead), Sarah (Content Manager), Mike (Data Analyst), Lisa (Design Lead)
    
    ### Summary
    The team reviewed the marketing strategy for Q2, focusing on email campaigns, customer segmentation, and social media advertising. Key decisions included allocating $5,000 for a TikTok ad campaign test alongside existing Instagram efforts, implementing email A/B testing, improving customer segmentation, and updating the company style guide for better brand consistency.
    
    ### Key Discussion Points
    1. Email campaign A/B testing (Sarah to implement by Monday)
    2. Customer segmentation refinement (Mike to deliver report by Wednesday)
    3. Social media ad budget increase, with specific focus on TikTok
    4. Brand consistency and style guide updates (Lisa to draft by next Wednesday)
    5. Analytics tracking for campaign performance (Mike to set up by Friday)
    
    ### Action Items
    - **Sarah:** Set up A/B testing for email campaigns (Due: Monday)
    - **Mike:** Generate customer segmentation report (Due: Wednesday)
    - **Mike:** Set up analytics tracking for TikTok campaign (Due: Friday)
    - **Lisa:** Finalize new ad creatives (Due: Friday)
    - **Lisa:** Draft updated style guide (Due: Next Wednesday)
    - **John:** Allocate $5,000 budget for TikTok campaign (Due: This week)
    - **All:** Attend follow-up meeting (Due: In two weeks)
    
    ### Key Decisions
    1. Implement all marketing changes by next Friday
    2. Allocate $5,000 for TikTok test campaign
    3. Update company style guide for brand consistency
    4. Schedule follow-up meeting in two weeks
    
    ### AI Suggestions
    - Consider running Instagram and TikTok campaigns simultaneously to compare performance metrics directly
    - Implement UTM parameters for all campaign links to better track conversion paths
    - Prioritize short-form video content across all platforms based on the discussion
    - Create a shared dashboard for real-time campaign performance visibility
    - Schedule individual check-ins before the two-week follow-up to address any blockers
    `;
    
    setMeetingNotes(notes);
  };
  
  const shareScreen = () => {
    toast({
      title: "Screen Sharing",
      description: "You are now sharing your screen with all participants.",
    });
  };
  
  const jumpToTimestamp = (seconds: number) => {
    toast({
      title: "Timestamp Navigation",
      description: `Jumped to ${formatTime(seconds)} in the recording.`,
    });
    // In a real implementation, this would control the video playback position
  };

  const handleExport = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: `Meeting notes exported as ${format.toUpperCase()} format.`,
    });
    setShowExportOptions(false);
  };

  const handleShare = (platform: string) => {
    toast({
      title: `Share to ${platform}`,
      description: `Meeting notes shared to ${platform}.`,
    });
  };

  const syncWithApp = (app: string) => {
    toast({
      title: `Sync with ${app}`,
      description: `Action items synced with ${app}.`,
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    
    if (!isFullScreen) {
      toast({
        title: "Fullscreen Mode",
        description: "Entered fullscreen mode for better viewing.",
      });
    }
  };

  const searchKeywords = () => {
    if (!keyword) return;
    
    setSearchQuery(keyword);
    setKeyword("");
    
    toast({
      title: "Keyword Search",
      description: `Searching for "${keyword}" in transcript.`,
    });
  };

  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar);
  };
  
  if (meetingEnded) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <MeetingEndedScreen 
          meetingNotes={meetingNotes}
          meetingTopic={meetingTopic}
          recordingTime={recordingTime}
          startNewMeeting={startNewMeeting}
        />
        
        {/* Calendar is now always shown by default */}
        <div className="p-4 border-t">
          <MeetingCalendar />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
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
                <span className="text-white text-xl font-medium">JM</span>
              </div>
            </div>
          )}
          
          {/* Participant videos */}
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 1" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                John
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 2" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Sarah
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 3" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Mike
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" 
                alt="Participant 4" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Lisa
              </div>
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
              {meetingTopic}
            </span>
          </div>
        </div>
        
        {/* Meeting controls */}
        <MeetingControls 
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          isRecording={isRecording}
          isFullScreen={isFullScreen}
          recordingTime={recordingTime}
          toggleMic={toggleMic}
          toggleVideo={toggleVideo}
          shareScreen={shareScreen}
          handleRecord={handleRecord}
          toggleFullScreen={toggleFullScreen}
          endCall={endCall}
        />
      </div>
      
      {/* AI Transcription and Notes Panel */}
      {(isRecording || meetingNotes) && (
        <div className="border-t">
          {/* Enhanced Tabs for different AI features */}
          <Tabs defaultValue="transcript" onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <TabsList>
                <TabsTrigger value="transcript" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Live Transcript</span>
                </TabsTrigger>
                <TabsTrigger value="actionItems" className="flex items-center gap-1">
                  <ListChecks className="h-4 w-4" />
                  <span>Action Items</span>
                  {actionItems.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-indigo-100 text-indigo-800">
                      {actionItems.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="decisions" className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Key Decisions</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>AI Summary</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-1">
                  <BrainCircuit className="h-4 w-4" />
                  <span>AI Insights</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                {/* Export Options Dropdown */}
                <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-indigo-600">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleExport('pdf')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF Document
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleExport('docx')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Word Document
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleExport('txt')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Text File
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Share Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-indigo-600">
                      <Send className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare('Email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('Slack')}>
                      <img src="https://cdn.iconscout.com/icon/free/png-256/slack-226519.png" className="h-4 w-4 mr-2" alt="Slack" />
                      <span>Slack</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => syncWithApp('Trello')}>
                      <img src="https://cdn.iconscout.com/icon/free/png-256/trello-226534.png" className="h-4 w-4 mr-2" alt="Trello" />
                      <span>Sync with Trello</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => syncWithApp('Asana')}>
                      <img src="https://cdn.iconscout.com/icon/free/png-256/asana-226537.png" className="h-4 w-4 mr-2" alt="Asana" />
                      <span>Sync with Asana</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Transcript Tab Content */}
            <TabsContent value="transcript">
              <TranscriptPanel 
                liveTranscript={liveTranscript}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                keyword={keyword}
                setKeyword={setKeyword}
                searchKeywords={searchKeywords}
                jumpToTimestamp={jumpToTimestamp}
              />
            </TabsContent>
            
            {/* Action Items Tab Content */}
            <TabsContent value="actionItems">
              <ActionItemsPanel actionItems={actionItems} />
            </TabsContent>
            
            {/* Key Decisions Tab Content */}
            <TabsContent value="decisions">
              <KeyDecisionsPanel 
                keyDecisions={keyDecisions}
                jumpToTimestamp={jumpToTimestamp}
              />
            </TabsContent>
            
            {/* AI Summary Tab Content */}
            <TabsContent value="summary">
              <AISummaryPanel 
                meetingNotes={meetingNotes}
                isRecording={isRecording}
                liveTranscript={liveTranscript}
              />
            </TabsContent>
            
            {/* AI Insights Tab Content */}
            <TabsContent value="insights">
              <AIInsightsPanel 
                aiSuggestions={aiSuggestions}
                sentimentAnalysis={sentimentAnalysis}
              />
            </TabsContent>
          </Tabs>
          
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
                    onClick={downloadPDF}
                  >
                    Download PDF
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

// Remove the duplicate imports here - this is what's causing the errors
