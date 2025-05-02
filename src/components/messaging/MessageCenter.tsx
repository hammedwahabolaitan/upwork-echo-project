
import React, { useState } from 'react';
import { MessageSquare, Search, Send } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: number;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  unreadCount?: number;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
  read: boolean;
}

// Mock data - in a real app this would come from an API
const mockUsers: User[] = [
  { id: 1, name: "John Doe", status: 'online', unreadCount: 3 },
  { id: 2, name: "Jane Smith", status: 'offline', lastSeen: '2 hours ago', unreadCount: 0 },
  { id: 3, name: "Mike Johnson", status: 'online', unreadCount: 1 },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, senderId: 1, receiverId: 999, text: "Hi there! I saw your profile and I'm interested in your React skills.", timestamp: '2023-05-02T10:30:00', read: true },
    { id: 2, senderId: 999, receiverId: 1, text: "Hello! Thanks for reaching out. What kind of project are you working on?", timestamp: '2023-05-02T10:32:00', read: true },
    { id: 3, senderId: 1, receiverId: 999, text: "I'm building an e-commerce platform and need help with the frontend.", timestamp: '2023-05-02T10:35:00', read: false },
  ]
};

const MessageCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  
  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentUserId = user?.id || 999; // Fallback ID if not logged in
  const messages = selectedUserId ? (mockMessages[selectedUserId] || []) : [];
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return;
    
    // In a real app, this would send to an API
    console.log(`Sending message to user ${selectedUserId}: ${newMessage}`);
    
    // Clear the input
    setNewMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-upwork-green">
          <MessageSquare size={20} />
          {mockUsers.reduce((acc, user) => acc + (user.unreadCount || 0), 0) > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Messages</DrawerTitle>
          <DrawerDescription>
            Connect with clients and freelancers
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-1 border-r overflow-y-auto">
            <div className="p-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {filteredUsers.map(user => (
                <div 
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    selectedUserId === user.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{user.name}</span>
                      {user.unreadCount ? (
                        <span className="bg-upwork-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {user.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-1 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {user.status === 'online' ? 'Online' : `Last seen ${user.lastSeen}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col h-full">
            {selectedUserId ? (
              <>
                <div className="p-3 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {mockUsers.find(u => u.id === selectedUserId)?.name.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-2 font-medium">
                      {mockUsers.find(u => u.id === selectedUserId)?.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map(message => {
                    const isMine = message.senderId === currentUserId;
                    return (
                      <div 
                        key={message.id}
                        className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] rounded-lg p-3 ${
                          isMine ? 'bg-upwork-green text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex">
                    <Textarea
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="ml-2 bg-upwork-green hover:bg-upwork-darkGreen self-end"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MessageCenter;
