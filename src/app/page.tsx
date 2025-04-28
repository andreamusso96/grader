// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';

export default function Home() {
  const [title, setTitle] = useState('');
  const createExam = useExamStore((s) => s.addExam);
  const router = useRouter();

  const handleCreate = () => {
    if (!title.trim()) return;
    const id = createExam(title.trim());
    router.push(`/builder/${id}`);
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Create an Exam</h1>
      <input
        className="border p-2 w-64"
        placeholder="Exam title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={handleCreate}
      >
        Build
      </button>
    </main>
  );
}
