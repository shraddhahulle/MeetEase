
import React from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from './button';
import GradientButton from './GradientButton';
import { toast } from '@/hooks/use-toast';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'pending';
}

export const TeamMembers = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Jane Cooper',
      email: 'jane@example.com',
      role: 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'active'
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'active'
    },
    {
      id: 4,
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'pending'
    }
  ];
  
  const handleInvite = (email: string) => {
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${email}`,
    });
  };
  
  const handleRemoveMember = (id: number, name: string) => {
    toast({
      title: "Team Member Removed",
      description: `${name} has been removed from your team`,
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Team Members</h3>
        <GradientButton
          onClick={() => {
            toast({
              title: "Invite Sent",
              description: "Team invitation email has been sent",
            });
          }}
          size="sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          Invite New Member
        </GradientButton>
      </div>
      
      <div className="divide-y">
        {teamMembers.map((member) => (
          <div key={member.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <div className="text-sm text-gray-500 flex items-center">
                  {member.email}
                  {member.status === 'active' && (
                    <span className="ml-2 flex items-center text-green-500 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  )}
                  {member.status === 'pending' && (
                    <span className="ml-2 text-yellow-500 text-xs">
                      Pending
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{member.role}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {member.status === 'pending' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInvite(member.email)}
                >
                  Resend
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Message Sent",
                      description: `You've sent a message to ${member.name}`,
                    });
                  }}
                >
                  Message
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRemoveMember(member.id, member.name)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
