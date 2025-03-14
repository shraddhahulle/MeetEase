
import React from 'react';
import { BrainCircuit, BarChart, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AISuggestion {
  category: string;
  suggestion: string;
}

interface SentimentParticipant {
  name: string;
  sentiment: string;
  engagement: string;
}

interface SentimentAnalysis {
  overall: string;
  breakdown: {
    positive: number;
    neutral: number;
    concerned: number;
    negative: number;
  };
  insights: string;
  participants: SentimentParticipant[];
}

interface AIInsightsPanelProps {
  aiSuggestions: AISuggestion[];
  sentimentAnalysis: SentimentAnalysis | null;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  aiSuggestions,
  sentimentAnalysis
}) => {
  return (
    <div className="px-4 pt-2 pb-4">
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
    </div>
  );
};
