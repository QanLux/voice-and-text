import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, MicOff } from "lucide-react";

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
        <div className="text-center text-muted-foreground">
          <h3 className="text-xl font-semibold mb-2">Welcome to DiscordMVP</h3>
          <p>Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-chat">
      {/* Channel Header */}
      <div className="h-12 bg-bg-secondary border-b border-border/50 flex items-center justify-between px-4">
        <div className="flex items-center">
          <span className="text-muted-foreground mr-2">
            {channel.type === 'text' ? '#' : '🔊'}
          </span>
          <h3 className="font-semibold text-foreground">{channel.name}</h3>
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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  {message.author.avatar ? (
                    <img
                      src={message.author.avatar}
                      alt={message.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-discord-primary flex items-center justify-center text-sm font-semibold">
                      {message.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-foreground">
                      {message.author.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-foreground mt-1 break-words">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {channel.type === 'text' && (
        <div className="p-4 border-t border-border/50">
          <div className="flex space-x-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-bg-secondary border-border/50"
            />
            <Button
              variant="discord"
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};