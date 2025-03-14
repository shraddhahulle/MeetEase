
import React, { useRef, useEffect } from 'react';
import { Search, BookmarkPlus, Flag, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface TranscriptEntry {
  id: number;
  timestamp: string;
  speaker: string;
  text: string;
  seconds: number;
  sentiment: string;
}

interface TranscriptPanelProps {
  liveTranscript: TranscriptEntry[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  searchKeywords: () => void;
  jumpToTimestamp: (seconds: number) => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  liveTranscript,
  searchQuery,
  setSearchQuery,
  keyword,
  setKeyword,
  searchKeywords,
  jumpToTimestamp,
}) => {
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveTranscript]);

  const filterTranscript = () => {
    if (!searchQuery) return liveTranscript;
    
    return liveTranscript.filter(entry => 
      entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  return (
    <div className="px-4 pt-2 pb-4">
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
    </div>
  );
};

// Need to import MessageSquare at the top
import { MessageSquare } from 'lucide-react';
