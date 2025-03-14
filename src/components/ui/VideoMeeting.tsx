
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, MoreVertical } from 'lucide-react';
import { Button } from './button';
import GradientButton from './GradientButton';

export const VideoMeeting = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
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
  
  const handleRecord = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "AI assistant is now transcribing and taking notes of your meeting.",
      });
      
      // Simulate AI taking notes after 3 seconds
      setTimeout(() => {
        const notes = `
        ## Meeting Notes - Product Review
        **Date:** October 25, 2023
        **Participants:** Jane, Mark, Sara, Alex
        
        ### Key Points:
        1. New feature release scheduled for November 10
        2. Customer feedback shows 85% satisfaction with recent UI changes
        3. Mobile app needs performance improvements
        
        ### Action Items:
        - Jane: Prepare marketing materials by Nov 1
        - Mark: Fix the loading time issues on mobile
        - Sara: Schedule user testing sessions
        - Alex: Update the roadmap document
        
        ### AI Suggestions:
        - Consider A/B testing for the new checkout flow
        - Weekly team check-ins could improve coordination
        - Current user session length indicates potential engagement issues
        `;
        
        setMeetingNotes(notes);
        
        toast({
          title: "AI Notes Generated",
          description: "Meeting notes have been transcribed and summarized by our AI assistant.",
        });
      }, 3000);
    } else {
      toast({
        title: "Recording Stopped",
        description: "Recording has been saved and processed.",
      });
    }
  };
  
  const shareScreen = () => {
    toast({
      title: "Screen Sharing",
      description: "You are now sharing your screen with all participants.",
    });
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
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
              <span className="animate-pulse mr-1">●</span> 
              Recording
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
      
      {/* Meeting notes section */}
      {meetingNotes && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Assistant Notes
            </h3>
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
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg">
              {meetingNotes}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
