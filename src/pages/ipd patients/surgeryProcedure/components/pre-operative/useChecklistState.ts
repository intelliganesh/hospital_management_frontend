import { useState } from 'react';

export interface Question {
  id: string;
  number: string;
  text: string;
  type?: "datetime";
  answer: 'Yes' | 'No' | null;
  details?: string;
  subQuestions?: Question[];
  highlighted?: boolean;
}

export const useChecklistState = (initialData: Question[]) => {
  const [questions, setQuestions] = useState<Question[]>(initialData);

  const updateQuestion = (id: string, update: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) return { ...q, ...update };
        if (q.subQuestions) {
          return {
            ...q,
            subQuestions: q.subQuestions.map((sub) =>
              sub.id === id ? { ...sub, ...update } : sub
            ),
          };
        }
        return q;
      })
    );
  };

  const handleAnswerChange = (id: string, value: 'Yes' | 'No') => {
    updateQuestion(id, {
      answer: value,
      details: value === 'No' ? '' : undefined,
    });
  };

  const handleDetailsChange = (id: string, details: string) => {
    updateQuestion(id, { details });
  };

  const toggleHighlight = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        // If this is the question being toggled
        if (q.id === id) {
          return { ...q, highlighted: !q.highlighted };
        }
        // If this question has subQuestions, check if one of them is being toggled
        if (q.subQuestions) {
          const subIndex = q.subQuestions.findIndex((sub) => sub.id === id);
          if (subIndex !== -1) {
            // Only toggle the specific sub-question
            return {
              ...q,
              subQuestions: q.subQuestions.map((sub) =>
                sub.id === id ? { ...sub, highlighted: !sub.highlighted } : sub
              ),
            };
          }
        }
        return q;
      })
    );
  };

  return { questions, setQuestions, handleAnswerChange, handleDetailsChange, toggleHighlight };
};
