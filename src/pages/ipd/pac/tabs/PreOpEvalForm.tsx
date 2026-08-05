import React from "react";
import View from "@/components/view";
import Input from "@/components/input";
import Text from "@/components/text";
import TextareaComp from "@/components/Textarea";
import RadioGroup from "@/components/RadioGroup";
import CheckBox from "@/components/CheckBox";
import WebcamCapture from "@/components/Capture";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Activity,
  AlertTriangle,
  Wind,
  Clipboard,
  FlaskConical,
  Stethoscope,
  User,
} from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import Upload from "@/components/Upload";

interface Props {
  readOnly?: boolean;
}

interface AirwayAssessment {
  mouth_opening: string;
  teeth: string;
  neck_movements: string;
  mallampati_score: string;
  dentures: boolean;
}

interface InvestigationValues {
  hb: string;
  hct: string;
  tc: string;
  platelets: string;
  bt_ct: string;
  pt_ptt: string;
  bun: string;
  creatinine: string;
  na_k: string;
  chest_xray: string;
  ecg: string;
  others: string;
}

interface PreOpEval {
  previous_anaesthesia?: string;
  current_medications?: string;
  allergies?: string;
  diagnosis?: string;
  proposed_surgery?: string;
  airway?: AirwayAssessment;
  investigations?: InvestigationValues;
  systems?: any;
  asa?: string;
  anticipated_problems?: string;
  instructions?: string;
  evaluating_doctor?: string;
}

const systemsData = [
  {
    id: "respiratory",
    label: "Respiratory System",
    options: [
      "Asthma",
      "Chronic Bronchitis",
      "COPD",
      "Dyspnoea",
      "Cough",
      "Recent URI",
      "Smoker",
    ],
  },
  {
    id: "cardio",
    label: "Cardio Vascular System",
    options: [
      "Hypertension",
      "IHD/Angina",
      "Dyspnoea on Exertion",
      "Congestive Heart Failure",
    ],
  },
  {
    id: "cns",
    label: "CNS / Musculoskeletal",
    options: [
      "CVA / Stroke",
      "Seizures",
      "Head Injury",
      "Paraplegia",
      "Neuromuscular Disorder",
    ],
  },
  {
    id: "hepatic",
    label: "Hepatic / Renal",
    options: [
      "Jaundice",
      "Hepatic Failure",
      "Chronic Renal Failure",
      "Oliguria",
      "Hepatitis",
    ],
  },
  {
    id: "endocrine",
    label: "Endocrine",
    options: [
      "Diabetes",
      "Ketoacidosis",
      "Thyroid Hypo",
      "Thyroid Hyper",
      "Pituitary",
      "Adrenals",
    ],
  },
  {
    id: "others",
    label: "Others",
    options: [
      "Anemia",
      "Bleeding Disorders",
      "Cancer Chemotherapy",
      "Pregnancy",
      "Psychiatry",
    ],
  },
];

