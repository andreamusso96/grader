'use client';

import { useExamStore } from '@/store/useExamStore';
import { MCQ, Open, Question } from '@/types'; // Assuming your types are in this file

export default function QuestionList({
  examId,
  questions,
}: {
  examId: string;
  questions: Question[];
}) {
  const remove = useExamStore((s) => s.removeQuestion);

  if (!questions.length) return <p>No questions yet.</p>;

  return (
    <ul className="space-y-4">
      {questions.map((q, i) => (
        <li key={q.id} className="rounded border p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold">
              {i + 1}. {q.text}
            </span>
            <button onClick={() => remove(examId, q.id)} className="text-red-600 hover:text-red-800 focus:outline-none">
              ✕
            </button>
          </div>
          <div>
            {q.qType === 'mcq' && (
              <ul className="list-disc pl-5">
                {(q as MCQ).options.map((option: string, index: number) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            )}
            {q.qType === 'open' && (
              <p className="text-gray-700">
                (Open-ended question - requires a text answer)
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}