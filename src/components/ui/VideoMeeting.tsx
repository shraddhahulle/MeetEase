
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, 
  MoreVertical, Search, ListChecks, Clock, Calendar, BrainCircuit,
  Download, Send, BarChart, PieChart, ThumbsUp, ThumbsDown, Flag,
  FileText, CheckCircle2, BookmarkPlus, AlertTriangle, Mail
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import GradientButton from './GradientButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

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
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [elapsedInterval, setElapsedInterval] = useState<NodeJS.Timeout | null>(null);
  const [meetingTopic, setMeetingTopic] = useState("Product Review Meeting");
  const [keyword, setKeyword] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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
      // Generate sentiment analysis
      generateSentimentAnalysis();
    }
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'concerned':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getSpeakerColor = (speaker: string) => {
    if (speaker.includes('John')) return 'text-blue-600';
    if (speaker.includes('Sarah')) return 'text-pink-600';
    if (speaker.includes('Mike')) return 'text-purple-600';
    if (speaker.includes('Lisa')) return 'text-green-600';
    return 'text-gray-600';
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
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
              className="bg-white/20 text-white hover:bg-white/40"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? "Exit Full Screen" : "Full Screen"}
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
            <TabsContent value="transcript" className="px-4 pt-2 pb-4">
              {/* Enhanced Search Bar */}
              <div className="p-3 border rounded-lg bg-gray-50 flex mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search transcript..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex ml-2 gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Jump to keyword..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={searchKeywords}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Find
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              {/* Transcript Content */}
              <div className="h-64 overflow-y-auto border rounded-lg p-2">
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
                          <div className="flex items-center">
                            <span className={`font-medium ${getSpeakerColor(entry.speaker)}`}>
                              {entry.speaker}
                            </span>
                            {entry.sentiment && (
                              <span className={`ml-2 text-xs ${getSentimentColor(entry.sentiment)}`}>
                                {entry.sentiment === 'positive' && <ThumbsUp className="h-3 w-3 inline" />}
                                {entry.sentiment === 'negative' && <ThumbsDown className="h-3 w-3 inline" />}
                                {entry.sentiment === 'concerned' && <AlertTriangle className="h-3 w-3 inline" />}
                              </span>
                            )}
                          </div>
                          <p className="ml-0">{entry.text}</p>
                          <div className="mt-1 flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-gray-500 hover:text-indigo-600"
                              onClick={() => {
                                toast({
                                  title: "Highlighted",
                                  description: "This segment has been highlighted in the transcript.",
                                });
                              }}
                            >
                              <BookmarkPlus className="h-3 w-3 mr-1" />
                              Highlight
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-gray-500 hover:text-indigo-600"
                              onClick={() => {
                                toast({
                                  title: "Flagged for Follow-up",
                                  description: "This item has been flagged for follow-up.",
                                });
                              }}
                            >
                              <Flag className="h-3 w-3 mr-1" />
                              Flag
                            </Button>
                          </div>
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
            </TabsContent>
            
            {/* Action Items Tab Content */}
            <TabsContent value="actionItems" className="px-4 pt-2 pb-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-3">
                {actionItems.length > 0 ? (
                  <div className="space-y-3">
                    {actionItems.map((item, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-start">
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 ${
                            item.assignee === 'John' ? 'bg-blue-100 text-blue-600' :
                            item.assignee === 'Sarah' ? 'bg-pink-100 text-pink-600' :
                            item.assignee === 'Mike' ? 'bg-purple-100 text-purple-600' :
                            item.assignee === 'Lisa' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.assignee.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{item.task}</div>
                              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">Assigned to: {item.assignee}</span>
                              <span className="text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> 
                                {item.deadline}
                              </span>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => {
                                  toast({
                                    title: "Action Item Updated",
                                    description: `Status updated to "In Progress"`,
                                  });
                                }}
                              >
                                Mark In Progress
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => {
                                  toast({
                                    title: "Action Item Assigned",
                                    description: `Action item reassigned`,
                                  });
                                }}
                              >
                                Reassign
                              </Button>
                            </div>
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
            </TabsContent>
            
            {/* Key Decisions Tab Content */}
            <TabsContent value="decisions" className="px-4 pt-2 pb-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-3">
                {keyDecisions.length > 0 ? (
                  <div className="space-y-3">
                    {keyDecisions.map((item, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                            <div className="font-medium">{item.decision}</div>
                          </div>
                          <button 
                            className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                            onClick={() => jumpToTimestamp(item.time)}
                          >
                            <Clock className="h-3 w-3 mr-1" />
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
            </TabsContent>
            
            {/* AI Summary Tab Content */}
            <TabsContent value="summary" className="px-4 pt-2 pb-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-3">
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
            </TabsContent>
            
            {/* AI Insights Tab Content */}
            <TabsContent value="insights" className="px-4 pt-2 pb-4">
              <div className="h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* AI Suggestions Section */}
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium text-sm text-indigo-800 mb-2 flex items-center">
                      <BrainCircuit className="h-4 w-4 mr-1 text-indigo-600" />
                      AI Suggestions
                    </h3>
                    {aiSuggestions.length > 0 ? (
                      <div className="space-y-2">
                        {aiSuggestions.map((item, index) => (
                          <div key={index} className="bg-indigo-50 rounded-md p-2">
                            <div className="text-xs font-medium text-indigo-700 mb-1">{item.category}:</div>
                            <p className="text-sm text-gray-700">{item.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">AI suggestions will appear as the meeting progresses.</p>
                    )}
                  </div>
                  
                  {/* Sentiment Analysis Section */}
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium text-sm text-indigo-800 mb-2 flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-indigo-600" />
                      Sentiment Analysis
                    </h3>
                    
                    {sentimentAnalysis ? (
                      <div>
                        <div className="mb-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">Meeting Mood:</div>
                          <div className="flex space-x-1">
                            <Badge className="bg-green-100 text-green-800">
                              {sentimentAnalysis.overall === 'positive' && (
                                <span className="flex items-center">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Positive
                                </span>
                              )}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">Sentiment Breakdown:</div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-l-full" style={{width: `${sentimentAnalysis.breakdown.positive}%`}}></div>
                          </div>
                          <div className="flex text-xs justify-between mt-1">
                            <span className="text-green-600">{sentimentAnalysis.breakdown.positive}% Positive</span>
                            <span className="text-gray-600">{sentimentAnalysis.breakdown.neutral}% Neutral</span>
                            <span className="text-amber-600">{sentimentAnalysis.breakdown.concerned}% Concerned</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Participant Insights:</div>
                          <div className="text-xs text-gray-600">
                            {sentimentAnalysis.participants.map((p, i) => (
                              <div key={i} className="flex justify-between mb-0.5">
                                <span className="font-medium">{p.name}:</span>
                                <span>{p.sentiment}, {p.engagement} engagement</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-20 text-gray-500">
                        <p className="text-sm">Sentiment analysis will be available when recording ends.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                    onClick={() => {
                      setShowExportOptions(true);
                    }}
                  >
                    Export Options
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
