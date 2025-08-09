import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  timestamp: Date;
  isOwn?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  isConsecutive?: boolean;
  className?: string;
}

export const MessageBubble = ({ 
  message, 
  showAvatar = true, 
  isConsecutive = false,
  className 
}: MessageBubbleProps) => {
  return (
    <div className={cn(
      "group flex space-x-3 p-2 rounded-lg hover:bg-message-hover transition-all duration-200 animate-slide-in-left",
      isConsecutive && "mt-1",
      className
    )}>
      <div className="flex-shrink-0">
        {showAvatar && !isConsecutive ? (
          <UserAvatar 
            username={message.author.username}
            avatar={message.author.avatar}
            status="online"
            size="md"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        {!isConsecutive && (
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="font-semibold text-foreground hover:underline cursor-pointer">
              {message.author.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
        
        <div className="text-foreground break-words leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
};