// src/app/builder/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';
import QuestionList from '@/components/QuestionList';
import QuestionForm from '@/components/QuestionForm';

export default function BuilderPage() {
  // read the dynamic segment safely on the client
  const { id } = useParams<{ id: string }>();

  const exam = useExamStore((s) => s.exams[id]);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  if (!exam) return <p className="p-4">Exam not found.</p>;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{exam.title}</h2>
        <button
          onClick={() => router.push(`/preview/${id}`)}
          className="rounded border px-3 py-1"
        >
          Preview / PDF
        </button>
      </header>

      <QuestionList examId={id} questions={exam.questions} />

      {showForm ? (
        <QuestionForm examId={id} onClose={() => setShowForm(false)} />
      ) : (
        <button
          className="mt-6 rounded bg-black px-4 py-2 text-white"
          onClick={() => setShowForm(true)}
        >
          + Add Question
        </button>
      )}
    </div>
  );
}
