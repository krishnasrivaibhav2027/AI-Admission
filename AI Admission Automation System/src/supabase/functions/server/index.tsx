import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Register user
app.post('/make-server-8af19903/register', async (c) => {
  try {
    const userData = await c.req.json();
    console.log('Registering user:', userData.email);
    
    // Store user data
    const userId = crypto.randomUUID();
    await kv.set(`user:${userId}`, userData);
    await kv.set(`user:email:${userData.email}`, userId);
    
    return c.json({ 
      success: true, 
      userId,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to register user' 
    }, 500);
  }
});

// Generate test questions
app.post('/make-server-8af19903/generate-test', async (c) => {
  try {
    const { level, userId } = await c.req.json();
    console.log('Generating test for level:', level, 'user:', userId);
    
    // Simulate AI question generation based on level and user performance
    const questions = generateQuestionsForLevel(level);
    
    // Store test session
    const testId = crypto.randomUUID();
    await kv.set(`test:${testId}`, {
      userId,
      level,
      questions,
      startTime: new Date().toISOString(),
      status: 'active'
    });
    
    return c.json({ 
      success: true, 
      testId,
      questions 
    });
  } catch (error) {
    console.log('Test generation error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to generate test' 
    }, 500);
  }
});

// Submit test results
app.post('/make-server-8af19903/submit-test', async (c) => {
  try {
    const { testId, answers, timeSpent } = await c.req.json();
    console.log('Submitting test:', testId);
    
    // Get test data
    const testData = await kv.get(`test:${testId}`);
    if (!testData) {
      return c.json({ 
        success: false, 
        error: 'Test not found' 
      }, 404);
    }
    
    // Calculate score
    const score = calculateTestScore(testData.questions, answers);
    const passed = score >= 70;
    
    // Store results
    const result = {
      testId,
      userId: testData.userId,
      level: testData.level,
      score,
      passed,
      timeSpent,
      answers,
      completedAt: new Date().toISOString()
    };
    
    await kv.set(`result:${testId}`, result);
    
    // Update user progress
    const userResults = await kv.getByPrefix(`result:user:${testData.userId}`) || [];
    userResults.push(result);
    await kv.set(`result:user:${testData.userId}`, userResults);
    
    return c.json({ 
      success: true, 
      result 
    });
  } catch (error) {
    console.log('Test submission error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to submit test' 
    }, 500);
  }
});

// Send email with results
app.post('/make-server-8af19903/send-email', async (c) => {
  try {
    const { userId, email } = await c.req.json();
    console.log('Sending email to:', email);
    
    // Get user results
    const userResults = await kv.get(`result:user:${userId}`) || [];
    const userData = await kv.get(`user:${userId}`);
    
    // In a real implementation, you would send email here
    // For demo purposes, we'll just simulate it
    console.log('Email sent with results:', { userResults, userData });
    
    // Store email log
    await kv.set(`email:${userId}:${Date.now()}`, {
      to: email,
      subject: 'AI Admission Assessment Results',
      sentAt: new Date().toISOString(),
      results: userResults
    });
    
    return c.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.log('Email sending error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to send email' 
    }, 500);
  }
});

// Get user progress
app.get('/make-server-8af19903/progress/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    console.log('Getting progress for user:', userId);
    
    const userResults = await kv.get(`result:user:${userId}`) || [];
    const userData = await kv.get(`user:${userId}`);
    
    return c.json({ 
      success: true, 
      userData,
      results: userResults 
    });
  } catch (error) {
    console.log('Progress retrieval error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to get progress' 
    }, 500);
  }
});

// Helper function to generate questions based on level
function generateQuestionsForLevel(level: number) {
  const questionPools = {
    1: [
      {
        id: 'l1_q1',
        question: 'What is the primary purpose of object-oriented programming?',
        type: 'mcq',
        options: [
          'To make programs run faster',
          'To organize code into reusable, modular components',
          'To reduce memory usage',
          'To write shorter programs'
        ],
        correctAnswer: 'To organize code into reusable, modular components',
        level: 1
      },
      {
        id: 'l1_q2',
        question: 'Explain the difference between a stack and a queue data structure.',
        type: 'short_answer',
        level: 1
      },
      {
        id: 'l1_q3',
        question: 'Which of the following is NOT a valid variable name in most programming languages?',
        type: 'mcq',
        options: ['myVariable', 'user_name', '2ndValue', '_private'],
        correctAnswer: '2ndValue',
        level: 1
      }
    ],
    2: [
      {
        id: 'l2_q1',
        question: 'What is the time complexity of binary search algorithm?',
        type: 'mcq',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 'O(log n)',
        level: 2
      },
      {
        id: 'l2_q2',
        question: 'Describe the concept of polymorphism in object-oriented programming with an example.',
        type: 'short_answer',
        level: 2
      },
      {
        id: 'l2_q3',
        question: 'Which design pattern is most suitable for creating a single instance of a class?',
        type: 'mcq',
        options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
        correctAnswer: 'Singleton Pattern',
        level: 2
      }
    ],
    3: [
      {
        id: 'l3_q1',
        question: 'Analyze the trade-offs between microservices and monolithic architecture.',
        type: 'essay',
        level: 3
      },
      {
        id: 'l3_q2',
        question: 'What is the primary advantage of using consistent hashing in distributed systems?',
        type: 'mcq',
        options: [
          'Faster data retrieval',
          'Better load balancing during node additions/removals',
          'Reduced memory usage',
          'Improved security'
        ],
        correctAnswer: 'Better load balancing during node additions/removals',
        level: 3
      },
      {
        id: 'l3_q3',
        question: 'Design a system to handle 1 million concurrent users. Discuss your architecture choices.',
        type: 'essay',
        level: 3
      }
    ]
  };
  
  return questionPools[level as keyof typeof questionPools] || [];
}

// Helper function to calculate test score
function calculateTestScore(questions: any[], answers: Record<string, string>) {
  let correctAnswers = 0;
  
  questions.forEach(question => {
    const userAnswer = answers[question.id];
    if (question.type === 'mcq' && userAnswer === question.correctAnswer) {
      correctAnswers++;
    } else if (question.type === 'short_answer' || question.type === 'essay') {
      // For demo purposes, assume 70% of non-MCQ answers are correct if they have content
      if (userAnswer && userAnswer.trim().length > 10) {
        correctAnswers += 0.7;
      }
    }
  });
  
  return Math.round((correctAnswers / questions.length) * 100);
}

// Health check
app.get('/make-server-8af19903/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);