const PreOpEvalForm: React.FC<Props> = ({ readOnly }) => {
  const { values, handleChange, onSetHandler } = useForm<PreOpEval | null>(
    null,
  );

  const FormSection = ({
    title,
    icon: Icon,
    children,
    className,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Card
      className={`p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mb-6 bg-white dark:bg-slate-900 ${className}`}
    >
      <View className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <View className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </View>
        <Text
          as="h3"
          className="font-bold text-sm uppercase text-slate-800 dark:text-slate-100 tracking-wide"
        >
          {title}
        </Text>
      </View>
      <View className="p-5">{children}</View>
    </Card>
  );

  const CheckboxGroup = ({
    options,
    selected = [],
    onToggle,
  }: {
    options: string[];
    selected?: string[];
    onToggle: (val: string, checked: boolean) => void;
  }) => (
    <View className="flex flex-wrap gap-x-6 gap-y-3">
      {options.map((opt) => (
        <View
          key={opt}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => !readOnly && onToggle(opt, !selected.includes(opt))}
        >
          <CheckBox
            checked={selected.includes(opt)}
            onChange={() => !readOnly && onToggle(opt, !selected.includes(opt))}
            disabled={readOnly}
            readonly={readOnly}
          />
          <Text
            as="span"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {opt}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <>
      {/* Upload filled form */}
      <View className="flex justify-center mt-8">
        <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5 ">
          <Upload
            label="Upload Filled Pre-Op Evaluation Form"
            name="preop_upload"
            multiple={false}
            maxCount={1}
            accept=".pdf,.jpg,.png, .jpeg, .webp"
            browseText="Upload Form"
          />
        </View>
      </View>
      <View className="my-6 border-t border-slate-200" />

      {/* Collapsible Fields */}
      <CollapsibleContainer
        title="Pre-Op Evaluation Fields"
        defaultOpen={false}
        variant="default"
        containerClassName="shadow-none"
        contentClassName="space-y-6 pb-20 animate-in fade-in duration-500"
      >
        {/* Diagnosis & Surgery */}
        <FormSection title="Diagnosis & Surgery" icon={FileText}>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextareaComp
              id="diagnosis"
              name="diagnosis"
              label="Diagnosis"
              value={values?.diagnosis || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white min-h-[80px]"
            />
            <TextareaComp
              id="proposed_surgery"
              name="proposed_surgery"
              label="Proposed Surgery"
              value={values?.proposed_surgery || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white min-h-[80px]"
            />
          </View>
        </FormSection>

        {/* History & Allergies */}
        <FormSection title="History & Medications" icon={Clipboard}>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextareaComp
              id="previous_anaesthesia"
              name="previous_anaesthesia"
              label="Previous Anaesthesia / Surgery"
              value={values?.previous_anaesthesia || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white"
            />
            <TextareaComp
              id="current_medications"
              name="current_medications"
              label="Current Medications"
              value={values?.current_medications || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white"
            />
          </View>
        </FormSection>

        {/* Allergies & ASA */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSection
            title="Allergies"
            icon={AlertTriangle}
            className="h-full mb-0"
          >
            <TextareaComp
              id="allergies"
              name="allergies"
              value={values?.allergies || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white border-0 focus:ring-0 p-0 resize-none min-h-[80px]"
              placeholder="List allergies..."
            />
          </FormSection>

          <FormSection
            title="ASA Grading"
            icon={Activity}
            className="h-full mb-0"
          >
            <View className="flex items-center justify-start h-full pb-4">
              <RadioGroup
                name="asa"
                value={(values as any)?.asa || ""}
                onChange={(val) => onSetHandler("asa", val)}
                variant="button"
                options={["1", "2", "3", "4", "5", "E"].map((g) => ({
                  value: g,
                  label: g,
                }))}
                disabled={readOnly}
              />
            </View>
          </FormSection>
        </View>

        {/* Airway Assessment */}
        <FormSection title="Airway Assessment" icon={Wind}>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              label="Mouth Opening"
              value={values?.airway?.mouth_opening || ""}
              onChange={(e) =>
                onSetHandler("airway", {
                  ...values?.airway,
                  mouth_opening: e.target.value,
                })
              }
              disabled={readOnly}
              className="bg-white"
            />
            <Input
              label="Teeth"
              value={values?.airway?.teeth || ""}
              onChange={(e) =>
                onSetHandler("airway", {
                  ...values?.airway,
                  teeth: e.target.value,
                })
              }
              disabled={readOnly}
              className="bg-white"
            />
            <Input
              label="Neck Movements"
              value={values?.airway?.neck_movements || ""}
              onChange={(e) =>
                onSetHandler("airway", {
                  ...values?.airway,
                  neck_movements: e.target.value,
                })
              }
              disabled={readOnly}
              className="bg-white"
            />
            <Input
              label="Mallampati Score"
              value={values?.airway?.mallampati_score || ""}
              onChange={(e) =>
                onSetHandler("airway", {
                  ...values?.airway,
                  mallampati_score: e.target.value,
                })
              }
              disabled={readOnly}
              className="bg-white"
            />
          </View>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
            <Text className="font-semibold text-sm text-slate-700">
              Dentures Check:
            </Text>
            <RadioGroup
              name="dentures"
              value={values?.airway?.dentures ? "yes" : "no"}
              onChange={(val) =>
                onSetHandler("airway", {
                  ...values?.airway,
                  dentures: val === "yes",
                })
              }
              variant="button"
              size="small"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              disabled={readOnly}
            />
          </div>
        </FormSection>

        {/* Clinical Evaluation Systems */}
        <FormSection title="Clinical Evaluation – Systems" icon={Stethoscope}>
          <View className="space-y-6 divide-y divide-slate-100">
            {systemsData.map((cat, idx) => {
              const selected: string[] =
                (values as any)?.systems?.[cat.id]?.selected || [];
              const note: string =
                (values as any)?.systems?.[cat.id]?.note || "";

              const toggleOption = (opt: string, checked: boolean) => {
                const currentCat = (values as any)?.systems?.[cat.id] || {
                  selected: [],
                  note: "",
                };
                const newSelected = checked
                  ? [...currentCat.selected, opt]
                  : currentCat.selected.filter((o: string) => o !== opt);
                onSetHandler(`systems.${cat.id}`, {
                  ...currentCat,
                  selected: newSelected,
                });
              };

              return (
                <View key={cat.id} className={`${idx !== 0 ? "pt-4" : ""}`}>
                  <Text className="font-bold text-sm text-slate-800 uppercase mb-3">
                    {cat.label}
                  </Text>
                  <CheckboxGroup
                    options={cat.options}
                    selected={selected}
                    onToggle={toggleOption}
                  />
                  <Input
                    value={note}
                    onChange={(e) => {
                      const currentCat = (values as any)?.systems?.[cat.id] || {
                        selected: [],
                        note: "",
                      };
                      onSetHandler(`systems.${cat.id}`, {
                        ...currentCat,
                        note: e.target.value,
                      });
                    }}
                    placeholder="Clinical notes..."
                    className="bg-slate-50 mt-3 border-dashed"
                    disabled={readOnly}
                  />
                </View>
              );
            })}
          </View>
        </FormSection>

        {/* Investigations */}
        <FormSection title="Investigations" icon={FlaskConical}>
          <View className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: "hb", label: "Hb%" },
              { id: "hct", label: "HCT" },
              { id: "tc", label: "TC" },
              { id: "platelets", label: "Platelets" },
              { id: "bt_ct", label: "BT / CT" },
              { id: "pt_ptt", label: "PT / PTT" },
              { id: "bun", label: "BUN" },
              { id: "creatinine", label: "Creatinine" },
              { id: "na_k", label: "Na / K" },
              { id: "chest_xray", label: "Chest X-Ray" },
              { id: "ecg", label: "ECG" },
              { id: "others", label: "Others" },
            ].map((inv) => (
              <Input
                key={inv.id}
                label={inv.label}
                value={(values as any)?.investigations?.[inv.id] || ""}
                onChange={(e) =>
                  onSetHandler(`investigations.${inv.id}`, e.target.value)
                }
                disabled={readOnly}
                className="bg-white"
              />
            ))}
          </View>
        </FormSection>

        {/* Footer Info */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSection
            title="Anticipated Problems"
            icon={AlertTriangle}
            className="h-full"
          >
            <TextareaComp
              value={values?.anticipated_problems || ""}
              onChange={handleChange}
              name="anticipated_problems"
              className="bg-white min-h-[100px] border-0 focus:ring-0 p-0 resize-none"
              placeholder="Specific problems..."
              disabled={readOnly}
            />
          </FormSection>

          <FormSection
            title="Instructions & Doctor"
            icon={User}
            className="h-full"
          >
            <View className="space-y-4">
              <TextareaComp
                label="Instructions & Meds"
                value={values?.instructions || ""}
                onChange={handleChange}
                name="instructions"
                className="bg-white min-h-[60px]"
                disabled={readOnly}
              />
              <Input
                label="Evaluating Doctor Name"
                value={values?.evaluating_doctor || ""}
                onChange={handleChange}
                name="evaluating_doctor"
                className="bg-white"
                disabled={readOnly}
              />
            </View>
          </FormSection>
        </View>

        {/* end CollapsibleContainer */}
      </CollapsibleContainer>
    </>
  );
};

export default PreOpEvalForm;
