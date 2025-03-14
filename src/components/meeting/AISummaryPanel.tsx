
import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface AISummaryPanelProps {
  meetingNotes: string | null;
  isRecording: boolean;
  liveTranscript: any[];
}

export const AISummaryPanel: React.FC<AISummaryPanelProps> = ({
  meetingNotes,
  isRecording,
  liveTranscript
}) => {
  return (
    <div className="px-4 pt-2 pb-4">
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
    </div>
  );
};
