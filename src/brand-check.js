export const questions = [
  {
    title: "WHEN SOMEONE FINDS YOU ONLINE…",
    options: [
      "They wonder what I actually do.",
      "They get the gist. Eventually.",
      "They know exactly why they need me.",
    ],
  },
  {
    title: "YOUR CONTENT SCHEDULE IS…",
    options: [
      "A post every time Mercury feels right.",
      "Consistent-ish. Life happens.",
      "A clear plan, with a clear point.",
    ],
  },
  {
    title: "ALL THAT ATTENTION LEADS TO…",
    options: [
      "Mostly my mom hitting like.",
      "Some interest. Few real inquiries.",
      "Conversations with the right people.",
    ],
  },
];

export const verdicts = {
  invisible: {
    title: "THE INVISIBLE EXPERT.",
    description:
      "You've got the goods. The internet just hasn't been informed. Your next move isn't shouting louder — it's making what you do impossible to misunderstand.",
    service: "Brand strategy",
    recommendation:
      "Start with a clear position, a sharper profile, and one reason to remember you.",
  },
  mixed: {
    title: "THE MIXED SIGNAL.",
    description:
      "There's something here. But your brand is giving three different elevator pitches in three different elevators. Let's get the story straight and the content working together.",
    service: "Social media",
    recommendation:
      "Connect your message to a focused content plan you can actually keep up with.",
  },
  almost: {
    title: "THE ALMOST-FAMOUS.",
    description:
      "You're showing up with purpose. Now give that attention a direction. More of the right conversations. Fewer people admiring your content and quietly disappearing.",
    service: "Lead generation",
    recommendation:
      "Sharpen the path from first impression to a real business inquiry.",
  },
};

export function evaluateQuiz(answers) {
  if (
    answers.length !== 3 ||
    answers.some((value) => !Number.isInteger(value) || value < 0 || value > 2)
  ) {
    throw new Error("Complete all three questions with a valid answer.");
  }
  const score = answers.reduce((total, value) => total + value, 0);
  return score <= 1 ? "invisible" : score <= 4 ? "mixed" : "almost";
}
