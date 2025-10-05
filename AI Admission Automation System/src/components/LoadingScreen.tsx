import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, Sparkles, Target, Crown } from 'lucide-react';

interface LoadingScreenProps {
  level: number;
  onReady: () => void;
}

const levelData = {
  1: {
    title: "Foundation Level",
    icon: Target,
    color: "from-green-400 to-blue-500",
    messages: [
      "Initializing AI question generator...",
      "Analyzing your profile...",
      "Generating foundation level questions...",
      "Preparing adaptive difficulty system...",
      "Test ready! Let's begin your journey."
    ]
  },
  2: {
    title: "Intermediate Level",
    icon: Brain,
    color: "from-purple-400 to-pink-500",
    messages: [
      "Loading intermediate assessment...",
      "Calibrating difficulty based on Level 1 performance...",
      "Generating advanced reasoning questions...",
      "Setting up time management system...",
      "Ready to challenge your knowledge!"
    ]
  },
  3: {
    title: "Expert Level",
    icon: Crown,
    color: "from-yellow-400 to-red-500",
    messages: [
      "Preparing expert-level challenges...",
      "Analyzing your learning pattern...",
      "Generating complex problem-solving scenarios...",
      "Optimizing for mastery assessment...",
      "The ultimate test awaits!"
    ]
  }
};

export function LoadingScreen({ level, onReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentLevelData = levelData[level as keyof typeof levelData];
  const IconComponent = currentLevelData.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (newProgress >= 100) {
          setIsComplete(true);
          setTimeout(() => {
            onReady();
          }, 1500);
          return 100;
        }
        
        return newProgress;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onReady]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= currentLevelData.messages.length) {
          clearInterval(messageInterval);
          return prev;
        }
        return nextIndex;
      });
    }, 1200);

    return () => clearInterval(messageInterval);
  }, [currentLevelData.messages.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            {/* Animated Icon */}
            <motion.div
              animate={isComplete ? { scale: [1, 1.2, 1] } : { rotate: [0, 360] }}
              transition={
                isComplete 
                  ? { duration: 0.6, times: [0, 0.5, 1] }
                  : { duration: 3, repeat: Infinity, ease: "linear" }
              }
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentLevelData.color} flex items-center justify-center mx-auto mb-8 relative`}
            >
              <IconComponent className="w-12 h-12 text-white" />
              
              {/* Sparkle effects */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/40"
              />
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-20, -40, -20],
                    x: [0, Math.sin(i) * 20, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  className={`absolute w-2 h-2 bg-gradient-to-r ${currentLevelData.color} rounded-full`}
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${20 + (i % 3) * 30}%`
                  }}
                />
              ))}
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl mb-2"
            >
              {currentLevelData.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-8"
            >
              Preparing your personalized assessment
            </motion.p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">Loading Progress</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-gray-200"
              />
            </div>

            {/* Loading Messages */}
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="min-h-[2rem] flex items-center justify-center"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </motion.div>
                <p className="text-sm text-muted-foreground">
                  {currentLevelData.messages[currentMessageIndex] || currentLevelData.messages[currentLevelData.messages.length - 1]}
                </p>
              </div>
            </motion.div>

            {/* Completion Animation */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    ✅
                  </motion.div>
                  <span className="text-lg">Test Ready!</span>
                </div>
              </motion.div>
            )}

            {/* AI Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Adaptive Difficulty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Personalized Questions</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}