import React, { useEffect, useMemo, useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import RadioGroup from "@/components/RadioGroup";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import DynamicFormGroup from "@/components/DynamicFormGroup";
import FormSection from "../../components/FormSection";
import CheckboxGroup from "../../components/CheckboxGroup";
import {
  Activity,
  Clock,
  FileText,
  Pill,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import Upload from "@/components/Upload";
import {
  anaesthesiaRecoveryObservationAdd,
  anaesthesiaRecoveryObservationDetails,
} from "@/interfaces/ipd/anaesthesia/anaesthesiaRecoveryObservation";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import { useAnaesthesiaRecoveryObservation } from "@/actions/calls/ipd/anaesthesia/anaesthesiaRecoveryObservation";
import { imageUpload } from "@/actions/calls/uesImage";
import { toast } from "@/utils/custom-hooks/use-toast";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import Button from "@/components/button";
import dayjs from "dayjs";
import { validationForm } from "./RecoveryObsFormValidation";

const RecoveryObsForm: React.FC = () => {
  const anaesthesiaData =
    (useSelector(
      (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
    ) as AnaesthesiaDetails) || null;

  const anaesthesiaRecoveryObservationData =
    (useSelector(
      (state: RootState) =>
        state.anaesthesiaRecoveryObservation
          .AnaesthesiaRecoveryObservationDetails,
    ) as anaesthesiaRecoveryObservationDetails) || null;

  const anaesthesiaRecoveryObservationRecordId =
    anaesthesiaRecoveryObservationData?.id || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needStringify = [
    "monitors",
    "post_operative_complications",
    "post_operative_medications",
    "vital_monitoring",
  ];

  const parsedData = useMemo(() => {
    if (!anaesthesiaRecoveryObservationData)
      return anaesthesiaRecoveryObservationData;
    const copy = { ...anaesthesiaRecoveryObservationData } as any;
    needStringify.forEach((key) => {
      const val = copy[key];

      if (typeof val === "string") {
        try {
          copy[key] = JSON.parse(val);
        } catch {
          if (key === "post_operative_medications") {
            copy[key] = [val];
          } else {
            copy[key] = val
              ? val.split(",").map((item: string) => item.trim())
              : [];
          }
        }
      }
    });

    const finalCopy = {
      ...copy,
      time_patient_received: copy?.time_patient_received
        ? copy?.time_patient_received.split(" ")[1]
        : "",
      time_of_transfer: copy?.time_of_transfer
        ? copy?.time_of_transfer.split(" ")[1]
        : "",
    };
    return finalCopy as anaesthesiaRecoveryObservationDetails;
  }, [anaesthesiaRecoveryObservationData]);

  const { values, handleChange, onSetHandler } =
    useForm<anaesthesiaRecoveryObservationAdd>(parsedData);

  const {
    addAnaesthesiaRecoveryObservationHandler,
    anaesthesiaRecoveryObservationDetailsHandler,
    editanaesthesiaRecoveryObservationHandler,
  } = useAnaesthesiaRecoveryObservation();

  const handleUpload = () => {
    const uploadData = {
      id: anaesthesiaRecoveryObservationRecordId || "",
      modal_type: "ipd_anaesthesia_recover_observation ",
      file_name: "upload_pdf_path",
      folder_name: "ipd_anaesthesia_recover_observation",
      image: values?.upload_pdf_path || "",
    };

    imageUpload(uploadData, (uploadSuccess: boolean) => {
      if (uploadSuccess) {
        toast({
          title: "Success!",
          description:
            "Anaesthesia Recovery Observation Record file uploaded successfully!.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description:
            "Failed to upload Anaesthesia Recovery Observation Record file.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (anaesthesiaData?.id) {
      anaesthesiaRecoveryObservationDetailsHandler(
        anaesthesiaData?.id,
        () => {},
      );
    }
  }, [anaesthesiaData?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let AnaesthesiaRecoveryObservationFormObj: Partial<anaesthesiaRecoveryObservationAdd> =
      {
        ...values,
      };

    try {
      AnaesthesiaRecoveryObservationFormObj = {
        ...AnaesthesiaRecoveryObservationFormObj,
        ipd_id: anaesthesiaData?.ipd_id,
        ipd_surgery_id: anaesthesiaData?.ipd_surgery_id,
        ipd_anaesthesia_id: anaesthesiaData?.id,
        time_patient_received: (() => {
          const timeVal =
            AnaesthesiaRecoveryObservationFormObj?.time_patient_received;
          if (!timeVal) return undefined;

          const existingDate =
            anaesthesiaRecoveryObservationData?.time_patient_received
              ? anaesthesiaRecoveryObservationData.time_patient_received.split(
                  " ",
                )[0]
              : dayjs().format("YYYY-MM-DD");
          return `${existingDate} ${timeVal.length === 5 ? timeVal + ":00" : timeVal}`;
        })(),
        time_of_transfer: (() => {
          const timeVal =
            AnaesthesiaRecoveryObservationFormObj?.time_of_transfer;
          if (!timeVal) return undefined;
          const existingDate =
            anaesthesiaRecoveryObservationData?.time_of_transfer
              ? anaesthesiaRecoveryObservationData.time_of_transfer.split(
                  " ",
                )[0]
              : dayjs().format("YYYY-MM-DD");
          return `${existingDate} ${timeVal.length === 5 ? timeVal + ":00" : timeVal}`;
        })(),
      };

      delete AnaesthesiaRecoveryObservationFormObj["upload_pdf_path"];

      needStringify.forEach((key) => {
        const k = key as keyof anaesthesiaRecoveryObservationAdd;
        if (
          AnaesthesiaRecoveryObservationFormObj[k] !== undefined &&
          AnaesthesiaRecoveryObservationFormObj[k] !== null
        ) {
          (AnaesthesiaRecoveryObservationFormObj as any)[k] = JSON.stringify(
            AnaesthesiaRecoveryObservationFormObj[k],
          );
        }
      });

      await validationForm.validate(AnaesthesiaRecoveryObservationFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);

      // const submitDetails = () => {
      if (anaesthesiaRecoveryObservationData?.id) {
        editanaesthesiaRecoveryObservationHandler(
          anaesthesiaData?.id,
          // anaesthesiaRecoveryObservationData?.ipd_surgery_id,
          AnaesthesiaRecoveryObservationFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Anaesthesia Recovery Observation form updated successfully.",
                variant: "success",
              });
            } else {
              toast({
                title: "Error!",
                description:
                  "Failed to update Anaesthesia Recovery Observation form",
                variant: "destructive",
              });
            }
          },
        );
      } else {
        addAnaesthesiaRecoveryObservationHandler(
          AnaesthesiaRecoveryObservationFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Anaesthesia Recovery Observation form saved successfully.",
                variant: "success",
              });

              anaesthesiaRecoveryObservationDetailsHandler(
                anaesthesiaData?.id,
                () => {},
              );
            } else {
              toast({
                title: "Error!",
                description:
                  "Failed to save Anaesthesia Recovery Observation form",
                variant: "destructive",
              });
            }
          },
        );
      }
    } catch (error: any) {
      setIsSubmitting(false);

      let validationErrors: Record<string, string> = {};

      if (error.inner) {
        error.inner.forEach((e: any) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
        setErrors(validationErrors);
      } else if (error.path) {
        validationErrors = { [error.path]: error.message };
        setErrors(validationErrors);
      }

      const errorMessages = Object.values(validationErrors);

      formSubmissionFailMessage(
        errorMessages.length > 0
          ? errorMessages.join(", ")
          : "Some information is missing or incorrect. Check the fields and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Upload filled form */}
      <form onSubmit={handleSubmit}>
        <View className="flex justify-center mt-8">
          <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5 ">
            <Upload
              label="Upload Filled Recovery Observation Form"
              name="upload_pdf_path"
              multiple={false}
              maxCount={1}
              accept=".pdf,.jpg,.png, .jpeg, .webp"
              browseText="Upload Form"
              existingFiles={
                typeof values?.upload_pdf_path === "string"
                  ? values?.upload_pdf_path
                  : typeof values?.upload_pdf_path === "string"
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

                onSetHandler("upload_pdf_path", file);
              }}
            />
          </View>
        </View>
        <View className="my-6 border-t border-slate-200 dark:border-slate-700" />

        <CollapsibleContainer
          title="Recovery Room Fields"
          defaultOpen={false}
          variant="default"
          headerClassName="rounded-t-lg"
          containerClassName="shadow-none"
          contentClassName="space-y-6 animate-in fade-in duration-500"
        >
          <View className="space-y-6 animate-in fade-in duration-500">
            {/* Header Details */}
            <FormSection title="Surgical Details" icon={FileText}>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Surgical Procedure"
                  name="surgical_procedure"
                  placeholder="e.g. Laparoscopic Cholecystectomy"
                  value={values?.surgical_procedure}
                  onChange={handleChange}
                  error={errors?.surgical_procedure ?? ""}
                />
                <Input
                  label="Time Patient Received"
                  type="time"
                  name="time_patient_received"
                  value={values?.time_patient_received}
                  onChange={handleChange}
                  error={errors?.time_patient_received ?? ""}
                />
              </View>
            </FormSection>

            {/* Post Operative Instructions & Monitors Merged Card */}
            <FormSection
              title="Post Operative Instructions & Monitors"
              icon={Activity}
            >
              <View className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                {/* Left Side: Instructions */}
                <View className="pr-4">
                  <Text className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase mb-3">
                    Post Operative Instructions
                  </Text>
                  <Text className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
                    Routinely Check the following every 5 to 10 minutes
                  </Text>
                </View>

                {/* Right Side: Monitors */}
                <View className="pl-0 md:pl-8">
                  <Text className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase mb-3">
                    Monitors
                  </Text>
                  <CheckboxGroup
                    name="monitors"
                    options={[
                      "ECG",
                      "NIBP",
                      "SpO2",
                      "ABP",
                      "CVP",
                      "Urine Output",
                      "Pulse Rate",
                      "Blood Pressure",
                      "Respiration",
                    ]}
                    selected={values?.monitors}
                    onChange={(newSelected) =>
                      onSetHandler("monitors", newSelected)
                    }
                    error={errors?.monitors ?? ""}
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
                name="post_operative_complications"
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
                selected={values?.post_operative_complications}
                onChange={(newSelected) =>
                  onSetHandler("post_operative_complications", newSelected)
                }
                error={errors?.post_operative_complications ?? ""}
              />
            </FormSection>

            {/* Medications */}
            <FormSection title="Post Operative Medications" icon={Pill}>
              <View className="space-y-2">
                {values?.post_operative_medications &&
                  (values?.post_operative_medications?.length > 0
                    ? values.post_operative_medications
                    : []
                  ).map((med: string, idx: number) => (
                    <View key={idx} className="flex items-center gap-2">
                      <Text className="text-xs font-bold text-slate-400 w-5 shrink-0">
                        {idx + 1}.
                      </Text>
                      <Input
                        value={med}
                        onChange={(e) => {
                          const arr = [
                            ...(values?.post_operative_medications || []),
                          ];
                          arr[idx] = e.target.value;
                          onSetHandler("post_operative_medications", arr);
                        }}
                        className="bg-white dark:bg-slate-800 flex-1"
                        placeholder="Enter medication..."
                      />
                      {/* Remove row — only show if more than 1 row */}
                      {(values?.post_operative_medications?.length ?? 1) >
                        1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const arr = [
                              ...(values?.post_operative_medications || []),
                            ];
                            arr.splice(idx, 1);
                            onSetHandler("post_operative_medications", arr);
                          }}
                          className="text-red-400 hover:text-red-600 text-lg leading-none px-1"
                          title="Remove"
                        >
                          ×
                        </button>
                      )}
                    </View>
                  ))}
                <button
                  type="button"
                  onClick={() => {
                    const arr = [
                      ...(values?.post_operative_medications || [""]),
                    ];
                    arr.push("");
                    onSetHandler("post_operative_medications", arr);
                  }}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  + Add Medication
                </button>
              </View>
            </FormSection>

            {/* Recovery Score Grid (Aldrete or similar) */}
            <FormSection title="Recovery Score" icon={ClipboardList}>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <View className="flex items-center justify-between">
                  <Text className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Patient's Score on Admission to Recovery:
                  </Text>
                  <View className="flex items-center gap-2">
                    <Input
                      className="w-16 h-8 bg-white dark:bg-slate-800 dark:text-slate-100 text-center font-bold"
                      placeholder="0"
                      value={values?.patient_score_on_admission}
                      onChange={(e) =>
                        onSetHandler(
                          "patient_score_on_admission",
                          e.target.value,
                        )
                      }
                      error={errors?.patient_score_on_admission ?? ""}
                    />
                    <Text className="font-bold text-slate-400">/ 14</Text>
                  </View>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Patient's Score on Before Transfer:
                  </Text>
                  <View className="flex items-center gap-2">
                    <Input
                      className="w-16 h-8 bg-white dark:bg-slate-800 dark:text-slate-100 text-center font-bold"
                      placeholder="0"
                      value={values?.patient_score_before_transfer}
                      onChange={(e) =>
                        onSetHandler(
                          "patient_score_before_transfer",
                          e.target.value,
                        )
                      }
                      error={errors?.patient_score_before_transfer ?? ""}
                    />
                    <Text className="font-bold text-slate-400">/ 14</Text>
                  </View>
                </View>
              </View>
            </FormSection>

            {/* Vitals Monitoring - Using DynamicFormGroup */}
            <FormSection title="Vitals Monitoring" icon={Clock}>
              <View className="-mx-5">
                <DynamicFormGroup
                  title=""
                  entryLabel="Observation"
                  className="border-0 !shadow-none"
                  data={values?.vital_monitoring || []}
                  onChange={(newData) =>
                    onSetHandler("vital_monitoring", newData)
                  }
                  minGroups={0}
                  gridCols={5}
                  fields={[
                    {
                      key: "time",
                      label: "Time",
                      type: "text",
                      placeholder: "HH:MM",
                      colSpan: 1,
                      componentProps: {
                        type: "time",
                      },
                    },
                    {
                      key: "consciousness",
                      label: "Consciousness",
                      type: "text",
                      placeholder: "Level",
                      colSpan: 1,
                    },
                    {
                      key: "respiration",
                      label: "Respiration",
                      type: "text",
                      placeholder: "Rate",
                      colSpan: 1,
                    },
                    {
                      key: "pulseRate",
                      label: "Pulse Rate",
                      type: "text",
                      placeholder: "BPM",
                      colSpan: 1,
                    },
                    {
                      key: "spo2",
                      label: "SpO2",
                      type: "text",
                      placeholder: "%",
                      colSpan: 1,
                    },
                    // {
                    //   key: "bp",
                    //   label: "BP",
                    //   type: "text",
                    //   placeholder: "Sys/Dia",
                    //   colSpan: 1,
                    // },
                    {
                      key: "remarks",
                      label: "Remarks",
                      type: "text",
                      placeholder: "Notes",
                      colSpan: 6,
                    },
                  ]}
                />
              </View>
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
                      name="transfer_to"
                      options={[
                        { label: "Ward", value: "Ward" },
                        { label: "MICU", value: "MICU" },
                        { label: "PICU", value: "PICU" },
                        { label: "NSICU", value: "NSICU" },
                        { label: "NICU", value: "NICU" },
                        { label: "CCU", value: "CCU" },
                      ]}
                      value={values?.transfer_to}
                      onChange={(val) => onSetHandler("transfer_to", val)}
                      variant="button"
                      size="small"
                      error={errors?.transfer_to ?? ""}
                    />
                  </View>
                  <View>
                    <Input
                      label="Time of Transfer"
                      type="time"
                      value={values?.time_of_transfer || ""}
                      onChange={(e) =>
                        onSetHandler("time_of_transfer", e.target.value)
                      }
                      error={errors?.time_of_transfer ?? ""}
                    />
                  </View>
                </View>

                <View className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <Text className="text-xs font-bold text-slate-500 mb-3 uppercase">
                    Vitals at Shifting
                  </Text>
                  <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                      label="Pulse"
                      value={values?.pulse_at_shifting}
                      onChange={(e) =>
                        onSetHandler("pulse_at_shifting", e.target.value)
                      }
                      placeholder="e.g. 78"
                      className="bg-white dark:bg-slate-800"
                      error={errors?.pulse_at_shifting ?? ""}
                    />
                    <Input
                      label="SBP"
                      value={values?.sbp_at_shifting}
                      onChange={(e) =>
                        onSetHandler("sbp_at_shifting", e.target.value)
                      }
                      placeholder="e.g. 120"
                      className="bg-white dark:bg-slate-800"
                      error={errors?.sbp_at_shifting ?? ""}
                    />
                    <Input
                      label="DBP"
                      value={values?.dbp_at_shifting}
                      onChange={(e) =>
                        onSetHandler("dbp_at_shifting", e.target.value)
                      }
                      placeholder="e.g. 80"
                      className="bg-white dark:bg-slate-800"
                      error={errors?.dbp_at_shifting ?? ""}
                    />
                    <Input
                      label="RR"
                      value={values?.rr_at_shifting}
                      onChange={(e) =>
                        onSetHandler("rr_at_shifting", e.target.value)
                      }
                      placeholder="e.g. 16"
                      className="bg-white dark:bg-slate-800"
                      error={errors?.rr_at_shifting ?? ""}
                    />
                  </View>
                </View>

                <View>
                  <Textarea
                    label="Post-Operative Instructions"
                    value={values?.post_operative_instructions || ""}
                    onChange={handleChange}
                    name="post_operative_instructions"
                    className="bg-white dark:bg-slate-800 min-h-[100px]"
                    placeholder="02 mask / ETT + Spont / ETT + Ventilator etc..."
                    error={errors?.post_operative_instructions ?? ""}
                  />
                </View>
              </View>
            </FormSection>
          </View>
        </CollapsibleContainer>
        <View className="p-4 mt-4 space-y-4">
          <Textarea
            label="Summary"
            name="summary"
            value={values?.summary || ""}
            onChange={handleChange}
            className="min-h-[100px]"
            labelClassName="!font-bold"
            placeholder="Enter recovery observation summary..."
            error={errors?.summary ?? ""}
          />
          <View className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : "Submit Anaesthesia Recovery Observation Form"}
            </Button>
          </View>
        </View>
      </form>
    </>
  );
};

export default RecoveryObsForm;
