import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import View from '@/components/view';

// TypeScript Interfaces
interface Question {
  id: string;
  number: string;
  text: string;
  subQuestions?: Question[];
  answer?: 'yes' | 'no' | null;
  details?: string;
  highlighted?: boolean;
}

// Initial Questions Data
const initialQuestions: Question[] = [
  { id: '01', answer:"no", number: '01', text: 'ALL INVESTIGATIONS DONE? ARE THE REPORTS IN NORMAL RANGE' },
  { id: '02', answer:"no", number: '02', text: 'CHEST XRAY / ECG DONE' },
  { id: '03', answer:"no", number: '03', text: 'IS PATIENT UNDER MINIMUM AGE GROUP? PARENTS ARE PRESENT?' },
  {
    id: '04',
    answer:"no", number: '04',
    text: 'IS PATIENT ON BLOOD THINNERS?',
    subQuestions: [
      { id: '04a', answer:"no", number: '04 a)', text: 'IF YES - NAME OF MEDICINE AND STOPPED SINCE ?' },
      { id: '04b', answer:"no", number: '04 b)', text: 'IF YES WHAT IS THE TREATMENT AT PRESENT?' }
    ]
  },
  {
    id: '05',
    answer:"no", number: '05',
    text: 'IS PATIENT SUFFERING FROM BRONCHIAL ASTHMA?',
    subQuestions: [
      { id: '05a', answer:"no", number: '05 a)', text: 'IF YES WHAT IS THE TREATMENT AT PRESENT?' },
      { id: '05b', answer:"no", number: '05 b)', text: 'IF YES WHAT IS THE TREATMENT AT PRESENT?' }
    ]
  },
  { id: '06', answer:"no", number: '06', text: 'IS PATIENT ALLERGIC TO ANY MEDICATION?' },
  { id: '07', answer:"no", number: '07', text: 'HAS PATIENT UNDERGONE TOOTH EXTRACTION UNDER LOCAL ANESTHESIA?' },
  { id: '08', answer:"no", number: '08', text: 'ANY SURGICAL PROCEDURE UNDER LOCAL ANESTHESIA?' },
  {
    id: '09',
    answer:"no", number: '09',
    text: 'IS PATIENT DIABETIC ?',
    subQuestions: [
      { id: '09a', answer:"no", number: '09 a)', text: 'IF YES , NAME OF THE MEDICINE?' },
      { id: '09b', answer:"no", number: '09 b)', text: 'IF YES , BLOOD SUGAR READING TODAY' }
    ]
  },
  { id: '10', answer:"no", number: '10', text: 'IS PATIENT UNDER THYROID MEDICATION?' },
  {
    id: '11',
    answer:"no", number: '11',
    text: 'IS PATIENT A KNOWN CASE OF HYPERTENSION ?',
    subQuestions: [
      { id: '11a', answer:"no", number: '11 a)', text: 'IF YES, NAME OF THE MEDICINE AND THE PRESENT BP READING?' },
      { id: '11b', answer:"no", number: '11 b)', text: 'IF YES, NAME OF THE MEDICINE AND THE PRESENT BP READING?' },
      { id: '11c', answer:"no", number: '11 c)', text: 'IF YES, HAS PATIENT TAKEN THE MEDICATION FOR HYPERTENSION?' }
    ]
  },
  { id: '12', answer:"no", number: '12', text: 'ALL INFORMED CONSENTS SIGNED BY PATIENT / PATIENT ATTENDER ?' },
  { id: '13', answer:"no", number: '13', text: 'IS PATIENT AWARE OF THE TYPE OF ANESTHESIA TO BE ADMINISTERED?' },
  { id: '14', answer:"no", number: '14', text: 'IS THE PATIENT AWARE OF THE OPERATIVE PROCEDURE TO BE PERFORMED?' },
  {
    id: '15',
    answer:"no", number: '15',
    text: 'IN CASE OF MALE PATIENT - IS PATIENT ABOVE 50 YEARS',
    subQuestions: [
      { id: '15a', answer:"no", number: '15 a)', text: 'IF YES, ANY URINARY SYMPTOMS / DIAGNOSED BPH - IF YES MARK RED' },
      { id: '15b', answer:"no", number: '15 b)', text: 'IF YES, ANY URINARY SYMPTOMS / DIAGNOSED BPH - IF YES MARK RED' }
    ]
  },
  { id: '16', answer:"no", number: '16', text: 'ANY HISTORY OF URINARY OBSTRUCTION / HISTORY OF CATHETER INSERTION ?' },
  { id: '17', answer:"no", number: '17', text: 'IS PATIENT ABLE TO LIE DOWN IN LITHOTOMY POSITION ?' },
  { id: '18', answer:"no", number: '18', text: 'ANY HISTORY OF KNEE /HIP/ SPINE SURGERY?' },
  { id: '19', answer:"no", number: '19', text: 'IS PATIENT BELONGING TO SETTY/ VYSYA/ CHETTIAAR COMMUNITY ?' },
  { id: '20', answer:"no", number: '20', text: 'ANY NOTABLE EVENTS IN PREVIOUS SURGERY ?' },
  { id: '21', answer:"no", number: '21', text: 'IN CASE OF FEMALE PATIENT - IS PATIENT PREGNANT ?' },
  { id: '22', answer:"no", number: '22', text: 'ANY HISTORY OF EPILEPSY - IF YES MENTION IF ON ANY MEDICATIONS?' },
  { id: '23', answer:"no", number: '23', text: 'IS PATIENT TAKING ANY ANTIPSYCHOTIC MEDICATIONS ?' },
  { id: '24', answer:"no", number: '24', text: 'WHEN WAS THE LAST INTAKE OF FOOD / LIQUIDS - MENTION DATE AND TIME' }
];

