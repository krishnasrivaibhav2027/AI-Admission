import { StudentData, TestResult, AttemptCounts } from '../types';

const STORAGE_KEYS = {
  STUDENT_DATA: 'admission_student_data',
  TEST_RESULTS: 'admission_test_results',
  ATTEMPTS: 'admission_attempts',
  CURRENT_LEVEL: 'admission_current_level'
};

export function saveStudentData(data: StudentData): void {
  localStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(data));
}

export function getStudentData(): StudentData | null {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENT_DATA);
  return data ? JSON.parse(data) : null;
}

export function saveTestResult(result: TestResult): void {
  const results = getTestResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
}

export function getTestResults(): TestResult[] {
  const data = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
  return data ? JSON.parse(data) : [];
}

export function saveAttempts(attempts: AttemptCounts): void {
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
}

export function getAttempts(): AttemptCounts {
  const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
  return data ? JSON.parse(data) : { easy: 0, medium: 0, hard: 0 };
}

export function saveCurrentLevel(level: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, level);
}

export function getCurrentLevel(): string {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) || 'easy';
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
