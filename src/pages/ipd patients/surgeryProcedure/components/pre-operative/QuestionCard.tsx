import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Question } from "./useChecklistState";
import { QuestionControls } from "./QuestionControls";
import View from "@/components/view";
import Button from "@/components/button";

interface Props {
  question: Question;
  onAnswerChange: (id: string, v: "Yes" | "No") => void;
  onDetailsChange: (id: string, v: string) => void;
  onToggleHighlight: (id: string) => void;
  isSubQuestion?: boolean;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  onAnswerChange,
  onDetailsChange,
  onToggleHighlight,
  isSubQuestion = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasSub = !!question.subQuestions?.length;
  const highlightClass = question.highlighted
    ? "bg-red-100 dark:bg-red-900/30 border-red-300"
    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";

  return (
    <View
      className={`rounded-lg shadow-sm border transition-all duration-300 ${
        isSubQuestion ? "ml-4 sm:ml-6" : "mb-3"
      } ${highlightClass}`}
    >
      {/* Header */}
      <View
        className={`flex justify-between items-start gap-3 ${hasSub ? "p-4 pb-3" : "px-4 pt-4 pb-2"}`}
      >
        <View className="flex-1">
          <h3
            className={`${hasSub ? "font-bold text-base" : "font-semibold text-sm"} text-slate-700 dark:text-slate-200`}
          >
            {question.number}. {question.text}
          </h3>
        </View>
        {hasSub && (
          <Button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        )}
      </View>

      {/* Controls - only show if this question doesn't have sub-questions */}
      {!hasSub && (
        <View className="px-4 pb-4">
          <QuestionControls
            question={question}
            onAnswerChange={(ans) => onAnswerChange(question.id, ans)}
            onDetailsChange={(val) => onDetailsChange(question.id, val)}
            onToggleHighlight={() => onToggleHighlight(question.id)}
          />
        </View>
      )}

      {/* Subquestions */}
      {hasSub && expanded && (
        <View className="px-4 pb-4 space-y-3">
          {question.subQuestions!.map((sub) => (
            <QuestionCard
              key={sub.id}
              question={sub}
              onAnswerChange={onAnswerChange}
              onDetailsChange={onDetailsChange}
              onToggleHighlight={onToggleHighlight}
              isSubQuestion
            />
          ))}
        </View>
      )}
    </View>
  );
};