// QuestionCard Component
const QuestionCard: React.FC<{
  question: Question;
  isHighlighted: boolean;
  onAnswerChange: (answer: 'yes' | 'no') => void;
  onDetailsChange: (details: string) => void;
  onHighlightToggle: () => void;
  isSubQuestion?: boolean;
}> = ({ question, isHighlighted, onAnswerChange, onDetailsChange, onHighlightToggle, isSubQuestion = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;

  return (
    <div className={`transition-all duration-300 ${isSubQuestion ? 'ml-6 mt-2' : ''}`}>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          isHighlighted
            ? 'bg-red-500 text-white border-2 border-red-600'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg'
        }`}
      >
        {/* Card Header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${isHighlighted ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {question.number}.
                </span>
                <h3 className={`font-medium text-sm ${isHighlighted ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {question.text}
                </h3>
              </div>
            </div>

            {/* Collapse/Expand Button for Parent Questions */}
            {hasSubQuestions && !isSubQuestion && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-1 rounded-md transition-colors ${
                  isHighlighted
                    ? 'hover:bg-red-600 text-white'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Yes/No Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isHighlighted ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                Answer:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => onAnswerChange('yes')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    question.answer === 'yes'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => onAnswerChange('no')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    question.answer === 'no'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Description/Details Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={question.details || ''}
                onChange={(e) => onDetailsChange(e.target.value)}
                disabled={question.answer !== 'yes'}
                placeholder="Enter details..."
                className={`w-full px-3 py-2 rounded-md text-sm border transition-all ${
                  question.answer === 'yes'
                    ? isHighlighted
                      ? 'bg-white text-slate-800 border-white'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Highlight Toggle */}
            <button
              onClick={onHighlightToggle}
              className={`p-2 rounded-md transition-all ${
                isHighlighted
                  ? 'bg-white text-red-500 hover:bg-slate-100'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              title="Toggle Highlight"
            >
              <AlertCircle size={20} />
            </button>
          </div>
        </div>

        {/* Sub-questions (Collapsible) */}
        {hasSubQuestions && isExpanded && (
          <div className={`px-4 pb-4 space-y-2 ${isHighlighted ? 'bg-red-400/20' : 'bg-slate-50 dark:bg-slate-900/50'} rounded-b-lg`}>
            {question.subQuestions!.map((subQ) => (
              <QuestionCard
                key={subQ.id}
                question={subQ}
                isHighlighted={isHighlighted}
                onAnswerChange={(answer) => {
                  // Handle sub-question answer
                  subQ.answer = answer;
                  if (answer === 'no') {
                    subQ.details = '';
                  }
                }}
                onDetailsChange={(details) => {
                  subQ.details = details;
                }}
                onHighlightToggle={onHighlightToggle}
                isSubQuestion={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const PreOperativeChecklist: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const handleAnswerChange = (questionId: string, answer: 'yes' | 'no') => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answer: answer,
            details: answer === 'no' ? '' : q.details
          };
        }
        return q;
      })
    );
  };

  const handleDetailsChange = (questionId: string, details: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, details } : q))
    );
  };

  const handleHighlightToggle = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, highlighted: !q.highlighted } : q))
    );
  };

  return (
    <View className="space-y-4">
      {/* Questions List */}
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          isHighlighted={question.highlighted || false}
          onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
          onDetailsChange={(details) => handleDetailsChange(question.id, details)}
          onHighlightToggle={() => handleHighlightToggle(question.id)}
        />
      ))}

      {/* Footer Note */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-md">
        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
          <strong>NOTE:</strong> PLEASE MARK IN RED INK IF ANYTHING SIGNIFICANT IN THE HISTORY AND ALSO BRING TO THE NOTICE OF ANESTHETIST AND PRIMARY SURGEON.
        </p>
      </div>
    </View>
  );
};

export default PreOperativeChecklist;
