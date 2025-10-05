import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mail, CheckCircle, Download, Share2, ArrowLeft, Calendar, FileText, Award } from 'lucide-react';
import { UserData } from '../App';

interface EmailSentScreenProps {
  userData: UserData | null;
  onBackToMap: () => void;
}

export function EmailSentScreen({ userData, onBackToMap }: EmailSentScreenProps) {
  const handleDownloadCertificate = () => {
    // In a real app, this would generate and download a PDF certificate
    alert('Certificate download would start here');
  };

  const handleShareResults = () => {
    // In a real app, this would open share dialog
    alert('Social media sharing would open here');
  };

  const handleScheduleConsultation = () => {
    // In a real app, this would open scheduling interface
    alert('Consultation scheduling would open here');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          {/* Animated Success Icon */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <Mail className="w-16 h-16 text-white" />
            </motion.div>
            
            {/* Success checkmark overlay */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            {/* Floating success particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 60
                }}
                transition={{
                  duration: 2,
                  delay: 1 + i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              />
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl mb-4 text-green-600"
          >
            Email Sent Successfully!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-2"
          >
            Your test results have been sent to your email
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Badge className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
              📧 {userData?.email}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Email Content Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl">
                🎓 AI Admission Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center border-b pb-6">
                  <h3 className="text-2xl mb-2">Dear {userData?.firstName} {userData?.lastName},</h3>
                  <p className="text-muted-foreground">
                    Thank you for completing the AI Admission Assessment. Your detailed results are attached below.
                  </p>
                </div>

                {/* Email Content Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      What's Included:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Comprehensive score breakdown
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Performance analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        Personalized recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        Next steps guide
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Attachments:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        Detailed Score Report (PDF)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Certificate of Completion
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Learning Path Recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        Admission Guidelines
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg mb-3 text-center">📅 What's Next?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white">1</span>
                      </div>
                      <p>Review your results and recommendations</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white">2</span>
                      </div>
                      <p>Schedule a consultation with our advisors</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white">3</span>
                      </div>
                      <p>Begin your learning journey</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-center">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleDownloadCertificate}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </Button>
                
                <Button
                  onClick={handleShareResults}
                  variant="outline"
                  className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Share Achievement
                </Button>
                
                <Button
                  onClick={handleScheduleConsultation}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2">📞 <strong>Phone Support:</strong></p>
                  <p className="text-muted-foreground">1-800-AI-ADMIT (24/7)</p>
                </div>
                <div>
                  <p className="mb-2">💬 <strong>Live Chat:</strong></p>
                  <p className="text-muted-foreground">Available 9 AM - 6 PM EST</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Email delivery may take up to 10 minutes. Check your spam folder if you don't see it in your inbox.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={onBackToMap}
            variant="outline"
            className="flex items-center gap-2 mx-auto px-8 py-3 text-lg border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>Thank you for choosing our AI Admission Assessment System!</p>
          <p className="mt-1">We're excited to be part of your academic journey. 🚀</p>
        </motion.div>
      </div>
    </div>
  );
}