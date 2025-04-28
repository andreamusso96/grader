'use client';

import { useState, useEffect } from 'react';
import { useExamStore } from '@/store/useExamStore';
import { MCQ, Question } from '@/types';

type QuestionFormState = Omit<Question, 'id'> & {
  options?: string[];
};

export default function QuestionForm({
  examId,
  onClose,
  initialQuestion,
  isEditing = false,
}: {
  examId: string;
  onClose: () => void;
  initialQuestion?: Question;
  isEditing?: boolean;
}) {
  const addQuestion = useExamStore((s) => s.addQuestion);
  const updateQuestion = useExamStore((s) => s.updateQuestion);

  const [data, setData] = useState<QuestionFormState>(
    initialQuestion
      ? { ...initialQuestion, options: (initialQuestion as MCQ).options }
      : {
          text: '',
          qType: 'mcq',
          length: 4, // initial option count OR lines
          options: ['', '', '', ''], // 4 blank options
        }
  );

  /* keep options array in-sync with length when qType is mcq */
  useEffect(() => {
    if (data.qType !== 'mcq') return;

    setData((d) => {
      const diff = d.length - (d.options?.length || 0);
      if (diff > 0) {
        return { ...d, options: [...(d.options || []), ...Array(diff).fill('')] };
      }
      if (diff < 0 && d.options) {
        return { ...d, options: d.options.slice(0, d.length) };
      }
      return d;
    });
  }, [data.length, data.qType]);

  useEffect(() => {
    if (initialQuestion) {
      setData({
        text: initialQuestion.text,
        qType: initialQuestion.qType,
        length: initialQuestion.length,
        options: (initialQuestion as MCQ).options,
      });
    } else {
      setData({
        text: '',
        qType: 'mcq',
        length: 4,
        options: ['', '', '', ''],
      });
    }
  }, [initialQuestion]);

  const submit = () => {
    if (!data.text.trim()) return;

    let payload: Omit<Question, 'id'> & { options?: string[] };

    if (data.qType === 'mcq') {
      const { options, ...rest } = data;
      payload = { ...rest, length: options?.length || 0, options };
    } else {
      const { options, ...rest } = data;
      payload = rest;
    }

    if (isEditing && initialQuestion?.id) {
      updateQuestion(examId, initialQuestion.id, payload as Question);
    } else {
      addQuestion(examId, payload as Question);
    }
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
            options: e.target.value === 'mcq' ? Array(data.length).fill('') : undefined,
            length: e.target.value === 'mcq' ? data.length : 1, // Reset length for open questions
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
        disabled={data.qType === 'open'}
      />

      {/* option inputs – only for MCQ */}
      {data.qType === 'mcq' && (
        <div className="space-y-2">
          {data.options?.map((opt, i) => (
            <input
              key={i}
              className="w-full border p-2"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const opts = [...(data.options || [])];
                opts[i] = e.target.value;
                setData({ ...data, options: opts });
              }}
            />
          ))}
          <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() =>
              setData({ ...data, options: [...(data.options || []), ''], length: data.length + 1 })
            }
          >
            + Add option
          </button>
        </div>
      )}

      {/* actions */}
      <div className="flex gap-2">
        <button onClick={submit} className="rounded bg-black px-3 py-2 text-white">
          {isEditing ? 'Save' : 'Add'}
        </button>
        <button onClick={onClose} className="rounded border px-3 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}