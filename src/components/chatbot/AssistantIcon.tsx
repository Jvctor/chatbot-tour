import { FaceSmileIcon, SparklesIcon } from '@heroicons/react/24/solid';

export const AssistantIcon = ({ state = 'idle', size = 'md' }: { state?: 'idle' | 'thinking' | 'speaking', size?: 'sm' | 'md' | 'lg' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };
  if (state === 'thinking') {
    return <SparklesIcon className={getSize() + ' text-yellow-400 animate-pulse'} />;
  }
  return <FaceSmileIcon className={getSize() + ' text-secondary'} />;
};
