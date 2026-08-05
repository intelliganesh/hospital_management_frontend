import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import CheckBox from "@/components/CheckBox";
import RadioGroup from "@/components/RadioGroup";
import Button from "@/components/button";
import WebcamCapture from "@/components/Capture";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Clock,
  FileText,
  HeartPulse,
  Pill,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import Upload from "@/components/Upload";

interface Props {
  readOnly?: boolean;
}

interface ObservationRow {
  id: string;
  time: string;
  consciousness: string;
  respiration: string;
  pulseRate: string;
  bp: string; // Systolic/Diastolic
  spo2: string;
  remarks: string;
}

interface FormValues {
  surgical_procedure?: string;
  time_received?: string;

  // Monitors
  monitors?: string[];

  // Medications
  post_op_meds?: string[];

  // Complications
  complications?: string[];

  // Recovery Score (Aldrete)
  score_consciousness?: number;
  score_activity?: number;
  score_hemodynamic?: number;
  score_respiratory?: number;
  score_oxygen?: number;
  score_pain?: number;
  score_emetic?: number;

  score_admission_total?: string; // or number calculation
  score_transfer_total?: string;

  // Observations
  observations?: ObservationRow[];

  // Transfer
  transfer_dest?: string; // Ward, MICU, PICU...
  transfer_time?: string;

  // Vitals at shifting
  shift_pulse?: string;
  shift_sbp?: string;
  shift_dbp?: string;
  shift_rr?: string;

  post_op_instructions?: string;
}

