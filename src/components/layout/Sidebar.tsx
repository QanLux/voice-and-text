import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Hash, Volume2, Plus, Settings, LogOut } from "lucide-react";

interface Server {
  id: string;
  name: string;
  avatar?: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  serverId: string;
}

interface SidebarProps {
  servers: Server[];
  channels: Channel[];
  currentServer?: Server;
  currentChannel?: Channel;
  onServerSelect: (server: Server) => void;
  onChannelSelect: (channel: Channel) => void;
  onCreateServer: () => void;
  onCreateChannel: () => void;
  onLogout: () => void;
}

export const Sidebar = ({
  servers,
  channels,
  currentServer,
  currentChannel,
  onServerSelect,
  onChannelSelect,
  onCreateServer,
  onCreateChannel,
  onLogout,
}: SidebarProps) => {
  const textChannels = channels.filter(c => c.type === 'text' && c.serverId === currentServer?.id);
  const voiceChannels = channels.filter(c => c.type === 'voice' && c.serverId === currentServer?.id);

  return (
    <div className="flex h-full">
      {/* Server List */}
      <div className="w-16 bg-bg-tertiary border-r border-border/50 flex flex-col items-center py-4 space-y-3">
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {servers.map((server) => (
              <Button
                key={server.id}
                variant={currentServer?.id === server.id ? "discord" : "ghost"}
                size="icon"
                className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200"
                onClick={() => onServerSelect(server)}
                title={server.name}
              >
                {server.avatar ? (
                  <img src={server.avatar} alt={server.name} className="w-full h-full rounded-inherit" />
                ) : (
                  <span className="text-lg font-bold">{server.name.charAt(0).toUpperCase()}</span>
                )}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 border-2 border-dashed border-border/50 hover:border-discord-primary"
              onClick={onCreateServer}
              title="Create Server"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </ScrollArea>
        <Separator className="w-8" />
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-2xl hover:rounded-xl transition-all duration-200 text-discord-danger hover:text-discord-danger"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Channel List */}
      {currentServer && (
        <div className="w-60 bg-bg-secondary border-r border-border/50 flex flex-col">
          <div className="h-12 bg-bg-tertiary border-b border-border/50 flex items-center px-4">
            <h2 className="font-semibold text-foreground truncate">{currentServer.name}</h2>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-4">
              {/* Text Channels */}
              <div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Text Channels
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={onCreateChannel}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {textChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={currentChannel?.id === channel.id ? "secondary" : "ghost"}
                      className="w-full justify-start px-2 py-1 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      onClick={() => onChannelSelect(channel)}
                    >
                      <Hash className="h-3 w-3 mr-2" />
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Voice Channels */}
              <div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Voice Channels
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={onCreateChannel}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {voiceChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={currentChannel?.id === channel.id ? "secondary" : "ghost"}
                      className="w-full justify-start px-2 py-1 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      onClick={() => onChannelSelect(channel)}
                    >
                      <Volume2 className="h-3 w-3 mr-2" />
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};