import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Highest Streak Functionality', () => {
  it('should track the highest streak correctly', () => {
    // Test the highest streak logic
    let streak = 0;
    let highestStreak = 0;
    
    // Function to simulate a correct answer
    function correctAnswer() {
      streak += 1;
      if (streak > highestStreak) {
        highestStreak = streak;
      }
    }
    
    // Function to simulate a wrong answer  
    function wrongAnswer() {
      streak = 0;
    }
    
    // Test scenario: build up streak, fail, then build a higher streak
    correctAnswer(); // streak=1, highest=1
    expect(streak).toBe(1);
    expect(highestStreak).toBe(1);
    
    correctAnswer(); // streak=2, highest=2
    expect(streak).toBe(2);
    expect(highestStreak).toBe(2);
    
    correctAnswer(); // streak=3, highest=3
    expect(streak).toBe(3);
    expect(highestStreak).toBe(3);
    
    wrongAnswer(); // streak=0, highest=3 (should remain)
    expect(streak).toBe(0);
    expect(highestStreak).toBe(3); // Should not change
    
    correctAnswer(); // streak=1, highest=3 (should remain)
    expect(streak).toBe(1);
    expect(highestStreak).toBe(3); // Should not change
    
    correctAnswer(); // streak=2, highest=3 (should remain)
    expect(streak).toBe(2);
    expect(highestStreak).toBe(3); // Should not change
    
    correctAnswer(); // streak=3, highest=3 (should remain)
    expect(streak).toBe(3);
    expect(highestStreak).toBe(3); // Should not change
    
    correctAnswer(); // streak=4, highest=4 (should update)
    expect(streak).toBe(4);
    expect(highestStreak).toBe(4); // Should update to new high
  });
  
  it('should handle edge case where first answer is wrong', () => {
    let streak = 0;
    let highestStreak = 0;
    
    function wrongAnswer() {
      streak = 0;
    }
    
    function correctAnswer() {
      streak += 1;
      if (streak > highestStreak) {
        highestStreak = streak;
      }
    }
    
    // Start with wrong answer
    wrongAnswer();
    expect(streak).toBe(0);
    expect(highestStreak).toBe(0);
    
    // Then get one correct
    correctAnswer();
    expect(streak).toBe(1);
    expect(highestStreak).toBe(1);
  });
});