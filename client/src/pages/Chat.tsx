import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/ChatInterface";
import Waveform from "@/components/Waveform";
import HolographicPanel from "@/components/HolographicPanel";
import { Plus, Menu } from 'lucide-react';

export default function Chat() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);
  const createConversationMutation = trpc.chat.createConversation.useMutation();
  const getConversationsMutation = trpc.chat.getConversations.useQuery();

  React.useEffect(() => {
    if (isAuthenticated && !currentConversationId) {
      createConversationMutation.mutate({}, {
        onSuccess: (result: any) => {
          setCurrentConversationId(result.insertId || result.id);
        },
      });
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="hud-panel p-8">
          <p className="hud-text">Initializing Jarvis...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="hud-panel p-8 text-center">
          <h1 className="text-2xl font-bold neon-text mb-4">JARVIS</h1>
          <p className="mb-4">Please log in to access Jarvis AI.</p>
          <Button onClick={() => window.location.href = 
            `/api/oauth/login?returnTo=${encodeURIComponent(window.location.href)}`
          } className="neon-glow">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="neon-glow"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-2xl font-bold neon-text">JARVIS</h1>
        </div>
        <nav className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user?.name || 'User'}</span>
          <Button onClick={logout} variant="secondary" className="neon-glow">
            Logout
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <HolographicPanel className="w-64 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="hud-text text-lg">Conversations</h2>
              <Button size="icon" variant="secondary" className="neon-glow">
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-2">
              {/* TODO: List conversations here */}
              <p className="hud-text text-xs">No conversations yet</p>
            </div>
          </HolographicPanel>
        )}

        {/* Chat Area */}
        <div className="flex-grow flex flex-col gap-4 overflow-hidden">
          {/* Waveform Visualizer */}
          <HolographicPanel className="p-4">
            <Waveform isActive={true} isSpeaking={isJarvisSpeaking} />
          </HolographicPanel>

          {/* Chat Interface */}
          <HolographicPanel className="flex-grow p-0 overflow-hidden">
            <ChatInterface
              conversationId={currentConversationId}
              onNewConversation={() => setCurrentConversationId(undefined)}
            />
          </HolographicPanel>
        </div>
      </div>
    </div>
  );
}
