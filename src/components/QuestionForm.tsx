'use client';

import { useState } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { Question } from '@/types';

export default function QuestionForm({
  examId,
  onClose,
}: {
  examId: string;
  onClose: () => void;
}) {
  const addQuestion = useExamStore((s) => s.addQuestion);

  const [data, setData] = useState<Omit<Question, 'id'>>({
    text: '',
    qType: 'mcq',
    length: 4,
    options: [],
  } as any);

  const submit = () => {
    if (!data.text.trim()) return;
    addQuestion(examId, data);
    onClose();
  };

  return (
    <div className="mt-4 space-y-3 rounded border p-4">
      <input
        className="w-full border p-2"
        placeholder="Question text"
        value={data.text}
        onChange={(e) => setData({ ...data, text: e.target.value })}
      />

      <select
        className="border p-2"
        value={data.qType}
        onChange={(e) =>
          setData({ ...data, qType: e.target.value as 'mcq' | 'open' })
        }
      >
        <option value="mcq">Multiple choice</option>
        <option value="open">Open</option>
      </select>

      <input
        type="number"
        min={1}
        className="border p-2"
        value={data.length}
        onChange={(e) =>
          setData({ ...data, length: Number(e.target.value) })
        }
      />

      <div className="flex gap-2">
        <button onClick={submit} className="rounded bg-black px-3 py-2 text-white">
          Add
        </button>
        <button onClick={onClose} className="rounded border px-3 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}
