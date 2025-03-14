
import React, { useState } from 'react';
import { Calendar, Users, MessageSquare, Play, Pause } from 'lucide-react';
import { Button } from './button';

export const PastMeetingVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <div className="bg-gray-800 aspect-video relative">
          {/* Video thumbnail */}
          <img 
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop" 
            alt="Past team meeting" 
            className={`w-full h-full object-cover ${isPlaying ? 'opacity-100' : 'opacity-80'}`}
          />
          
          {/* Participant thumbnails */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <div className="flex -space-x-2">
              <img 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Team member"
              />
              <img 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Team member"
              />
              <img 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Team member"
              />
              <img 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Team member"
              />
            </div>
          </div>
          
          {/* Play/Pause button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={togglePlayPause}
              variant="ghost" 
              size="icon" 
              className="bg-white/20 text-white hover:bg-white/40 rounded-full w-16 h-16"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>
          
          {/* Meeting info overlay */}
          <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Oct 18, 2023</span>
              <span className="mx-2">•</span>
              <Users className="h-3 w-3 mr-1" />
              <span>4 participants</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Marketing Strategy Meeting</h3>
          <Button variant="outline" size="sm">Full Recording</Button>
        </div>
        
        <div className="border-t pt-3">
          <h4 className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="h-4 w-4 mr-1 text-purple-500" />
            AI Summary Notes
          </h4>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              The team discussed Q4 marketing plans, social media strategy, and upcoming product launch campaign.
            </p>
            
            <h5 className="text-xs font-medium text-purple-700 mb-1">Key Decisions:</h5>
            <ul className="text-xs text-gray-700 mb-2 space-y-1">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-1.5"></span>
                <span>Increase budget allocation for Instagram ads based on previous performance</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-1.5"></span>
                <span>Create short-form video content for TikTok and other social platforms</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 mr-1.5"></span>
                <span>Schedule follow-up meeting with design team about new brand assets</span>
              </li>
            </ul>
            
            <h5 className="text-xs font-medium text-purple-700 mb-1">AI Suggestions:</h5>
            <p className="text-xs text-gray-700 italic">
              Consider A/B testing for the new landing page design to optimize conversion rates before full launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
