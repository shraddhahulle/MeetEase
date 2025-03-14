
import React from 'react';
import { Mic, MicOff, Video, VideoOff, Share, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MeetingControlsProps {
  isMicOn: boolean;
  isVideoOn: boolean;
  isRecording: boolean;
  isFullScreen: boolean;
  recordingTime: number;
  toggleMic: () => void;
  toggleVideo: () => void;
  shareScreen: () => void;
  handleRecord: () => void;
  toggleFullScreen: () => void;
  endCall: () => void;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  isMicOn,
  isVideoOn,
  isRecording,
  isFullScreen,
  recordingTime,
  toggleMic,
  toggleVideo,
  shareScreen,
  handleRecord,
  toggleFullScreen,
  endCall,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
          onClick={endCall}
        >
          End Call
        </Button>
      </div>
    </div>
  );
};
