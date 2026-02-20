const importanceWeight = { A: 1.0, B: 0.7, C: 0.5 };
const difficultyWeight = { E: 0.6, M: 1.0, H: 1.4 };
const typeWeight = { Practical: 1.1, Theory: 1.0 };

function computeSQI(data) {
  const attempts = data.attempts;

  let totalScore = 0;
  let totalMax = 0;

  const topicMap = {};
  const conceptMap = {};

  attempts.forEach((q) => {
    const base = q.correct ? q.marks : -q.negMarks;

    const weight =
      importanceWeight[q.importance] *
      difficultyWeight[q.difficulty] *
      typeWeight[q.type];

    let weightedScore = base * weight;
    let weightedMax = q.marks * weight;

    let reasons = [];

    if (!q.correct) reasons.push("Answered incorrectly");

    if (q.timeSpentSec > q.expectedTimeSec * 1.5) {
      weightedScore *= 0.9;
      reasons.push("Very slow attempt");
    }

    if (q.timeSpentSec < q.expectedTimeSec * 0.5) {
      weightedScore *= 0.8;
      reasons.push("Too fast guessing pattern");
    }

    if (q.markedForReview && !q.correct) {
      weightedScore *= 0.9;
      reasons.push("Marked for review but still incorrect");
    }

    totalScore += weightedScore;
    totalMax += weightedMax;

    if (!topicMap[q.topic]) topicMap[q.topic] = { score: 0, max: 0 };
    topicMap[q.topic].score += weightedScore;
    topicMap[q.topic].max += weightedMax;

    if (!conceptMap[q.concept])
      conceptMap[q.concept] = {
        topic: q.topic,
        score: 0,
        max: 0,
        wrong: false,
        importance: q.importance,
        reasons: []
      };

    conceptMap[q.concept].score += weightedScore;
    conceptMap[q.concept].max += weightedMax;

    if (!q.correct) conceptMap[q.concept].wrong = true;

    conceptMap[q.concept].reasons.push(...reasons);
  });

  const overallSQI = Math.max(
    0,
    Math.min(100, (totalScore / totalMax) * 100)
  );

  const rankedConcepts = Object.keys(conceptMap)
    .map((c) => {
      const concept = conceptMap[c];

      let weight = 0;

      if (concept.wrong) weight += 0.4;
      weight += 0.25 * importanceWeight[concept.importance];
      weight += 0.2 * (1 - concept.score / concept.max);
      weight += 0.15 * (1 - overallSQI / 100);

      return {
        topic: concept.topic,
        concept: c,
        weight: Number(weight.toFixed(3)),
        reasons: concept.reasons.length
          ? concept.reasons
          : ["Strong performance"]
      };
    })
    .sort((a, b) => b.weight - a.weight);

  return {
    studentId: data.studentId,
    overallSQI: Number(overallSQI.toFixed(2)),
    rankedConcepts,
    metadata: {
      engineVersion: "0.2",
      diagnosticPromptVersion: "v1"
    }
  };
}

module.exports = { computeSQI };