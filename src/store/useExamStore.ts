import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exam, Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ExamState {
  exams: Record<string, Exam>;
  addExam: (title: string) => string;
  addQuestion: (examId: string, question: Omit<Question, 'id'>) => void;
  removeQuestion: (examId: string, questionId: string) => void;
  updateQuestion: (examId: string, questionId: string, updatedQuestion: Omit<Question, 'id'> & { options?: string[] }) => void; // Add this
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      exams: {},
      addExam: (title) => {
        const id = uuidv4();
        set((state) => ({
          exams: { ...state.exams, [id]: { id, title, questions: [] } },
        }));
        return id;
      },
      addQuestion: (examId, question) => {
        const newQuestion: Question = { id: uuidv4(), ...question };
        set((state) => ({
          exams: {
            ...state.exams,
            [examId]: {
              ...state.exams[examId],
              questions: [...state.exams[examId].questions, newQuestion],
            },
          },
        }));
      },
      removeQuestion: (examId, questionId) => {
        set((state) => ({
          exams: {
            ...state.exams,
            [examId]: {
              ...state.exams[examId],
              questions: state.exams[examId].questions.filter((q) => q.id !== questionId),
            },
          },
        }));
      },
      updateQuestion: (examId, questionId, updatedQuestion) => {
        set((state) => {
          const exam = state.exams[examId];
          if (exam) {
            const updatedQuestions = exam.questions.map((q) =>
              q.id === questionId ? { id: questionId, ...updatedQuestion } : q
            );
            return {
              exams: {
                ...state.exams,
                [examId]: { ...exam, questions: updatedQuestions },
              },
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'exam-storage',
    }
  )
);