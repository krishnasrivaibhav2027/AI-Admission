import { StudentData } from '../types';

interface EmailData {
  to: string;
  subject: string;
  body: string;
  type: 'acceptance' | 'rejection' | 'retry';
}

export async function sendEmail(
  studentData: StudentData,
  type: 'acceptance' | 'rejection' | 'retry',
  additionalInfo?: { level?: string; score?: number }
): Promise<boolean> {
  const emailData: EmailData = {
    to: studentData.email,
    subject: getEmailSubject(type),
    body: getEmailBody(studentData, type, additionalInfo),
    type
  };

  console.log('Sending email:', emailData);

  return true;
}

function getEmailSubject(type: string): string {
  switch (type) {
    case 'acceptance':
      return 'Congratulations! - Admission Confirmed';
    case 'rejection':
      return 'Admission Test Result';
    case 'retry':
      return 'Test Retry Available';
    default:
      return 'Admission System Notification';
  }
}

function getEmailBody(
  studentData: StudentData,
  type: string,
  additionalInfo?: { level?: string; score?: number }
): string {
  const { firstName, lastName } = studentData;

  switch (type) {
    case 'acceptance':
      return `Dear ${firstName} ${lastName},

Congratulations! We are delighted to inform you that you have successfully passed all levels of our admission assessment.

Your exceptional performance demonstrates your strong understanding of Physics and problem-solving abilities. We look forward to welcoming you to our institution.

Next Steps:
1. You will receive further enrollment instructions within 3-5 business days
2. Please check your email regularly for updates
3. Contact our admissions office if you have any questions

Once again, congratulations on this achievement!

Best regards,
Admissions Team
Academic Excellence Institute`;

    case 'rejection':
      return `Dear ${firstName} ${lastName},

Thank you for taking the time to complete our admission assessment.

After careful evaluation of your test performance at the ${additionalInfo?.level?.toUpperCase() || ''} level (Score: ${additionalInfo?.score?.toFixed(1) || 'N/A'}/10), we regret to inform you that you did not meet the minimum requirements for admission at this time.

We encourage you to:
- Review the study materials provided on our website
- Consider strengthening your understanding of Physics fundamentals
- Reapply in the next admission cycle

We appreciate your interest in our institution and wish you the best in your academic pursuits.

Best regards,
Admissions Team
Academic Excellence Institute`;

    case 'retry':
      return `Dear ${firstName} ${lastName},

This is to inform you about your recent test attempt at the ${additionalInfo?.level?.toUpperCase() || ''} level.

Your score: ${additionalInfo?.score?.toFixed(1) || 'N/A'}/10

You have additional attempts available. We encourage you to review the material and try again.

Tips for success:
- Take your time to understand each question
- Provide detailed, well-structured answers
- Review fundamental concepts before retrying

You can retake the test at any time through your admission portal.

Best regards,
Admissions Team
Academic Excellence Institute`;

    default:
      return `Dear ${firstName} ${lastName},\n\nThank you for your participation in our admission process.\n\nBest regards,\nAdmissions Team`;
  }
}
