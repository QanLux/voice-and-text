import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/ui/message-bubble";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { Send, Mic, MicOff, Hash, Volume2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  timestamp: Date;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
}

interface ChatAreaProps {
  channel?: Channel;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUser: {
    id: string;
    username: string;
    avatar?: string;
  };
  isVoiceConnected?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onJoinVoice?: () => void;
  onLeaveVoice?: () => void;
}

export const ChatArea = ({
  channel,
  messages,
  onSendMessage,
  currentUser,
  isVoiceConnected = false,
  isMuted = false,
  onToggleMute,
  onJoinVoice,
  onLeaveVoice,
}: ChatAreaProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [typingUsers] = useState<string[]>([]); // Mock typing users
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-chat">
        <div className="text-center text-muted-foreground animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center animate-bounce-in">
            <Hash className="h-8 w-8 text-discord-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to DiscordMVP</h3>
          <p className="text-sm">Select a channel to start chatting with your community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-chat">
      {/* Channel Header */}
      <div className="h-14 bg-bg-secondary border-b border-border/50 flex items-center justify-between px-4 backdrop-blur-sm animate-slide-in-left">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-bg-tertiary">
            {channel.type === 'text' ? (
              <Hash className="h-4 w-4 text-discord-primary" />
            ) : (
              <Volume2 className="h-4 w-4 text-discord-success" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{channel.name}</h3>
            <p className="text-xs text-muted-foreground">
              {channel.type === 'text' ? 'Text channel' : 'Voice channel'}
            </p>
          </div>
        </div>
        
        {channel.type === 'voice' && (
          <div className="flex items-center space-x-2">
            {isVoiceConnected ? (
              <>
                <Button
                  variant={isMuted ? "danger" : "success"}
                  size="sm"
                  onClick={onToggleMute}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onLeaveVoice}
                >
                  Leave Voice
                </Button>
              </>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={onJoinVoice}
              >
                Join Voice
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
                {channel.type === 'text' ? (
                  <Hash className="h-6 w-6 text-discord-primary" />
                ) : (
                  <Volume2 className="h-6 w-6 text-discord-success" />
                )}
              </div>
              <h4 className="text-lg font-medium mb-2">
                Welcome to #{channel.name}!
              </h4>
              <p className="text-sm">
                {channel.type === 'text' 
                  ? "This is the start of your conversation. Say hello!" 
                  : "Join the voice channel to start talking with your community."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isConsecutive = prevMessage && 
                  prevMessage.author.id === message.author.id &&
                  message.timestamp.getTime() - prevMessage.timestamp.getTime() < 300000; // 5 minutes
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isConsecutive={isConsecutive}
                  />
                );
              })}
            </div>
          )}
          
          <TypingIndicator users={typingUsers} />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {channel.type === 'text' && (
        <div className="p-4 border-t border-border/50 bg-bg-secondary/50 backdrop-blur-sm">
          <div className="flex space-x-3 items-end">
            <div className="flex-1 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${channel.name}`}
                className="bg-bg-tertiary border-border/50 rounded-lg py-3 px-4 resize-none min-h-[44px] focus:ring-2 focus:ring-discord-primary/50 transition-all duration-200"
              />
            </div>
            <Button
              variant={messageInput.trim() ? "discord" : "ghost"}
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="h-11 w-11 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};