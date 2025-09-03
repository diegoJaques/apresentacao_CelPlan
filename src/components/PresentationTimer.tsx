import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export const PresentationTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-effect px-6 py-3 rounded-full flex items-center gap-4">
        <Clock className="w-5 h-5 text-accent-500" />
        <span className="font-mono text-lg font-semibold min-w-[80px] text-center">
          {formatTime(seconds)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};