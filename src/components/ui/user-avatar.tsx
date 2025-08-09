import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username: string;
  avatar?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base'
};

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500', 
  dnd: 'bg-red-500',
  offline: 'bg-gray-500'
};

export const UserAvatar = ({ 
  username, 
  avatar, 
  status = 'offline', 
  size = 'md',
  showStatus = true,
  className 
}: UserAvatarProps) => {
  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          className={cn(
            "rounded-full object-cover animate-fade-in",
            sizeClasses[size]
          )}
        />
      ) : (
        <div className={cn(
          "rounded-full bg-discord-primary flex items-center justify-center font-semibold animate-bounce-in",
          sizeClasses[size]
        )}>
          {username.charAt(0).toUpperCase()}
        </div>
      )}
      
      {showStatus && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-bg-secondary animate-fade-in",
          statusColors[status],
          size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
        )} />
      )}
    </div>
  );
};