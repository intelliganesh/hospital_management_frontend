import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import ReadOnlyField from "@/pages/ipd/pac/components/ReadOnlyField";
import SectionDivider from "@/pages/ipd/pac/components/SectionDivider";
import TabUploadSection from "@/pages/ipd/pac/components/TabUploadSection";
import initialQuestionsData from "./pre-operative/initialQuestions.json";

interface Props {
  detail: any;
  onPreview: (url: string, title: string) => void;
}

const fieldMapping: Record<string, string> = {
  q1: "q01_investigations",
  q2: "q02_chest_xray_ecg",
  q3: "q03_minor_age_parents",
  q4a: "q04a_blood_thinners",
  q4b: "q04b_blood_thinners_details",
  q5a: "q05a_asthma",
  q5b: "q05b_asthma_treatment",
  q6: "q06_medication_allergy",
  q7: "q07_tooth_extraction",
  q8: "q08_surgical_procedure",
  q9a: "q09a_diabetic",
  q9b: "q09b_blood_sugar",
  q10: "q10_thyroid_medication",
  q11a: "q11a_hypertension",
  q11b: "q11b_hypertension_medicine",
  q11c: "q11c_hypertension_medication_taken",
  q12: "q12_informed_consent",
  q13: "q13_anesthesia_awareness",
  q14: "q14_operative_procedure_awareness",
  q15a: "q15a_male_patient_age",
  q15b: "q15b_urinary_symptoms",
  q16: "q16_urinary_obstruction",
  q17: "q17_lithotomy_position",
  q18: "q18_previous_surgery",
  q19: "q19_community",
  q20: "q20_previous_surgery_events",
  q21: "q21_female_pregnant",
  q22: "q22_epilepsy",
  q23: "q23_antipsychotic",
  q24: "q24_last_food_intake",
};

const PreOpChecklistTab: React.FC<Props> = ({ detail, onPreview }) => {
  const renderQuestion = (q: any, isSub: boolean = false) => {
    const fieldName = fieldMapping[q.id];
    let ansVal = "-";
    let detailVal = "";
    let isHighlighted = false;

    if (fieldName && detail?.[fieldName]) {
      const parts = detail[fieldName].split("|").map((p: string) => p.trim());
      ansVal = parts[0] || "-";
      detailVal = parts[1] || "";
      isHighlighted = parts[2] === "true";
    }

    const hasSub = !!q.subQuestions?.length;

    return (
      <View
        key={q.id}
        className={`p-4 rounded-xl border ${
          isHighlighted
            ? "bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800"
        } ${isSub ? "ml-6 mt-3" : "mb-4"}`}
      >
        <View className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <View className="space-y-1 flex-1">
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {q.number}. {q.text}
            </Text>
            {detailVal && (
              <Text className="text-xs text-slate-500 dark:text-slate-400 italic block mt-1">
                Details: {detailVal}
              </Text>
            )}
          </View>
          {!hasSub && (
            <View className="flex items-center gap-3 self-start">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  ansVal === "Yes"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : ansVal === "No"
                    ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {ansVal}
              </span>
              {isHighlighted && (
                <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] uppercase tracking-wider font-extrabold rounded">
                  Highlighted
                </span>
              )}
            </View>
          )}
        </View>

        {hasSub && (
          <View className="space-y-1">
            {q.subQuestions.map((subQ: any) => renderQuestion(subQ, true))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="space-y-8 p-6">
      <SectionDivider label="Checklist Items" />
      <View className="space-y-2">
        {initialQuestionsData.map((q: any) => renderQuestion(q))}
      </View>

      <SectionDivider label="Summary & Files" />
      <ReadOnlyField label="Checklist Summary" value={detail?.summary} />

      <TabUploadSection
        docs={[
          {
            label: "Pre-Operative Checklist Form",
            path: detail?.upload_pdf_path,
          },
        ]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default PreOpChecklistTab;