const RecoveryObsForm: React.FC<Props> = ({ readOnly }) => {
  const initialValues: FormValues = {
    post_op_meds: ["", "", "", "", ""],
    observations: [
      {
        id: "1",
        time: "",
        consciousness: "",
        respiration: "",
        pulseRate: "",
        bp: "",
        spo2: "",
        remarks: "",
      },
    ],
  };

  const { values, handleChange, onSetHandler } =
    useForm<FormValues>(initialValues);

  // --- Helpers ---
  const CheckboxGroup = ({
    options,
    selected = [],
    fieldName,
  }: {
    options: string[];
    selected?: string[];
    fieldName: keyof FormValues;
  }) => (
    <View className="flex flex-wrap gap-x-6 gap-y-3">
      {options.map((opt) => (
        <View
          key={opt}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => !readOnly && toggleSelection(fieldName, opt)}
        >
          <CheckBox
            checked={selected.includes(opt)}
            onChange={() => !readOnly && toggleSelection(fieldName, opt)}
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

  const toggleSelection = (field: keyof FormValues, value: string) => {
    const current = (values?.[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onSetHandler(field, updated);
  };

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

  // Score Row Helper
  const ScoreRow = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof FormValues;
    options: { val: number; desc: string }[];
  }) => (
    <div className="grid grid-cols-12 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className="col-span-4 p-3 border-r border-slate-100 flex items-center">
        <Text className="text-sm font-semibold text-slate-700">{label}</Text>
      </div>
      {options.map((opt) => (
        <div
          key={opt.val}
          className="col-span-8 md:col-span-2 md:last:col-span-4 p-2 border-r border-slate-100 last:border-0 flex items-center justify-center md:justify-start"
        >
          <View
            className={`flex items-start gap-2 p-2 rounded-md cursor-pointer w-full transition-all ${values?.[field] === opt.val ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-100"}`}
            onClick={() => !readOnly && onSetHandler(field, opt.val)}
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${values?.[field] === opt.val ? "border-blue-500" : "border-slate-300"}`}
            >
              {values?.[field] === opt.val && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            <View>
              <Text className="text-xs font-bold mb-0.5 text-slate-500">
                Score {opt.val}
              </Text>
              <Text className="text-[11px] leading-tight text-slate-600">
                {opt.desc}
              </Text>
            </View>
          </View>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Upload filled form */}
      <View className="flex justify-center mt-8">
        <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5 ">
          <Upload
            label="Upload Filled Recovery Room Form"
            name="recovery_upload"
            multiple={false}
            maxCount={1}
            accept=".pdf,.jpg,.png, .jpeg, .webp"
            browseText="Upload Form"
          />
        </View>
      </View>
      <View className="my-6 border-t border-slate-200" />

      <CollapsibleContainer
        title="Recovery Room Fields"
        defaultOpen={false}
        variant="default"
        containerClassName="shadow-none"
        contentClassName="space-y-6 pb-20 animate-in fade-in duration-500"
      >
        <View className="space-y-6 pb-20 animate-in fade-in duration-500">
          {/* Header Details */}
          <FormSection title="Surgical Details" icon={FileText}>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Surgical Procedure"
                name="surgical_procedure"
                value={values?.surgical_procedure}
                onChange={handleChange}
                disabled={readOnly}
              />
              <Input
                label="Time Patient Received"
                type="time"
                name="time_received"
                value={values?.time_received}
                onChange={handleChange}
                disabled={readOnly}
              />
            </View>
          </FormSection>

          {/* Post Operative Instructions & Monitors Merged Card */}
          <FormSection
            title="Post Operative Instructions & Monitors"
            icon={Activity}
          >
            <View className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x-0 md:divide-x divide-slate-100">
              {/* Left Side: Instructions */}
              <View className="pr-4">
                <Text className="text-sm font-bold text-slate-800 uppercase mb-3">
                  Post Operative Instructions
                </Text>
                <Text className="text-sm text-slate-600 mb-2 font-medium">
                  Routinely Check the following every 5 to 10 minutes
                </Text>
                <ul className="list-decimal list-inside space-y-1 text-sm text-slate-600 pl-1">
                  <li>Pulse Rate</li>
                  <li>Blood Pressure</li>
                  <li>Respiration</li>
                </ul>
              </View>

              {/* Right Side: Monitors */}
              <View className="pl-0 md:pl-8">
                <Text className="text-sm font-bold text-slate-800 uppercase mb-3">
                  Monitors
                </Text>
                <CheckboxGroup
                  options={[
                    "ECG",
                    "NIBP",
                    "SaO2",
                    "ABP",
                    "CVP",
                    "Urine Output",
                  ]}
                  selected={values?.monitors}
                  fieldName="monitors"
                />
              </View>
            </View>
          </FormSection>

          {/* Complications */}
          <FormSection
            title="Post Operative Complications"
            icon={AlertTriangle}
          >
            <CheckboxGroup
              options={[
                "Pain",
                "Hypoxia",
                "Nausea/Vomiting",
                "Laryngospasm/Bronchospasm",
                "Arrhythmias",
                "Hypo/Hyperventilation",
                "Hypo/Hypertension",
                "Any Other",
              ]}
              selected={values?.complications}
              fieldName="complications"
            />
          </FormSection>

          {/* Medications */}
          <FormSection title="Post Operative Medications" icon={Pill}>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(values?.post_op_meds || []).map((med, idx) => (
                <View key={idx} className="flex items-center gap-3">
                  <Text className="text-xs font-bold text-slate-400 w-4">
                    {idx + 1}.
                  </Text>
                  <Input
                    value={med}
                    onChange={(e) => {
                      const arr = [...(values?.post_op_meds || [])];
                      arr[idx] = e.target.value;
                      onSetHandler("post_op_meds", arr);
                    }}
                    disabled={readOnly}
                    className="bg-white"
                    placeholder="Enter medication..."
                  />
                </View>
              ))}
            </View>
          </FormSection>

          {/* Recovery Score Grid (Aldrete or similar) */}
          <FormSection title="Recovery Score" icon={ClipboardList}>
            <View className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              {/* Header Row */}
              <div className="grid grid-cols-12 bg-slate-100 p-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-4 px-2">Parameter</div>
                <div className="col-span-8 md:col-span-8 grid grid-cols-3">
                  <div className="px-2">Score 0</div>
                  <div className="px-2">Score 1</div>
                  <div className="px-2">Score 2</div>
                </div>
              </div>

              {/* Rows */}
              <ScoreRow
                label="Level of Consciousness"
                field="score_consciousness"
                options={[
                  { val: 0, desc: "Unresponsive to tactile stimulation" },
                  { val: 1, desc: "Arousable with minimal stimulation" },
                  { val: 2, desc: "Awake and oriented" },
                ]}
              />
              <ScoreRow
                label="Physical Activity"
                field="score_activity"
                options={[
                  { val: 0, desc: "Unable to voluntarily move extremities" },
                  { val: 1, desc: "Some weakness in movement" },
                  { val: 2, desc: "Able to move all extremities" },
                ]}
              />
              <ScoreRow
                label="Hemodynamic Stability"
                field="score_hemodynamic"
                options={[
                  { val: 1, desc: "BP > 50% from baseline" },
                  { val: 2, desc: "BP 20-50% from baseline" },
                  { val: 3, desc: "BP < 20% from baseline" },
                ]}
              />
              <ScoreRow
                label="Respiratory Stability"
                field="score_respiratory"
                options={[
                  { val: 0, desc: "Apneic / weak cough" },
                  { val: 1, desc: "Tachypnea with good cough" },
                  { val: 2, desc: "Able to breathe deeply" },
                ]}
              />
              <ScoreRow
                label="Oxygen Saturation"
                field="score_oxygen"
                options={[
                  { val: 0, desc: "Saturation < 90% with supplement" },
                  { val: 1, desc: "Saturation 90% with supplement" },
                  { val: 2, desc: "Saturation > 90% on room air" },
                ]}
              />
              <ScoreRow
                label="Postop Pain"
                field="score_pain"
                options={[
                  { val: 0, desc: "Persistent severe pain" },
                  { val: 1, desc: "Moderate to severe pain controlled" },
                  { val: 2, desc: "None or mild discomfort" },
                ]}
              />
              <ScoreRow
                label="Postop Emetic Symptoms"
                field="score_emetic"
                options={[
                  { val: 0, desc: "Persistent nausea/vomiting" },
                  { val: 1, desc: "Transient vomiting or retching" },
                  { val: 2, desc: "None or mild nausea" },
                ]}
              />
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <View className="flex items-center justify-between">
                <Text className="text-sm font-bold text-slate-700">
                  Patient's Score on Admission:
                </Text>
                <View className="flex items-center gap-2">
                  <Input
                    className="w-16 h-8 bg-white text-center font-bold"
                    value={values?.score_admission_total}
                    onChange={(e) =>
                      onSetHandler("score_admission_total", e.target.value)
                    }
                    disabled={readOnly}
                  />
                  <Text className="font-bold text-slate-400">/ 14</Text>
                </View>
              </View>
              <View className="flex items-center justify-between">
                <Text className="text-sm font-bold text-slate-700">
                  Patient's Score Before Transfer:
                </Text>
                <View className="flex items-center gap-2">
                  <Input
                    className="w-16 h-8 bg-white text-center font-bold"
                    value={values?.score_transfer_total}
                    onChange={(e) =>
                      onSetHandler("score_transfer_total", e.target.value)
                    }
                    disabled={readOnly}
                  />
                  <Text className="font-bold text-slate-400">/ 14</Text>
                </View>
              </View>
            </View>
          </FormSection>

          {/* Observations Table */}
          <FormSection title="Vitals Monitoring" icon={HeartPulse}>
            <View className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <View className="grid grid-cols-12 bg-slate-100 p-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Consciousness</div>
                <div className="col-span-1">Resp</div>
                <div className="col-span-1">Pulse</div>
                <div className="col-span-1">SaO2</div>
                <div className="col-span-2">BP</div>
                <div className="col-span-3">Remarks</div>
              </View>
              {(values?.observations || []).map((row, idx) => (
                <View
                  key={row.id || idx}
                  className="grid grid-cols-12 p-2 border-b border-slate-100 last:border-0 items-center gap-2"
                >
                  <div className="col-span-2">
                    <Input
                      value={row.time}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].time = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                      type="time"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={row.consciousness}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].consciousness = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={row.respiration}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].respiration = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={row.pulseRate}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].pulseRate = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={row.spo2}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].spo2 = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={row.bp}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].bp = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                      placeholder="Sys/Dia"
                    />
                  </div>
                  <div className="col-span-3 flex gap-1">
                    <Input
                      value={row.remarks}
                      onChange={(e) => {
                        const arr = [...(values?.observations || [])];
                        arr[idx].remarks = e.target.value;
                        onSetHandler("observations", arr);
                      }}
                      className="h-7 text-xs"
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="small"
                        className="text-red-500 h-7 w-7 p-0"
                        onPress={() => {
                          const arr = (values?.observations || []).filter(
                            (_, i) => i !== idx,
                          );
                          onSetHandler("observations", arr);
                        }}
                      >
                        {" "}
                        <X size={14} />{" "}
                      </Button>
                    )}
                  </div>
                </View>
              ))}
            </View>
            {!readOnly && (
              <Button
                variant="outline"
                size="small"
                className="mt-3"
                onPress={() =>
                  onSetHandler("observations", [
                    ...(values?.observations || []),
                    {
                      id: Date.now().toString(),
                      time: "",
                      consciousness: "",
                      respiration: "",
                      pulseRate: "",
                      bp: "",
                      spo2: "",
                      remarks: "",
                    },
                  ])
                }
              >
                <Plus size={14} className="mr-1" /> Add Observation
              </Button>
            )}
          </FormSection>

          {/* Transfer Details */}
          <FormSection title="Transfer / Discharge" icon={ArrowRight}>
            <View className="space-y-6">
              <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Transfer To
                  </Text>
                  <RadioGroup
                    name="transfer_dest"
                    options={[
                      { label: "Ward", value: "Ward" },
                      { label: "MICU", value: "MICU" },
                      { label: "PICU", value: "PICU" },
                      { label: "NSICU", value: "NSICU" },
                      { label: "NICU", value: "NICU" },
                      { label: "CCU", value: "CCU" },
                    ]}
                    value={values?.transfer_dest}
                    onChange={(val) => onSetHandler("transfer_dest", val)}
                    variant="button"
                    size="small"
                    disabled={readOnly}
                  />
                </View>
                <View>
                  <Input
                    label="Time of Transfer"
                    type="time"
                    value={values?.transfer_time}
                    onChange={(e) =>
                      onSetHandler("transfer_time", e.target.value)
                    }
                    disabled={readOnly}
                  />
                </View>
              </View>

              <View className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <Text className="text-xs font-bold text-slate-500 mb-3 uppercase">
                  Vitals at Shifting
                </Text>
                <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    label="Pulse"
                    value={values?.shift_pulse}
                    onChange={(e) =>
                      onSetHandler("shift_pulse", e.target.value)
                    }
                    disabled={readOnly}
                    className="bg-white"
                  />
                  <Input
                    label="SBP"
                    value={values?.shift_sbp}
                    onChange={(e) => onSetHandler("shift_sbp", e.target.value)}
                    disabled={readOnly}
                    className="bg-white"
                  />
                  <Input
                    label="DBP"
                    value={values?.shift_dbp}
                    onChange={(e) => onSetHandler("shift_dbp", e.target.value)}
                    disabled={readOnly}
                    className="bg-white"
                  />
                  <Input
                    label="RR"
                    value={values?.shift_rr}
                    onChange={(e) => onSetHandler("shift_rr", e.target.value)}
                    disabled={readOnly}
                    className="bg-white"
                  />
                </View>
              </View>

              <View>
                <Textarea
                  label="Post-Operative Instructions"
                  value={values?.post_op_instructions}
                  onChange={handleChange}
                  name="post_op_instructions"
                  disabled={readOnly}
                  className="bg-white min-h-[100px]"
                  placeholder="02 mask / ETT + Spont / ETT + Ventilator etc..."
                />
              </View>
            </View>
          </FormSection>
        </View>
      </CollapsibleContainer>
    </>
  );
};

export default RecoveryObsForm;
