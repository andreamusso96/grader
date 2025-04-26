'use client';

import { useExamStore } from '@/store/useExamStore';

export default function QuestionList({
  examId,
  questions,
}: {
  examId: string;
  questions: any[];
}) {
  const remove = useExamStore((s) => s.removeQuestion);

  if (!questions.length) return <p>No questions yet.</p>;

  return (
    <ul className="space-y-4">
      {questions.map((q, i) => (
        <li key={q.id} className="flex justify-between rounded border p-3">
          <span>
            {i + 1}. {q.text} ({q.qType})
          </span>
          <button onClick={() => remove(examId, q.id)} className="text-red-600">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
