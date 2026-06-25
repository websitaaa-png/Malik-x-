import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Lightbulb, Code, BookOpen, Music } from 'lucide-react';

interface QuickCommand {
  id: string;
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

interface QuickCommandsProps {
  onCommandSelect: (prompt: string) => void;
}

const QUICK_COMMANDS: QuickCommand[] = [
  {
    id: 'joke',
    label: 'Tell me a joke',
    prompt: 'Tell me a witty and clever joke that will make me laugh.',
    icon: <Zap size={16} />,
  },
  {
    id: 'idea',
    label: 'Creative idea',
    prompt: 'Give me a creative and innovative idea for a new project or business.',
    icon: <Lightbulb size={16} />,
  },
  {
    id: 'code',
    label: 'Code snippet',
    prompt: 'Write a useful code snippet in Python that demonstrates a common programming pattern.',
    icon: <Code size={16} />,
  },
  {
    id: 'explain',
    label: 'Explain concept',
    prompt: 'Explain a complex concept in simple, easy-to-understand terms.',
    icon: <BookOpen size={16} />,
  },
  {
    id: 'music',
    label: 'Music recommendation',
    prompt: 'Recommend a great song or artist based on popular music trends.',
    icon: <Music size={16} />,
  },
];

const QuickCommands: React.FC<QuickCommandsProps> = ({ onCommandSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {QUICK_COMMANDS.map((command, index) => (
        <motion.div
          key={command.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onCommandSelect(command.prompt)}
            className="w-full neon-glow flex flex-col items-center gap-1 h-auto py-2"
            title={command.prompt}
          >
            {command.icon}
            <span className="text-xs text-center">{command.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickCommands;
