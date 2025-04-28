'use client';

import { useExamStore } from '@/store/useExamStore';
import { MCQ, Open, Question } from '@/types'; // Assuming your types are in this file
import { useState } from 'react';
import QuestionForm from './QuestionForm'; // Import the QuestionForm component

export default function QuestionList({
  examId,
  questions,
}: {
  examId: string;
  questions: Question[];
}) {
  const remove = useExamStore((s) => s.removeQuestion);
  const update = useExamStore((s) => s.updateQuestion);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  if (!questions.length) return <p>No questions yet.</p>;

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleCloseEditForm = () => {
    setEditingQuestion(null);
  };

  return (
    <>
      <ul className="space-y-4">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded border p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold flex-grow">
                {i + 1}. {q.text}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(q)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  aria-label="Edit question"
                >
                  ✏️
                </button>
                <button
                  onClick={() => remove(examId, q.id)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                  aria-label="Remove question"
                >
                  ✕
                </button>
              </div>
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

      {editingQuestion && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center dark:bg-gray-800 dark:bg-opacity-75">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md dark:bg-gray-900 dark:text-white">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-300">Edit Question</h2>
          <QuestionForm
            examId={examId}
            onClose={handleCloseEditForm}
            initialQuestion={editingQuestion}
            isEditing={true}
          />
        </div>
      </div>
    )}
    </>
  );
}