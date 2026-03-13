function shuffle(values) {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildDistractors(topic, item) {
  return [
    `${topic} point ${item + 1}`,
    `${topic} rule ${item}`,
    `${topic} form ${item}`,
    `${topic} usage ${item}`,
    `${topic} tense ${item}`,
  ];
}

export function generateTopicTests({ topic, level, count }) {
  const safeCount = Math.max(3, Math.min(20, Number(count) || 5));
  const questions = [];
  const cleanTopic = String(topic || "").trim() || "General English";
  const cleanLevel = String(level || "A1").trim();
  const now = Date.now();

  for (let i = 1; i <= safeCount; i += 1) {
    const answer = `${cleanTopic} point ${i}`;
    const distractors = shuffle(buildDistractors(cleanTopic, i)).slice(0, 3);
    const options = shuffle([answer, ...distractors]);
    const correctIndex = options.indexOf(answer);

    questions.push({
      id: `q-${now}-${i}-${Math.random().toString(16).slice(2, 7)}`,
      prompt: `(${cleanLevel}) ${cleanTopic}: choose the best answer for item ${i}.`,
      options,
      correctIndex,
    });
  }

  return questions;
}
