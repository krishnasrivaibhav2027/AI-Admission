import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { generateQuestions, evaluateAnswer } from '../services/geminiService';
import { saveTestResult, saveAttempts, getAttempts, saveCurrentLevel } from '../services/storageService';
import { Question } from '../types';
import { TestResult, UserData } from '../App';

interface AITestInterfaceProps {
  level: number;
  onComplete: (result: TestResult) => void;
  userData: UserData | null;
}

const LEVEL_NAMES = ['easy', 'medium', 'hard'];
const QUESTION_COUNTS = [5, 3, 2];
const RETAKE_LIMITS: Record<string, number> = { medium: 1, hard: 1 };

export function AITestInterface({ level, onComplete, userData }: AITestInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(level * 15 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const levelName = LEVEL_NAMES[level - 1];
  const numQuestions = QUESTION_COUNTS[level - 1];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    loadQuestions();
  }, [level]);

  useEffect(() => {
    if (questions.length === 0) return;

    if (timeLeft <= 300 && !showTimeWarning) {
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
  }, [timeLeft, showTimeWarning, questions.length]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setLoadingError(null);

    try {
      const generatedQuestions = await generateQuestions(levelName, numQuestions);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setLoadingError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (index: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [index]: answer }));
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

  const calculateScore = async () => {
    let totalScore = 0;
    const evaluations = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i] || '';

      if (userAnswer.trim().length === 0) {
        evaluations.push(0);
        continue;
      }

      try {
        const evaluation = await evaluateAnswer(
          question.question,
          question.answer,
          userAnswer
        );
        evaluations.push(evaluation.avg);
        totalScore += evaluation.avg;
      } catch (error) {
        console.error('Evaluation error:', error);
        evaluations.push(0);
      }
    }

    const averageScore = questions.length > 0 ? totalScore / questions.length : 0;
    return averageScore;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const score = await calculateScore();
      const timeSpent = (level * 15 * 60) - timeLeft;
      const passed = score >= 5;

      const attempts = getAttempts();
      attempts[levelName as keyof typeof attempts]++;
      saveAttempts(attempts);

      const studentAnswers = questions.map((_, i) => answers[i] || '');

      const result: TestResult = {
        level,
        score,
        totalQuestions: questions.length,
        passed,
        timeSpent
      };

      const testResult = {
        level: levelName as 'easy' | 'medium' | 'hard',
        score,
        result: passed ? 'pass' as const : 'fail' as const,
        questions,
        studentAnswers
      };

      saveTestResult(testResult);

      if (passed && level < 3) {
        saveCurrentLevel(LEVEL_NAMES[level]);
      }

      onComplete(result);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('There was an error submitting your test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentQuestionAnswered = answers[currentQuestionIndex]?.trim().length > 0;
  const totalAnswered = Object.values(answers).filter(a => a?.trim().length > 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl mb-2">Generating Questions</h2>
            <p className="text-muted-foreground">
              AI is creating {numQuestions} questions for Level {level}...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl mb-2">Error Loading Questions</h2>
            <p className="text-muted-foreground mb-4">{loadingError}</p>
            <Button onClick={loadQuestions}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-2xl">Level {level} Assessment - {levelName.toUpperCase()}</h1>
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
                  Only {Math.floor(timeLeft / 60)} minutes remaining!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progress</span>
            <span className="text-sm">{totalAnswered}/{questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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
                  <span className="text-sm text-muted-foreground">Open-ended</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQuestion?.question}
                </div>

                <div>
                  <Label htmlFor="answer" className="text-base mb-2 block">Your Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Provide a detailed and comprehensive answer..."
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                    className="min-h-40 resize-none"
                    rows={8}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>Be specific and thorough in your explanation</span>
                    <span>{answers[currentQuestionIndex]?.length || 0} characters</span>
                  </div>
                </div>

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
                    : answers[index]?.trim().length > 0
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
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Test
                </>
              )}
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
                All answers will be evaluated by AI based on multiple criteria
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
