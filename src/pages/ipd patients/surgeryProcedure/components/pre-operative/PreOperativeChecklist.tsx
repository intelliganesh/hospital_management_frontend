import React, { useEffect, useState } from "react";
import { useChecklistState, Question } from "./useChecklistState";
import { QuestionCard } from "./QuestionCard";
import View from "@/components/view";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";
import Button from "@/components/button";
import FormSection from "@/pages/ipd/pac/components/FormSection";
import { FileText, Upload as UploadIcon } from "lucide-react";
import initialQuestionsData from "./initialQuestions.json";
import { useParams } from "react-router-dom";
import { usePreOperativeChecklist } from "@/actions/calls/ipd/surgeryProcedure/preOperativeChecklist";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { PreOperativeChecklistData } from "@/interfaces/ipd/surgeryProcedure/preOperativeChecklist";
import { imageUpload } from "@/actions/calls/uesImage";
import { toast } from "@/utils/custom-hooks/use-toast";
import useForm from "@/utils/custom-hooks/use-form";
import dayjs from "dayjs";

const initialQuestions = initialQuestionsData as Question[];

const fieldMapping: Record<string, keyof PreOperativeChecklistData> = {
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

export const PreOpChecklist: React.FC = () => {
  const { id } = useParams(); // ipd_surgery_id
  const { preOperativeChecklistDetail, updatePreOperativeChecklist, cleanUp } =
    usePreOperativeChecklist();

  const {
    questions,
    setQuestions,
    handleAnswerChange,
    handleDetailsChange,
    toggleHighlight,
  } = useChecklistState(initialQuestions);

  const checklistDetailData = useSelector(
    (state: RootState) =>
      state.preOperativeChecklist.preOperativeChecklistDetailData,
  );

  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData,
  );

  const { values, onSetHandler } =
    useForm<PreOperativeChecklistData>(checklistDetailData);

  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (id) {
      preOperativeChecklistDetail(id, () => {});
    }
    return () => cleanUp();
  }, [id]);

  useEffect(() => {
    if (checklistDetailData) {
      setSummary(checklistDetailData.summary || "");

      const updatedQuestions = JSON.parse(JSON.stringify(initialQuestions));

      const updateQuestionsRecursive = (qs: Question[]) => {
        qs.forEach((q) => {
          const field = fieldMapping[q.id];
          if (field) {
            const apiValue = checklistDetailData[field] as string;
            if (apiValue) {
              const [answer, detail, highlighted] = apiValue
                .split("|")
                .map((v) => v.trim());
              q.answer = (answer as "Yes" | "No") || null;
              q.details = detail || "";
              q.highlighted = highlighted === "true";
            }
          }
          if (q.subQuestions) {
            updateQuestionsRecursive(q.subQuestions);
          }
        });
      };

      updateQuestionsRecursive(updatedQuestions);
      setQuestions(updatedQuestions);
    }
  }, [checklistDetailData]);

  const handleSubmit = () => {
    if (!id || !surgeryReportData?.ipd_id) return;

    const payload: any = {
      ipd_id: surgeryReportData.ipd_id,
      ipd_surgery_id: id,
      summary: summary,
      datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    const collectAnswersRecursive = (qs: Question[]) => {
      qs.forEach((q) => {
        const field = fieldMapping[q.id];
        if (field) {
          payload[field] =
            `${q.answer || ""}|${q.details || ""}|${q.highlighted || false}`;
        }
        if (q.subQuestions) {
          collectAnswersRecursive(q.subQuestions);
        }
      });
    };

    collectAnswersRecursive(questions);

    // STEP 1: Submit checklist data (without file)
    updatePreOperativeChecklist(id, payload, (success: boolean) => {
      if (success) {
        toast({
          title: "Success!",
          description: "Pre-operative checklist submitted successfully.",
          variant: "success",
        });

        // STEP 2: Upload file separately if a new file was selected
        if (values?.upload_pdf_path) {
          const uploadData = {
            id: checklistDetailData?.id,
            modal_type: "ipd_pre_operative_checklist",
            file_name: "upload_pdf_path",
            folder_name: "ipd_pre_operative_checklist",
            image: values.upload_pdf_path,
          };

          imageUpload(uploadData, (uploadSuccess: boolean) => {
            if (uploadSuccess) {
              toast({
                title: "Success!",
                description: "Checklist file uploaded successfully.",
                variant: "success",
              });
            }
          });
        }

        preOperativeChecklistDetail(id, () => {});
      } else {
        toast({
          title: "Error!",
          description: "Failed to submit pre-operative checklist.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <View className="space-y-6">
      {/* Checklist Questions */}
      <View className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onAnswerChange={handleAnswerChange}
            onDetailsChange={handleDetailsChange}
            onToggleHighlight={toggleHighlight}
          />
        ))}

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            <strong>NOTE:</strong> PLEASE HIGHLIGHT ANY SIGNIFICANT FINDINGS IN
            THE HISTORY AND ALSO BRING THEM TO THE NOTICE OF THE ANESTHETIST AND
            PRIMARY SURGEON.
          </p>
        </div>
      </View>

      {/* Summary */}
      <FormSection title="Summary" icon={FileText}>
        <Textarea
          id="summary"
          name="summary"
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="bg-white min-h-[100px]"
          placeholder="Enter summary of the pre-operative checklist..."
        />
      </FormSection>

      {/* Upload Section */}
      <FormSection title="Upload Pre-Operative Checklist" icon={UploadIcon}>
        <Upload
          label="Upload Filled Pre-Operative Checklist"
          name="upload_pdf_path"
          multiple={false}
          maxCount={1}
          accept=".pdf,.jpg,.png,.jpeg,.webp"
          browseText="Upload Form"
          existingFiles={
            typeof values?.upload_pdf_path === "string"
              ? values?.upload_pdf_path
              : ""
          }
          onChange={(fileList: any) => {
            let file: any = null;

            if (Array.isArray(fileList) && fileList.length > 0) {
              const item = fileList[0];

              if (item?.file instanceof File) {
                file = item.file;
              } else if (item instanceof File) {
                file = item;
              }
            }

            console.log("Selected File =>", file);

            onSetHandler("upload_pdf_path", file);
          }}
        />
      </FormSection>

      {/* Submit Button */}
      <View className="flex justify-end gap-4">
        <Button variant="outline" onPress={() => console.log("Cancel")}>
          Cancel
        </Button>
        <Button variant="primary" onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  );
};

export default PreOpChecklist;