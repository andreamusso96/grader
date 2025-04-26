'use client';

import { useState, useEffect } from 'react';
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
    length: 4,          // initial option count OR lines
    options: ['', '', '', ''], // 4 blank options
  } as any);

  /* keep options array in-sync with length when qType is mcq */
  useEffect(() => {
    if (data.qType !== 'mcq') return;
    setData((d) => {
      const diff = d.length - d.options.length;
      if (diff > 0) return { ...d, options: [...d.options, ...Array(diff).fill('')] };
      if (diff < 0) return { ...d, options: d.options.slice(0, d.length) };
      return d;
    });
  }, [data.length, data.qType]);

  const submit = () => {
    if (!data.text.trim()) return;

    const payload =
      data.qType === 'mcq'
        ? { ...data, length: data.options.length } // overwrite length
        : { ...data, options: undefined };        // remove unused field

    addQuestion(examId, payload as any);
    onClose();
  };

  return (
    <div className="mt-4 space-y-3 rounded border p-4">
      {/* question text */}
      <input
        className="w-full border p-2"
        placeholder="Question text"
        value={data.text}
        onChange={(e) => setData({ ...data, text: e.target.value })}
      />

      {/* type selector */}
      <select
        className="border p-2"
        value={data.qType}
        onChange={(e) =>
          setData({
            ...data,
            qType: e.target.value as 'mcq' | 'open',
            // reset when switching types
            options: e.target.value === 'mcq' ? Array(data.length).fill('') : [],
          })
        }
      >
        <option value="mcq">Multiple choice</option>
        <option value="open">Open</option>
      </select>

      {/* length input */}
      <input
        type="number"
        min={1}
        className="border p-2"
        value={data.length}
        onChange={(e) =>
          setData({ ...data, length: Number(e.target.value) })
        }
      />

      {/* option inputs – only for MCQ */}
      {data.qType === 'mcq' && (
        <div className="space-y-2">
          {data.options.map((opt, i) => (
            <input
              key={i}
              className="w-full border p-2"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const opts = [...data.options];
                opts[i] = e.target.value;
                setData({ ...data, options: opts });
              }}
            />
          ))}
          <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() =>
              setData({ ...data, options: [...data.options, ''], length: data.length + 1 })
            }
          >
            + Add option
          </button>
        </div>
      )}

      {/* actions */}
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
