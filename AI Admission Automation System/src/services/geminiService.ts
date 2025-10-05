import { Question, EvaluationResult } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateQuestions(level: string, numQuestions: number = 3): Promise<Question[]> {
  const prompt = `Generate ${numQuestions} questions at ${level} difficulty level in Physics (Thermodynamics, 2D motion, 3D motion).
  Return ONLY a JSON array of objects with this exact format: [{"question":"...", "answer":"..."}].
  No additional text or explanation, just the JSON array.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response');
    }

    const questions: Question[] = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    return getFallbackQuestions(level, numQuestions);
  }
}

export async function evaluateAnswer(
  question: string,
  correctAnswer: string,
  studentAnswer: string
): Promise<EvaluationResult> {
  const prompt = `Evaluate this student answer:
  Question: ${question}
  Correct Answer: ${correctAnswer}
  Student Answer: ${studentAnswer}

  Return ONLY a JSON object with scores 1-10 for these criteria:
  {"Relevance": X, "Clarity": X, "SubjectUnderstanding": X, "Accuracy": X, "Completeness": X, "CriticalThinking": X}

  No additional text, just the JSON object.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response');
    }

    const scores = JSON.parse(jsonMatch[0]);
    const values = Object.values(scores) as number[];
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    return { scores, avg };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return getFallbackEvaluation(studentAnswer);
  }
}

function getFallbackQuestions(level: string, count: number): Question[] {
  const fallbackQuestions: Record<string, Question[]> = {
    easy: [
      {
        question: "What is Newton's First Law of Motion?",
        answer: "An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an external force."
      },
      {
        question: "Define temperature in terms of thermodynamics.",
        answer: "Temperature is a measure of the average kinetic energy of particles in a substance."
      },
      {
        question: "What is the difference between distance and displacement?",
        answer: "Distance is the total path length traveled, while displacement is the straight-line distance from start to end point with direction."
      },
      {
        question: "State the law of conservation of energy.",
        answer: "Energy cannot be created or destroyed, only converted from one form to another."
      },
      {
        question: "What is acceleration?",
        answer: "Acceleration is the rate of change of velocity with respect to time."
      }
    ],
    medium: [
      {
        question: "Derive the equation for projectile motion range on level ground.",
        answer: "Range R = (v₀²sin(2θ))/g, where v₀ is initial velocity, θ is launch angle, and g is gravitational acceleration."
      },
      {
        question: "Explain the first law of thermodynamics and provide an example.",
        answer: "The first law states that ΔU = Q - W, where change in internal energy equals heat added minus work done. Example: A gas expanding in a piston absorbs heat and does work."
      },
      {
        question: "How does circular motion relate to projectile motion?",
        answer: "Circular motion involves centripetal acceleration, while projectile motion combines constant horizontal velocity with vertical acceleration due to gravity. Both involve 2D motion vectors."
      }
    ],
    hard: [
      {
        question: "Analyze the motion of a particle in 3D space under the influence of a central force. Derive the equations of motion.",
        answer: "For central force F = -kr: r̈ = -kr/m. In spherical coordinates: d²r/dt² - r(dθ/dt)² = -k/m, and conservation of angular momentum gives r²(dθ/dt) = constant."
      },
      {
        question: "Discuss the thermodynamic efficiency of a Carnot engine and explain why no real engine can achieve this efficiency.",
        answer: "Carnot efficiency η = 1 - Tc/Th. Real engines can't achieve this due to irreversible processes like friction, heat loss, and non-quasi-static processes that increase entropy."
      }
    ]
  };

  const questions = fallbackQuestions[level] || fallbackQuestions.easy;
  return questions.slice(0, count);
}

function getFallbackEvaluation(studentAnswer: string): EvaluationResult {
  const length = studentAnswer.trim().length;
  const baseScore = length > 50 ? 7 : length > 20 ? 5 : 3;

  return {
    scores: {
      Relevance: baseScore,
      Clarity: baseScore,
      SubjectUnderstanding: baseScore,
      Accuracy: baseScore,
      Completeness: baseScore,
      CriticalThinking: baseScore
    },
    avg: baseScore
  };
}
