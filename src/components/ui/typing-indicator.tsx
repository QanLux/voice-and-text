import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  users: string[];
  className?: string;
}

export const TypingIndicator = ({ users, className }: TypingIndicatorProps) => {
  if (users.length === 0) return null;
  
  const typingText = users.length === 1 
    ? `${users[0]} is typing...`
    : users.length === 2
    ? `${users[0]} and ${users[1]} are typing...`
    : `${users[0]} and ${users.length - 1} others are typing...`;
    
  return (
    <div className={cn(
      "flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground animate-fade-in",
      className
    )}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
      <span className="italic">{typingText}</span>
    </div>
  );
};