import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { TestQuestion, TestResult, UserData } from '../App';

interface TestInterfaceProps {
  level: number;
  onComplete: (result: TestResult) => void;
  userData: UserData | null;
}

// Mock question data
const generateQuestions = (level: number): TestQuestion[] => {
  const baseQuestions = {
    1: [
      {
        id: "l1_q1",
        question: "What is the primary purpose of object-oriented programming?",
        type: "mcq" as const,
        options: [
          "To make programs run faster",
          "To organize code into reusable, modular components",
          "To reduce memory usage",
          "To write shorter programs"
        ],
        correctAnswer: "To organize code into reusable, modular components",
        level: 1
      },
      {
        id: "l1_q2",
        question: "Explain the difference between a stack and a queue data structure.",
        type: "short_answer" as const,
        level: 1
      },
      {
        id: "l1_q3",
        question: "Which of the following is NOT a valid variable name in most programming languages?",
        type: "mcq" as const,
        options: ["myVariable", "user_name", "2ndValue", "_private"],
        correctAnswer: "2ndValue",
        level: 1
      }
    ],
    2: [
      {
        id: "l2_q1",
        question: "What is the time complexity of binary search algorithm?",
        type: "mcq" as const,
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: "O(log n)",
        level: 2
      },
      {
        id: "l2_q2",
        question: "Describe the concept of polymorphism in object-oriented programming with an example.",
        type: "short_answer" as const,
        level: 2
      },
      {
        id: "l2_q3",
        question: "Which design pattern is most suitable for creating a single instance of a class?",
        type: "mcq" as const,
        options: ["Factory Pattern", "Observer Pattern", "Singleton Pattern", "Strategy Pattern"],
        correctAnswer: "Singleton Pattern",
        level: 2
      }
    ],
    3: [
      {
        id: "l3_q1",
        question: "Analyze the trade-offs between microservices and monolithic architecture.",
        type: "essay" as const,
        level: 3
      },
      {
        id: "l3_q2",
        question: "What is the primary advantage of using consistent hashing in distributed systems?",
        type: "mcq" as const,
        options: [
          "Faster data retrieval",
          "Better load balancing during node additions/removals",
          "Reduced memory usage",
          "Improved security"
        ],
        correctAnswer: "Better load balancing during node additions/removals",
        level: 3
      },
      {
        id: "l3_q3",
        question: "Design a system to handle 1 million concurrent users. Discuss your architecture choices.",
        type: "essay" as const,
        level: 3
      }
    ]
  };

  return baseQuestions[level as keyof typeof baseQuestions] || [];
};

export function TestInterface({ level, onComplete, userData }: TestInterfaceProps) {
  const [questions] = useState<TestQuestion[]>(generateQuestions(level));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(level * 15 * 60); // 15 minutes per level
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLeft <= 300 && !showTimeWarning) { // 5 minutes warning
      setShowTimeWarning(true);
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showTimeWarning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'mcq' && userAnswer === question.correctAnswer) {
        correctAnswers++;
      } else if (question.type === 'short_answer' || question.type === 'essay') {
        // For demo purposes, assume 70% of non-MCQ answers are correct
        if (userAnswer && userAnswer.trim().length > 10) {
          correctAnswers += 0.7;
        }
      }
    });

    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = calculateScore();
    const timeSpent = (level * 15 * 60) - timeLeft;
    const passed = score >= 70;

    const result: TestResult = {
      level,
      score,
      totalQuestions: questions.length,
      passed,
      timeSpent
    };

    onComplete(result);
  };

  const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion.id];
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-2xl">Level {level} Assessment</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </motion.div>

        {/* Time Warning */}
        <AnimatePresence>
          {showTimeWarning && timeLeft > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6"
            >
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Only {Math.floor(timeLeft / 60)} minutes remaining! Make sure to review your answers.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progress</span>
            <span className="text-sm">{totalAnswered}/{questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {currentQuestionIndex + 1}</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {currentQuestion?.type.replace('_', ' ')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQuestion?.question}
                </div>

                {/* Answer Input */}
                <div className="space-y-4">
                  {currentQuestion?.type === 'mcq' && currentQuestion.options && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  )}

                  {(currentQuestion?.type === 'short_answer' || currentQuestion?.type === 'essay') && (
                    <div>
                      <Textarea
                        placeholder={
                          currentQuestion.type === 'essay'
                            ? 'Provide a detailed answer with examples and explanations...'
                            : 'Enter your answer here...'
                        }
                        value={answers[currentQuestion?.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="min-h-32 resize-none"
                        rows={currentQuestion.type === 'essay' ? 8 : 4}
                      />
                      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                        <span>
                          {currentQuestion.type === 'essay' ? 'Minimum 50 words recommended' : 'Be concise and clear'}
                        </span>
                        <span>
                          {answers[currentQuestion?.id]?.length || 0} characters
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Answer Status Indicator */}
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    isCurrentQuestionAnswered ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={isCurrentQuestionAnswered ? 'text-green-600' : 'text-gray-500'}>
                    {isCurrentQuestionAnswered ? 'Answered' : 'Not answered'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[questions[index].id]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || totalAnswered === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Summary Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-sm">
                <span>Test Progress:</span>
                <span>{totalAnswered}/{questions.length} questions completed</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground text-center">
                You can navigate between questions and change your answers before submitting
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}