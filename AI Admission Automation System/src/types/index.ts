export interface StudentData {
  student_id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  dob: string;
  email: string;
  phone: string;
}

export interface Question {
  question: string;
  answer: string;
}

export interface EvaluationScores {
  Relevance: number;
  Clarity: number;
  SubjectUnderstanding: number;
  Accuracy: number;
  Completeness: number;
  CriticalThinking: number;
}

export interface EvaluationResult {
  scores: EvaluationScores;
  avg: number;
}

export interface TestResult {
  level: 'easy' | 'medium' | 'hard';
  score: number;
  result: 'pass' | 'fail';
  questions: Question[];
  studentAnswers: string[];
}

export interface AttemptCounts {
  easy: number;
  medium: number;
  hard: number;
}
