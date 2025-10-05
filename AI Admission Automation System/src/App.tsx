import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationScreen } from './components/RegistrationScreen';
import { LevelMap } from './components/LevelMap';
import { AITestInterface } from './components/AITestInterface';
import { ScoreScreen } from './components/ScoreScreen';
import { EmailSentScreen } from './components/EmailSentScreen';
import { LoadingScreen } from './components/LoadingScreen';

export interface UserData {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  age: number;
  email: string;
  phone: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  level: number;
}

export interface TestResult {
  level: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
}

type AppState = 
  | 'registration' 
  | 'level-map' 
  | 'loading' 
  | 'test' 
  | 'score' 
  | 'email-sent'
  | 'level-transition';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('registration');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data);
    setCurrentState('level-map');
  };

  const handleStartTest = (level: number) => {
    setCurrentLevel(level);
    setCurrentState('loading');
  };

  const handleTestReady = () => {
    setCurrentState('test');
  };

  const handleTestComplete = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
    
    if (result.passed && result.level < 3) {
      // Show level transition animation
      setIsTransitioning(true);
      setCurrentState('level-transition');
      
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setIsTransitioning(false);
        setCurrentState('level-map');
      }, 3000);
    } else {
      setCurrentState('score');
    }
  };

  const handleRetakeTest = () => {
    setCurrentState('loading');
  };

  const handleEmailSent = () => {
    setCurrentState('email-sent');
  };

  const handleBackToLevelMap = () => {
    setCurrentState('level-map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <AnimatePresence mode="wait">
        {currentState === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegistrationScreen onComplete={handleRegistrationComplete} />
          </motion.div>
        )}

        {currentState === 'level-map' && (
          <motion.div
            key="level-map"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <LevelMap
              currentLevel={currentLevel}
              completedLevels={testResults.filter(r => r.passed).map(r => r.level)}
              onStartTest={handleStartTest}
              userData={userData}
            />
          </motion.div>
        )}

        {currentState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingScreen 
              level={currentLevel} 
              onReady={handleTestReady}
            />
          </motion.div>
        )}

        {currentState === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <AITestInterface
              level={currentLevel}
              onComplete={handleTestComplete}
              userData={userData}
            />
          </motion.div>
        )}

        {currentState === 'level-transition' && (
          <motion.div
            key="level-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center z-50"
          >
            <div className="text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 1, times: [0, 0.6, 1] }}
                className="mb-8"
              >
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-4xl">🎉</span>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl mb-4"
              >
                Level {currentLevel} Complete!
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-xl"
              >
                Advancing to Level {currentLevel + 1}...
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="w-64 h-2 bg-white/30 rounded-full mx-auto mt-8 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                  className="h-full bg-white rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentState === 'score' && (
          <motion.div
            key="score"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
          >
            <ScoreScreen
              results={testResults}
              userData={userData}
              onRetake={handleRetakeTest}
              onEmailSent={handleEmailSent}
              onBackToMap={handleBackToLevelMap}
            />
          </motion.div>
        )}

        {currentState === 'email-sent' && (
          <motion.div
            key="email-sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.4 }}
          >
            <EmailSentScreen
              userData={userData}
              onBackToMap={handleBackToLevelMap}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}