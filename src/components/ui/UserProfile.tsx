
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './button';
import { LogOut, Settings, Bell, User, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };
  
  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="flex items-center space-x-2 rounded-full transition-colors hover:bg-gray-100 p-1"
      >
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" alt="User" />
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg border z-50">
            <div className="p-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" alt="User" />
                  <AvatarFallback>DU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Demo User</p>
                  <p className="text-sm text-gray-500">demo@example.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  setIsOpen(false);
                  toast({
                    title: "Profile",
                    description: "User profile settings opened",
                  });
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Your Profile
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  setIsOpen(false);
                  toast({
                    title: "Notifications",
                    description: "You have 3 unread notifications",
                  });
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  setIsOpen(false);
                  toast({
                    title: "Settings",
                    description: "Account settings opened",
                  });
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  setIsOpen(false);
                  toast({
                    title: "Help",
                    description: "Help center opened",
                  });
                }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Button>
            </div>
            
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
