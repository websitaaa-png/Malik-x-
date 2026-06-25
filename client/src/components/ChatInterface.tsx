import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import QuickCommands from './QuickCommands';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  conversationId?: number;
  onNewConversation?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, onNewConversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        content: userInput,
      });

      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        setInput(transcript.trim());
        resetTranscript();
      }
    } else {
      startListening();
    }
  };

  const handleQuickCommand = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-primary/20">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <h2 className="text-lg font-bold neon-text">JARVIS CHAT</h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={onNewConversation}
          className="neon-glow"
        >
          New Chat
        </Button>
      </div>

      {/* Quick Commands */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-primary/20">
          <p className="text-xs hud-text mb-3">Quick Commands:</p>
          <QuickCommands onCommandSelect={handleQuickCommand} />
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-muted-foreground"
              >
                <p className="hud-text">Start a conversation with Jarvis...</p>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary/30 text-foreground'
                        : 'hud-panel bg-primary/10'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-primary/20">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow bg-input border-primary/30 text-foreground placeholder-muted-foreground"
          />
          <Button
            type="button"
            size="icon"
            onClick={handleVoiceInput}
            variant={isListening ? 'default' : 'secondary'}
            className={`neon-glow ${isListening ? 'bg-red-500' : ''}`}
          >
            <Mic size={18} />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="neon-glow"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
