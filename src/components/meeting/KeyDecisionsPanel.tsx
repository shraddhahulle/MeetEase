
import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface KeyDecision {
  time: number;
  decision: string;
}

interface KeyDecisionsPanelProps {
  keyDecisions: KeyDecision[];
  jumpToTimestamp: (seconds: number) => void;
}

export const KeyDecisionsPanel: React.FC<KeyDecisionsPanelProps> = ({ 
  keyDecisions,
  jumpToTimestamp
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 pt-2 pb-4">
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
    </div>
  );
};
