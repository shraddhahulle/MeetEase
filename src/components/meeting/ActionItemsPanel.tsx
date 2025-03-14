
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ListChecks } from 'lucide-react';

interface ActionItem {
  assignee: string;
  task: string;
  deadline: string;
  priority: string;
}

interface ActionItemsPanelProps {
  actionItems: ActionItem[];
}

export const ActionItemsPanel: React.FC<ActionItemsPanelProps> = ({ actionItems }) => {
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
    <div className="px-4 pt-2 pb-4">
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
    </div>
  );
};
