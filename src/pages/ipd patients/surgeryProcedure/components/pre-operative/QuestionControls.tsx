import { AlertCircle } from "lucide-react";
import { Question } from "./useChecklistState";
import RadioGroup from "@/components/RadioGroup";
import View from "@/components/view";
import Input from "@/components/input";
import Button from "@/components/button";

interface Props {
  question: Question;
  onAnswerChange: (v: "Yes" | "No") => void;
  onDetailsChange: (v: string) => void;
  onToggleHighlight: () => void;
}

export const QuestionControls: React.FC<Props> = ({
  question,
  onAnswerChange,
  onDetailsChange,
  onToggleHighlight,
}) => {
  return (
    <View className="flex items-center gap-3 flex-wrap">
      {/* Yes/No Toggle */}
      <RadioGroup
        name={`question-${question.id}`}
        value={question.answer}
        onChange={(val) => onAnswerChange(val)}
        variant="button"
        size="small"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
      />

      {/* Details Input */}
      <View className="flex-1 min-w-[200px]">
        <Input
          type="text"
          value={question.details || ""}
          onChange={(e) => onDetailsChange(e.target.value)}
          placeholder="Enter details..."
          disabled={question.answer !== "Yes"}
          className="!h-10" // Matching the previous height
        />
      </View>

      {/* Highlight Button */}
      <Button
        onPress={onToggleHighlight}
        variant="ghost"
        className={`!transition-all ${
          question.highlighted
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 border border-transparent"
        }`}
        title="Click to highlight significant medical history in red"
      >
        <AlertCircle size={18} />
      </Button>
    </View>
  );
};
