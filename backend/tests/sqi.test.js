const { computeSQI } = require("../services/sqi.service");

describe("SQI Engine Tests", () => {
  test("Correct answer increases score", () => {
    const input = {
      studentId: "1",
      attempts: [
        {
          topic: "Borrowing Costs",
          concept: "Definitions",
          importance: "A",
          difficulty: "M",
          type: "Theory",
          correct: true,
          marks: 2,
          negMarks: 0.5,
          expectedTimeSec: 60,
          timeSpentSec: 60,
          markedForReview: false
        }
      ]
    };

    const result = computeSQI(input);
    expect(result.overallSQI).toBeGreaterThan(0);
  });

  test("Wrong answer reduces score", () => {
    const input = {
      studentId: "1",
      attempts: [
        {
          topic: "Borrowing Costs",
          concept: "Definitions",
          importance: "A",
          difficulty: "M",
          type: "Theory",
          correct: false,
          marks: 2,
          negMarks: 0.5,
          expectedTimeSec: 60,
          timeSpentSec: 60,
          markedForReview: false
        }
      ]
    };

    const result = computeSQI(input);
    expect(result.overallSQI).toBeLessThan(100);
  });
});