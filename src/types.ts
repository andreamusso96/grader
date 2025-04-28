export type QuestionBase = {
    id: string;
    text: string;
    length: number;          // options count OR lines
  };
  
export type MCQ  = QuestionBase & { qType: "mcq";  options: string[] };
export type Open = QuestionBase & { qType: "open" };

export type Question = MCQ | Open;

export type Exam = {
  id: string;
  title: string;
  questions: Question[];
};
  