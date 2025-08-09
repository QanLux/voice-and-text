import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import discordLogo from "@/assets/discord-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

// Mock data - replace with real Supabase integration
const mockUser = {
  id: "1",
  username: "DemoUser",
  email: "demo@example.com",
};

const mockServers = [
  { id: "1", name: "General" },
  { id: "2", name: "Gaming" },
];

const mockChannels = [
  { id: "1", name: "general", type: "text" as const, serverId: "1" },
  { id: "2", name: "random", type: "text" as const, serverId: "1" },
  { id: "3", name: "Voice Chat", type: "voice" as const, serverId: "1" },
  { id: "4", name: "game-chat", type: "text" as const, serverId: "2" },
  { id: "5", name: "Gaming Voice", type: "voice" as const, serverId: "2" },
];

const mockMessages = [
  {
    id: "1",
    content: "Welcome to DiscordMVP! 🎉",
    author: { id: "system", username: "System" },
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "This is a demonstration of real-time messaging.",
    author: mockUser,
    timestamp: new Date(),
  },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentServer, setCurrentServer] = useState(mockServers[0]);
  const [currentChannel, setCurrentChannel] = useState(mockChannels[0]);
  const [messages, setMessages] = useState(mockMessages);
  const { toast } = useToast();

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    setLoading(true);
    try {
      // Mock authentication - replace with real Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: "You've been successfully authenticated.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServerSelect = (server: { id: string; name: string; avatar?: string }) => {
    setCurrentServer(server as typeof mockServers[0]);
  };

  const handleChannelSelect = (channel: { id: string; name: string; type: 'text' | 'voice'; serverId: string }) => {
    setCurrentChannel(channel);
  };

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      author: mockUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <img 
              src={discordLogo} 
              alt="DiscordMVP" 
              className="w-20 h-20 mx-auto mb-4 drop-shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              DiscordMVP
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Connect, chat, and communicate with your community in real-time
            </p>
          </div>
          
          <AuthForm onAuth={handleAuth} loading={loading} />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Demo Mode - Experience real-time messaging and voice chat</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      <Sidebar
        servers={mockServers}
        channels={mockChannels}
        currentServer={currentServer}
        currentChannel={currentChannel}
        onServerSelect={handleServerSelect}
        onChannelSelect={handleChannelSelect}
        onCreateServer={() => toast({ title: "Coming soon!", description: "Server creation will be available in the next update." })}
        onCreateChannel={() => toast({ title: "Coming soon!", description: "Channel creation will be available in the next update." })}
        onLogout={handleLogout}
      />
      
      <ChatArea
        channel={currentChannel}
        messages={messages.filter(m => m.id !== "system" || currentChannel?.type === "text")}
        onSendMessage={handleSendMessage}
        currentUser={mockUser}
        onJoinVoice={() => toast({ title: "Voice Chat", description: "Voice functionality coming soon!" })}
        onLeaveVoice={() => toast({ title: "Voice Chat", description: "Left voice channel." })}
        onToggleMute={() => toast({ title: "Voice Chat", description: "Mute toggled." })}
      />
    </div>
  );
};

export default Index;
