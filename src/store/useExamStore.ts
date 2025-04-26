// src/store/useExamStore.ts
import { create } from "zustand";
import { nanoid } from "nanoid";
import { Exam, Question } from "@/types";        // or "../types"

interface Store {
  exams: Record<string, Exam>;
  createExam: (title: string) => string;
  addQuestion: (examId: string, q: Omit<Question, "id">) => void;
  removeQuestion: (examId: string, qId: string) => void;
}

export const useExamStore = create<Store>()((set) => ({
  exams: {},

  createExam: (title) => {
    const id = nanoid();
    set((st) => ({
      exams: { ...st.exams, [id]: { id, title, questions: [] } },
    }));
    return id;
  },

  addQuestion: (examId, q) =>
    set((st) => {
      const exam = st.exams[examId];
      if (!exam) return st;                              // guard
      const newQ: Question = { ...q, id: nanoid() };     // typed
      return {
        exams: {
          ...st.exams,
          [examId]: { ...exam, questions: [...exam.questions, newQ] },
        },
      };
    }),

  removeQuestion: (examId, qId) =>
    set((st) => {
      const exam = st.exams[examId];
      if (!exam) return st;
      return {
        exams: {
          ...st.exams,
          [examId]: {
            ...exam,
            questions: exam.questions.filter((q) => q.id !== qId),
          },
        },
      };
    }),
}));
