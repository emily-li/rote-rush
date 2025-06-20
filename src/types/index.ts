export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GameResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

export interface PracticeCharacter {
  char: string;
  validAnswers: string[];
  weight?: number; // Add weight property for adaptive selection
}
