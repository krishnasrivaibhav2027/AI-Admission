import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Lock, Play, CheckCircle, Crown, Target, Brain } from 'lucide-react';
import { UserData } from '../App';

interface LevelMapProps {
  currentLevel: number;
  completedLevels: number[];
  onStartTest: (level: number) => void;
  userData: UserData | null;
}

const levelData = [
  {
    level: 1,
    title: "Foundation Level",
    description: "Basic knowledge assessment",
    icon: Target,
    color: "from-green-400 to-blue-500",
    questions: 15,
    timeLimit: 20,
    difficulty: "Beginner"
  },
  {
    level: 2,
    title: "Intermediate Level",
    description: "Advanced concepts and reasoning",
    icon: Brain,
    color: "from-purple-400 to-pink-500",
    questions: 20,
    timeLimit: 30,
    difficulty: "Intermediate"
  },
  {
    level: 3,
    title: "Expert Level",
    description: "Mastery and complex problem solving",
    icon: Crown,
    color: "from-yellow-400 to-red-500",
    questions: 25,
    timeLimit: 45,
    difficulty: "Advanced"
  }
];

export function LevelMap({ currentLevel, completedLevels, onStartTest, userData }: LevelMapProps) {
  const getAvailableLevels = () => {
    if (completedLevels.length === 0) return [1];
    const maxCompleted = Math.max(...completedLevels);
    const available = [];
    for (let i = 1; i <= maxCompleted + 1 && i <= 3; i++) {
      available.push(i);
    }
    return available;
  };

  const availableLevels = getAvailableLevels();

  const getLevelStatus = (level: number) => {
    if (completedLevels.includes(level)) return 'completed';
    if (availableLevels.includes(level)) return 'available';
    return 'locked';
  };

  const getProgressPercentage = () => {
    return (completedLevels.length / 3) * 100;
  };

  return (
    <div className="min-h-screen p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl text-white">🎓</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl mb-1">Welcome, {userData?.firstName}!</h1>
              <p className="text-muted-foreground">Choose your challenge level</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Progress</span>
              <span className="text-sm">{completedLevels.length}/3 Levels</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Achievement Badges */}
        {completedLevels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-8"
          >
            {completedLevels.map((level) => (
              <Badge key={level} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                <Star className="w-4 h-4 mr-2" />
                Level {level} Complete
              </Badge>
            ))}
          </motion.div>
        )}

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {levelData.map((levelInfo, index) => {
            const status = getLevelStatus(levelInfo.level);
            const IconComponent = levelInfo.icon;
            
            return (
              <motion.div
                key={levelInfo.level}
                initial={{ opacity: 0, y: 100, rotate: -5 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotate: 0,
                  scale: status === 'available' && levelInfo.level === currentLevel ? 1.05 : 1
                }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: status !== 'locked' ? 1.02 : 1,
                  y: status !== 'locked' ? -5 : 0
                }}
                className="relative"
              >
                <Card className={`h-full transition-all duration-300 border-2 ${
                  status === 'completed' 
                    ? 'border-green-500 bg-green-50' 
                    : status === 'available' 
                      ? 'border-blue-500 bg-white shadow-lg' 
                      : 'border-gray-300 bg-gray-100 opacity-60'
                }`}>
                  <CardContent className="p-6 text-center">
                    {/* Level Number Badge */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${levelInfo.color} flex items-center justify-center mx-auto mb-4 relative`}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : status === 'locked' ? (
                        <Lock className="w-8 h-8 text-white" />
                      ) : (
                        <IconComponent className="w-8 h-8 text-white" />
                      )}
                      
                      {/* Sparkle effect for available levels */}
                      {status === 'available' && levelInfo.level === currentLevel && (
                        <>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-30"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                        </>
                      )}
                    </div>

                    <h3 className="text-xl mb-2">{levelInfo.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {levelInfo.description}
                    </p>

                    {/* Level Stats */}
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{levelInfo.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Limit:</span>
                        <span>{levelInfo.timeLimit} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge variant="outline" className="text-xs">
                          {levelInfo.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => onStartTest(levelInfo.level)}
                      disabled={status === 'locked'}
                      className={`w-full ${
                        status === 'completed'
                          ? 'bg-green-600 hover:bg-green-700'
                          : status === 'available'
                            ? `bg-gradient-to-r ${levelInfo.color} hover:opacity-90`
                            : 'bg-gray-400 cursor-not-allowed'
                      } transition-all duration-300`}
                    >
                      {status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Retake Test
                        </>
                      ) : status === 'available' ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Level {levelInfo.level}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Connecting Path */}
                {index < levelData.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2 z-10">
                    {completedLevels.includes(levelInfo.level) && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 1 + index * 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg mb-4 text-center">💡 Test Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Read each question carefully before answering</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Manage your time wisely across all questions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Review your answers before submitting</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Stay calm and trust your knowledge</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}