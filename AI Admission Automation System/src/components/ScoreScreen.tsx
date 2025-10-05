import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star, Clock, Target, RefreshCw, Mail, ArrowLeft, Award, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { TestResult, UserData } from '../App';

interface ScoreScreenProps {
  results: TestResult[];
  userData: UserData | null;
  onRetake: () => void;
  onEmailSent: () => void;
  onBackToMap: () => void;
}

export function ScoreScreen({ results, userData, onRetake, onEmailSent, onBackToMap }: ScoreScreenProps) {
  const [animatedScores, setAnimatedScores] = useState<Record<number, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const currentResult = results[results.length - 1];
  const overallScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  const totalPassed = results.filter(r => r.passed).length;
  const allLevelsPassed = totalPassed === 3;

  useEffect(() => {
    // Animate score counting
    results.forEach((result) => {
      let current = 0;
      const increment = result.score / 50; // Animate over 50 steps
      const timer = setInterval(() => {
        current += increment;
        if (current >= result.score) {
          current = result.score;
          clearInterval(timer);
        }
        setAnimatedScores(prev => ({ ...prev, [result.level]: Math.round(current) }));
      }, 30);
    });
  }, [results]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', description: 'Outstanding' };
    if (score >= 85) return { grade: 'A', description: 'Excellent' };
    if (score >= 80) return { grade: 'B+', description: 'Very Good' };
    if (score >= 75) return { grade: 'B', description: 'Good' };
    if (score >= 70) return { grade: 'C+', description: 'Satisfactory' };
    return { grade: 'F', description: 'Needs Improvement' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSendEmail = async () => {
    setIsEmailSending(true);

    try {
      const { sendEmail } = await import('../services/emailService');
      const emailType = allLevelsPassed ? 'acceptance' : currentResult.passed ? 'retry' : 'rejection';

      if (userData) {
        await sendEmail(userData, emailType, {
          level: `Level ${currentResult.level}`,
          score: currentResult.score
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      onEmailSent();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
      setIsEmailSending(false);
    }
  };

  const getCertificateLevel = () => {
    if (allLevelsPassed && overallScore >= 90) return 'Distinction';
    if (allLevelsPassed && overallScore >= 80) return 'Merit';
    if (allLevelsPassed) return 'Pass';
    return null;
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={currentResult.passed ? { 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${
                currentResult.passed 
                  ? 'from-green-400 to-blue-500' 
                  : 'from-red-400 to-orange-500'
              } flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            >
              {currentResult.passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Target className="w-12 h-12 text-white" />
              )}
            </motion.div>
            
            {/* Floating success particles */}
            {currentResult.passed && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      y: [-20, -60],
                      x: [0, Math.sin(i) * 40]
                    }}
                    transition={{
                      duration: 2,
                      delay: 1.5 + i * 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                  />
                ))}
              </>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={`text-4xl mb-2 ${currentResult.passed ? 'text-green-600' : 'text-red-600'}`}
          >
            {currentResult.passed ? 'Congratulations!' : 'Test Complete'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-muted-foreground"
          >
            Level {currentResult.level} Assessment Results
          </motion.p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Your Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Score Display */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.8, type: "spring" }}
                  className={`text-8xl font-mono ${getScoreColor(currentResult.score)} mb-4`}
                >
                  {animatedScores[currentResult.level] || 0}%
                </motion.div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge 
                    className={`px-6 py-2 text-lg ${
                      currentResult.passed 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {currentResult.passed ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {currentResult.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                  
                  <Badge variant="outline" className="px-4 py-2 text-base">
                    Grade: {getGrade(currentResult.score).grade}
                  </Badge>
                </div>

                <p className="text-muted-foreground">
                  {getGrade(currentResult.score).description} Performance
                </p>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Questions</span>
                  </div>
                  <p className="text-2xl">{Math.round(currentResult.score * currentResult.totalQuestions / 100)}/{currentResult.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Time Taken</span>
                  </div>
                  <p className="text-2xl">{formatTime(currentResult.timeSpent)}</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Level</span>
                  </div>
                  <p className="text-2xl">{currentResult.level}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Progress (if multiple levels completed) */}
        {results.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-center">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{overallScore}%</div>
                  <p className="text-muted-foreground">Average Score Across All Levels</p>
                </div>
                
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={`${result.level}-${index}`} className="flex items-center justify-between">
                      <span>Level {result.level}</span>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={animatedScores[result.level] || 0} 
                          className="w-32 h-2"
                        />
                        <span className={`w-12 text-right ${getScoreColor(result.score)}`}>
                          {animatedScores[result.level] || 0}%
                        </span>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Certificate Preview (if all levels passed) */}
        {allLevelsPassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl mb-4 text-yellow-800">Certificate of Achievement</h3>
                <p className="text-yellow-700 mb-4">
                  Congratulations! You've successfully completed all levels with {getCertificateLevel()} grade.
                </p>
                <div className="bg-white/50 rounded-lg p-4 mb-6 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>{userData?.firstName} {userData?.lastName}</strong><br />
                    Has successfully completed the AI Admission Assessment<br />
                    with an overall score of <strong>{overallScore}%</strong><br />
                    <em>Level: {getCertificateLevel()}</em>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="outline"
            onClick={onBackToMap}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Level Map
          </Button>

          {!currentResult.passed && (
            <Button
              onClick={onRetake}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Level {currentResult.level}
            </Button>
          )}

          <Button
            onClick={handleSendEmail}
            disabled={isEmailSending}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isEmailSending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {isEmailSending ? 'Sending...' : 'Email Results'}
          </Button>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-center">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="text-base">Strengths:</h4>
                  {currentResult.score >= 80 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Excellent problem-solving skills</span>
                    </div>
                  )}
                  {currentResult.timeSpent < (currentResult.level * 10 * 60) && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Efficient time management</span>
                    </div>
                  )}
                  {currentResult.passed && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Met all assessment criteria</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-base">Recommendations:</h4>
                  {currentResult.score < 70 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Review fundamental concepts</span>
                    </div>
                  )}
                  {!allLevelsPassed && currentResult.passed && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Ready for next level challenge</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Practice regularly to maintain skills</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}