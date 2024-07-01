export default function calculateLevel({ questions }: { questions: number[] }) {
  const total = questions.reduce((acc, curr) => acc + curr, 0);
  if (total <= 1) {
    return 1;
  }
  if (total <= 3) {
    return 2;
  }
  return 3;
}