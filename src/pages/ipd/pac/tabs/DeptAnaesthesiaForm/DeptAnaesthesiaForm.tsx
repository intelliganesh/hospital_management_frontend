import React, { useEffect, useMemo, useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import CheckBox from "@/components/CheckBox";
import RadioGroup from "@/components/RadioGroup";
import Button from "@/components/button";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import FormSection from "../../components/FormSection";
import CheckboxGroup from "../../components/CheckboxGroup";
import {
  User,
  Shield,
  Activity,
  Wind,
  Syringe,
  HeartPulse,
  Droplets,
  FileText,
  Plus,
  X,
} from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import Upload from "@/components/Upload";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import {
  departmentOfAnaesthesiaAdd,
  departmentOfAnaesthesiaDetails,
} from "@/interfaces/ipd/anaesthesia/departmentOfAnaesthesia";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import { useDepartmentOfAnaesthesia } from "@/actions/calls/ipd/anaesthesia/departmentOfAnaesthesia";
import { imageUpload } from "@/actions/calls/uesImage";
import { toast } from "@/utils/custom-hooks/use-toast";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import { validationForm } from "./DeptAnaesthesiaFormValidation";

const DeptAnaesthesiaForm: React.FC = () => {
  const anaesthesiaData =
    (useSelector(
      (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
    ) as AnaesthesiaDetails) || null;

  const departmentOfAnaesthesiaData =
    (useSelector(
      (state: RootState) =>
        state.departmentOfAnaesthesia.DepartmentOfAnaesthesiaDetails,
    ) as departmentOfAnaesthesiaDetails) || null;

  const departmentOfAnaesthesiaRecordId = departmentOfAnaesthesiaData?.id || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const needStringify = [
    "pre_anaesthesia_state",
    "ventilated_patient",
    "patient_safety",
    "pre_oxygenation",
    "laryngoscopy",
    "mask_anaesthesia",
    "maintenance",
    "iv_access",
    "central_blocks_spinal",
    "central_blocks_epidural",
    "regional_blocks",
    "nerve_stimulator",
    "drugs_regional",
    "regional_supplements",
    "endotracheal_tube",
    "airway",
    "monitoring",
    "endotracheal_tube_type",
  ];

  // Parse JSON strings from server back to arrays/objects.
  // useMemo ensures this only runs when the Redux data changes, not on every render.
  // typeof guard prevents crashing when values are already parsed arrays.
  const parsedData = useMemo(() => {
    if (!departmentOfAnaesthesiaData) return departmentOfAnaesthesiaData;
    const copy = { ...departmentOfAnaesthesiaData } as any;
    needStringify.forEach((key) => {
      const val = copy[key];
      if (typeof val === "string") {
        try {
          copy[key] = JSON.parse(val);
        } catch {
          // leave as-is if not valid JSON
        }
      }
    });
    return copy as departmentOfAnaesthesiaAdd;
  }, [departmentOfAnaesthesiaData]);

  const { values, handleChange, onSetHandler } =
    useForm<departmentOfAnaesthesiaAdd>(parsedData);

  const {
    addDepartmentOfAnaesthesiaHandler,
    departmentOfAnaesthesiaDetailsHandler,
    editDepartmentOfAnaesthesiaHandler,
  } = useDepartmentOfAnaesthesia();

  const handleUpload = () => {
    const uploadData = {
      id: departmentOfAnaesthesiaRecordId || "",
      modal_type: "ipd_department_anaesthesia",
      file_name: "upload_pdf_path",
      folder_name: "ipd_department_anaesthesia",
      image: values?.upload_pdf_path || "",
    };

    imageUpload(uploadData, (uploadSuccess: boolean) => {
      if (uploadSuccess) {
        toast({
          title: "Success!",
          description:
            "Department of Anaesthesia Record file uploaded successfully!.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description:
            "Failed to upload Department of Anaesthesia Record file.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (anaesthesiaData?.id) {
      departmentOfAnaesthesiaDetailsHandler(anaesthesiaData?.id, () => { });
    }
  }, [anaesthesiaData?.id]);

  const SubHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
    <View className="flex items-center gap-2 mb-3 mt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
      {Icon && <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
      <Text className="text-xs font-bold uppercase text-slate-500 tracking-wider">
        {title}
      </Text>
    </View>
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let DepartmentOfAnaesthesiaFormObj: Partial<departmentOfAnaesthesiaAdd> = {
      ...values,
    };

    try {
      DepartmentOfAnaesthesiaFormObj = {
        ...DepartmentOfAnaesthesiaFormObj,
        ipd_id: anaesthesiaData?.ipd_id,
        ipd_surgery_id: anaesthesiaData?.ipd_surgery_id,
        ipd_anaesthesia_id: anaesthesiaData?.id,
      };

      delete DepartmentOfAnaesthesiaFormObj["upload_pdf_path"];

      needStringify.forEach((key) => {
        const k = key as keyof departmentOfAnaesthesiaAdd;
        if (
          DepartmentOfAnaesthesiaFormObj[k] !== undefined &&
          DepartmentOfAnaesthesiaFormObj[k] !== null
        ) {
          (DepartmentOfAnaesthesiaFormObj as any)[k] = JSON.stringify(
            DepartmentOfAnaesthesiaFormObj[k],
          );
        }
      });

      await validationForm.validate(DepartmentOfAnaesthesiaFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);

      if (departmentOfAnaesthesiaData?.id) {
        editDepartmentOfAnaesthesiaHandler(
          anaesthesiaData?.id,
          // departmentOfAnaesthesiaData?.ipd_surgery_id,
          DepartmentOfAnaesthesiaFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Department Of Anaesthesia form updated successfully.",
                variant: "success",
              });
            } else {
              toast({
                title: "Error!",
                description: "Failed to update Department Of Anaesthesia form",
                variant: "destructive",
              });
            }
          },
        );
      } else {
        addDepartmentOfAnaesthesiaHandler(
          DepartmentOfAnaesthesiaFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Department Of Anaesthesia form saved successfully.",
                variant: "success",
              });

              departmentOfAnaesthesiaDetailsHandler(
                anaesthesiaData?.id,
                () => { },
              );
            } else {
              toast({
                title: "Error!",
                description: "Failed to save Department Of Anaesthesia form",
                variant: "destructive",
              });
            }
            setIsSubmitting(false);
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
              label="Upload Filled Department of Anaesthesia Form"
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
        <View className="my-6 border-t border-slate-200" />

        <CollapsibleContainer
          title="Anaesthesia Fields"
          defaultOpen={false}
          variant="default"
          headerClassName="rounded-t-lg"
          containerClassName="shadow-none"
          contentClassName="space-y-6 animate-in fade-in duration-500"
        >
          <View className="space-y-6 animate-in fade-in duration-500">
            {/* Pre-Anaesthesia State */}
            <FormSection
              title="Pre-Anaesthesia State"
              icon={User}
              titleClassName="!font-bold"
            >
              <View className="space-y-4">
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Status
                  </Text>
                  <CheckboxGroup
                    name="pre_anaesthesia_state"
                    options={[
                      "Awake",
                      "Apprehensive",
                      "Uncooperative",
                      "Calm",
                      "Asleep",
                      "Confused",
                      "Unresponsive",
                      "GCS",
                    ]}
                    selected={
                      values?.pre_anaesthesia_state
                        ? typeof values?.pre_anaesthesia_state === "string"
                          ? JSON.parse(values?.pre_anaesthesia_state)
                          : values?.pre_anaesthesia_state
                        : []
                    }
                    onChange={(newSelected) =>
                      onSetHandler("pre_anaesthesia_state", newSelected)
                    }
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    error={errors?.pre_anaesthesia_state || ""}
                  />
                </View>
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Ventilated Patient
                  </Text>
                  <CheckboxGroup
                    name="ventilated_patient"
                    options={["VIA ETT", "VIA Tracheostomy"]}
                    selected={values?.ventilated_patient ?? []}
                    onChange={(newSelected) =>
                      onSetHandler("ventilated_patient", newSelected)
                    }
                    // readOnly={readOnly}
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    error={errors?.ventilated_patient || ""}
                  />
                </View>
                <View className="max-w-xs">
                  <Input
                    label="NPO Status"
                    value={values?.npo_status ?? ""}
                    onChange={handleChange}
                    name="npo_status"
                    className="bg-slate-50 dark:bg-slate-800/50"
                    placeholder="e.g. NPO since midnight"
                    error={errors?.npo_status || ""}
                  />
                </View>
              </View>
            </FormSection>

            {/* Patient Safety */}
            <FormSection title="Patient Safety" icon={Shield}>
              <CheckboxGroup
                name="patient_safety"
                options={[
                  "Anaes. Machine Checked",
                  "Pressure Points Checked",
                  "Eye Care",
                  "Ointment",
                  "Eye Pad",
                ]}
                selected={values?.patient_safety}
                onChange={(newSelected) =>
                  onSetHandler("patient_safety", newSelected)
                }
                className="flex flex-wrap gap-x-4 gap-y-2"
                itemClassName="text-sm text-slate-700 dark:text-slate-200"
                error={errors?.patient_safety || ""}
              />
            </FormSection>

            {/* General Anaesthetic Technique (Merged Card) */}
            <FormSection title="General Anaesthetic Technique" icon={Activity}>
              {/* General Section */}
              <View className="mb-6">
                <Text className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  GENERAL:{" "}
                  <Text
                    as="span"
                    className="font-normal text-slate-600 dark:text-slate-300"
                  >
                    Pre-Oxygenation
                  </Text>
                </Text>

                <View className="mt-4 space-y-3">
                  <Text className="text-xs font-bold text-slate-500 uppercase">
                    Induction
                  </Text>
                  <RadioGroup
                    name="induction"
                    options={[
                      { label: "Intravenous", value: "Intravenous" },
                      { label: "Inhalational", value: "Inhalational" },
                    ]}
                    value={values?.induction ?? ""}
                    onChange={(val) => onSetHandler("induction", val)}
                    variant="button"
                    size="small"
                    error={errors?.induction || ""}
                  />

                  {/* Conditional Fields */}
                  {/* {(values?.induction === "Intravenous" ||
                  values?.induction === "Inhalational") && ( */}
                  <View className="flex gap-4 mt-2 animate-in fade-in slide-in-from-top-1">
                    <CheckboxGroup
                      name="pre_oxygenation"
                      options={["Rapid Sequence", "Cricoid Pressure"]}
                      selected={values?.pre_oxygenation}
                      onChange={(newSelected) =>
                        onSetHandler("pre_oxygenation", newSelected)
                      }
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                      error={errors?.pre_oxygenation || ""}
                    />
                    {/* <View className="flex items-center gap-2">
                    <CheckBox
                      checked={values?.ga_rapid_sequence || false}
                      onChange={() =>
                        onSetHandler(
                          "ga_rapid_sequence",
                          !values?.ga_rapid_sequence,
                        )
                      }
                      disabled={readOnly}
                    />
                    <Text className="text-sm">Rapid Sequence</Text>
                  </View>
                  <View className="flex items-center gap-2">
                    <CheckBox
                      checked={values?.ga_cricoid_pressure || false}
                      onChange={() =>
                        onSetHandler(
                          "ga_cricoid_pressure",
                          !values?.ga_cricoid_pressure,
                        )
                      }
                      disabled={readOnly}
                    />
                    <Text className="text-sm">Cricoid Pressure</Text>
                  </View> */}
                  </View>
                  {/* )} */}
                </View>
              </View>

              {/* Airway Management Sub-Section */}
              <SubHeader title="Airway Management" icon={Wind} />
              <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Col 1: Laryngoscopy */}
                <View className="border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Laryngoscopy
                  </Text>
                  <CheckboxGroup
                    name="laryngoscopy"
                    options={[
                      "Direct",
                      "Fibre Optic Scope",
                      "Blind",
                      "Others",
                      "Difficult Intubation",
                    ]}
                    selected={values?.laryngoscopy}
                    onChange={(newSelected) =>
                      onSetHandler("laryngoscopy", newSelected)
                    }
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    error={errors?.laryngoscopy || ""}
                  />
                </View>

                {/* ETT */}
                <View className="border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Endo Tracheal Tube
                  </Text>
                  {/* Route: Oral / Nasal / Cuff */}
                  <View className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                    <CheckboxGroup
                      name="endotracheal_tube"
                      options={["Oral", "Nasal", "Cuff"]}
                      selected={(values?.endotracheal_tube || []).filter((v) =>
                        ["Oral", "Nasal", "Cuff"].includes(v),
                      )}
                      onChange={(newSelected) => {
                        const rest = (values?.endotracheal_tube || []).filter(
                          (v) => !["Oral", "Nasal", "Cuff"].includes(v),
                        );
                        onSetHandler("endotracheal_tube", [
                          ...rest,
                          ...newSelected,
                        ]);
                      }}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                  </View>
                  {/* Size & Fixed At */}
                  <View className="flex flex-wrap gap-4 items-center my-4">
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={
                          values?.endotracheal_tube?.includes("Size") || false
                        }
                        onChange={() => {
                          const arr = values?.endotracheal_tube || [];
                          onSetHandler(
                            "endotracheal_tube",
                            arr.includes("Size")
                              ? arr.filter((v) => v !== "Size")
                              : [...arr, "Size"],
                          );
                        }}
                      />
                      <Text className="text-sm">Size</Text>
                      {values?.endotracheal_tube?.includes("Size") && (
                        <Input
                          className="w-16 h-7"
                          placeholder="mm"
                          value={values?.endotracheal_tube_size || ""}
                          onChange={(e) =>
                            onSetHandler(
                              "endotracheal_tube_size",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </View>
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={
                          values?.endotracheal_tube?.includes("Fixed At") ||
                          false
                        }
                        onChange={() => {
                          const arr = values?.endotracheal_tube || [];
                          onSetHandler(
                            "endotracheal_tube",
                            arr.includes("Fixed At")
                              ? arr.filter((v) => v !== "Fixed At")
                              : [...arr, "Fixed At"],
                          );
                        }}
                      />
                      <Text className="text-sm">Fixed At</Text>
                      {values?.endotracheal_tube?.includes("Fixed At") && (
                        <Input
                          className="w-16 h-7"
                          placeholder="cm"
                          value={values?.endotracheal_tube_fixed_at || ""}
                          onChange={(e) =>
                            onSetHandler(
                              "endotracheal_tube_fixed_at",
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </View>
                  </View>

                  <CheckboxGroup
                    label="ETT Type"
                    name="endotracheal_tube_type"
                    options={[
                      "Regular",
                      "Reinforced",
                      "RAE",
                      "MLS Tube",
                      "Endobronchial",
                      "Laser",
                    ]}
                    selected={values?.endotracheal_tube_type}
                    // selected={(values?.endotracheal_tube || []).filter((v) =>
                    //   [
                    //     "Regular",
                    //     "Reinforced",
                    //     "RAE",
                    //     "MLS Tube",
                    //     "Endobronchial",
                    //     "Laser",
                    //   ].includes(v),
                    // )}
                    onChange={(newSelected) => {
                      onSetHandler("endotracheal_tube_type", newSelected);
                    }}
                    // onChange={(newSelected) => {
                    //   const rest = (values?.endotracheal_tube || []).filter(
                    //     (v) =>
                    //       ![
                    //         "Regular",
                    //         "Reinforced",
                    //         "RAE",
                    //         "MLS Tube",
                    //         "Endobronchial",
                    //         "Laser",
                    //       ].includes(v),
                    //   );
                    //   onSetHandler("endotracheal_tube", [
                    //     ...rest,
                    //     ...newSelected,
                    //   ]);
                    // }}
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                  />
                  {errors?.endotracheal_tube_type && (
                    <Text className="text-xs text-red-500 mt-1">
                      {errors?.endotracheal_tube_type || ""}
                    </Text>
                  )}
                </View>

                {/* Airway */}
                <View className="border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Airway
                  </Text>
                  <View className="flex flex-wrap gap-4 items-center">
                    <CheckboxGroup
                      name="airway"
                      options={["Oral", "Nasal", "LMA", "I-Gel"]}
                      selected={(values?.airway || []).filter(
                        (v) => v !== "Size",
                      )}
                      onChange={(newSelected) => {
                        const sizeEntry = (values?.airway || []).includes(
                          "Size",
                        )
                          ? ["Size"]
                          : [];
                        onSetHandler("airway", [...newSelected, ...sizeEntry]);
                      }}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.airway?.includes("Size") || false}
                        onChange={() => {
                          const arr = values?.airway || [];
                          onSetHandler(
                            "airway",
                            arr.includes("Size")
                              ? arr.filter((v) => v !== "Size")
                              : [...arr, "Size"],
                          );
                        }}
                      />
                      <Text className="text-sm">Size</Text>
                      {values?.airway?.includes("Size") && (
                        <Input
                          className="w-16 h-7"
                          placeholder="mm"
                          value={values?.airway_size || ""}
                          onChange={(e) =>
                            onSetHandler("airway_size", e.target.value)
                          }
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Mask Anaesthesia */}
                <View className="border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Mask Anaesthesia
                  </Text>
                  <CheckboxGroup
                    name="mask_anaesthesia"
                    options={["Nasal Cannula", "Oxygen Mask"]}
                    selected={values?.mask_anaesthesia}
                    onChange={(newSelected) =>
                      onSetHandler("mask_anaesthesia", newSelected)
                    }
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                  />
                  {/* <View className="flex flex-wrap gap-4 items-center mb-3">
                  {["Nasal Cannula", "Oxygen Mask"].map((opt) => (
                    <View
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        !readOnly && toggleSelection("airway_mask_opts", opt)
                      }
                    >
                      <CheckBox
                        checked={values?.airway_mask_opts?.includes(opt)}
                        onChange={() =>
                          !readOnly && toggleSelection("airway_mask_opts", opt)
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">{opt}</Text>
                    </View>
                  ))}
                </View> */}
                  <View className="flex flex-wrap gap-4 items-center mt-2">
                    <Text className="text-sm font-semibold">Throat Pack:</Text>
                    <RadioGroup
                      name="throat_pack"
                      options={[
                        { label: "Inserted", value: "Inserted" },
                        { label: "Removed", value: "Removed" },
                      ]}
                      value={values?.throat_pack ?? ""}
                      onChange={(val) => onSetHandler("throat_pack", val)}
                      variant="button"
                      size="small"
                    />
                  </View>
                </View>

                {/* Nasogastric Tube */}
                <View className="flex flex-wrap gap-4 items-center border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 uppercase">
                    Nasogastric Tube:
                  </Text>
                  <RadioGroup
                    name="nasogastric_tube"
                    options={[
                      { label: "Inserted", value: "Inserted" },
                      { label: "Removed", value: "Removed" },
                    ]}
                    value={values?.nasogastric_tube ?? ""}
                    onChange={(val) => onSetHandler("nasogastric_tube", val)}
                    variant="button"
                    size="small"
                  />
                </View>

                {/* Maintenance (keeping as per request flow, though arguably separate) */}
                <View className="flex flex-wrap gap-4 items-center border-b border-border pb-2">
                  <Text className="text-xs font-bold text-slate-500 uppercase">
                    Maintenance
                  </Text>
                  <CheckboxGroup
                    name="maintenance"
                    options={["Inhalational", "TIVA", "Regional"]}
                    selected={values?.maintenance}
                    onChange={(newSelected) =>
                      onSetHandler("maintenance", newSelected)
                    }
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                  />
                </View>
              </View>

              {/* IV Access Sub-Section */}
              <SubHeader title="IV Access" icon={Syringe} />
              <View className="space-y-4">
                <View className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-1">
                  <div className="col-span-1 text-center">No</div>
                  <div className="col-span-4">Site</div>
                  <div className="col-span-2">Size (G)</div>
                  <div className="col-span-4">Location</div>
                  <div className="col-span-1"></div>
                </View>
                {(values?.iv_access || []).map((iv, index) => (
                  <View
                    key={iv?.id || index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-1 text-center text-slate-400 font-bold">
                      #{index + 1}
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="e.g. Right Hand"
                        value={iv.site}
                        onChange={(e) => {
                          const arr = [...(values?.iv_access || [])];
                          arr[index].site = e.target.value;
                          onSetHandler("iv_access", arr);
                        }}
                      // className="h-8"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="e.g. 18G"
                        value={iv.size}
                        onChange={(e) => {
                          const arr = [...(values?.iv_access || [])];
                          arr[index].size = e.target.value;
                          onSetHandler("iv_access", arr);
                        }}
                      // className="h-8"
                      />
                    </div>
                    <div className="col-span-4 flex items-center">
                      <RadioGroup
                        name={`iv_loc_${iv.id}`}
                        options={[
                          { label: "OT", value: "OT" },
                          { label: "Ward", value: "Ward" },
                        ]}
                        value={iv.location}
                        onChange={(val) => {
                          const arr = [...(values?.iv_access || [])];
                          arr[index].location = val;
                          onSetHandler("iv_access", arr);
                        }}
                        variant="button"
                        size="small"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="small"
                        type="button"
                        className="text-red-500 p-1 h-7 w-7"
                        onPress={() => {
                          const arr = (values?.iv_access || []).filter(
                            (_, i) => i !== index,
                          );
                          onSetHandler("iv_access", arr);
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </View>
                ))}
                <Button
                  variant="primary"
                  size="small"
                  className="flex"
                  onPress={() =>
                    onSetHandler("iv_access", [
                      ...(values?.iv_access || []),
                      {
                        id: Date.now().toString(),
                        site: "",
                        size: "",
                        location: "",
                      },
                    ])
                  }
                >
                  <Plus size={14} className="mr-1" /> Add Line
                </Button>
              </View>
            </FormSection>

            {/* Regional Anaesthesia */}
            <FormSection
              title="Regional Anaesthesia / Analgesia"
              icon={Activity}
            >
              <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Blocks */}
                <View className="space-y-8">
                  {/* Central Blocks */}
                  <View>
                    <Text className="text-xs font-bold text-slate-500 mb-3 uppercase">
                      Central Blocks
                    </Text>
                    <View className="space-y-4">
                      {/* SPINAL */}
                      <View className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-700">
                        <Text className="font-bold text-sm mb-2">SPINAL</Text>
                        <View className="flex flex-wrap gap-4 items-center">
                          <View className="flex items-center gap-2">
                            <CheckBox
                              checked={
                                values?.central_blocks_spinal?.includes(
                                  "Needle G",
                                ) || false
                              }
                              onChange={() => {
                                const arr = values?.central_blocks_spinal || [];
                                onSetHandler(
                                  "central_blocks_spinal",
                                  arr.includes("Needle G")
                                    ? arr.filter((v) => v !== "Needle G")
                                    : [...arr, "Needle G"],
                                );
                              }}
                            />
                            <Text className="text-sm">Needle G</Text>
                            {values?.central_blocks_spinal?.includes(
                              "Needle G",
                            ) && (
                                <Input
                                  className="w-16 h-7"
                                  placeholder="G"
                                  value={
                                    values?.central_blocks_spinal_needle_g || ""
                                  }
                                  onChange={(e) =>
                                    onSetHandler(
                                      "central_blocks_spinal_needle_g",
                                      e.target.value,
                                    )
                                  }
                                />
                              )}
                          </View>
                          {["Catheter", "Single", "Cont."].map((opt) => (
                            <View key={opt} className="flex items-center gap-2">
                              <CheckBox
                                checked={
                                  values?.central_blocks_spinal?.includes(
                                    opt,
                                  ) || false
                                }
                                onChange={() => {
                                  const arr =
                                    values?.central_blocks_spinal || [];
                                  onSetHandler(
                                    "central_blocks_spinal",
                                    arr.includes(opt)
                                      ? arr.filter((v) => v !== opt)
                                      : [...arr, opt],
                                  );
                                }}
                              />
                              <Text className="text-sm">{opt}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* EPIDURAL */}
                      <View className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-700">
                        <Text className="font-bold text-sm mb-2">EPIDURAL</Text>
                        <View className="flex flex-wrap gap-4 items-center">
                          <View className="flex items-center gap-2">
                            <CheckBox
                              checked={
                                values?.central_blocks_epidural?.includes(
                                  "Needle G",
                                ) || false
                              }
                              onChange={() => {
                                const arr =
                                  values?.central_blocks_epidural || [];
                                onSetHandler(
                                  "central_blocks_epidural",
                                  arr.includes("Needle G")
                                    ? arr.filter((v) => v !== "Needle G")
                                    : [...arr, "Needle G"],
                                );
                              }}
                            />
                            <Text className="text-sm">Needle G</Text>
                            {values?.central_blocks_epidural?.includes(
                              "Needle G",
                            ) && (
                                <Input
                                  className="w-16 h-7"
                                  placeholder="G"
                                  value={values?.central_blocks_epidural_g || ""}
                                  onChange={(e) =>
                                    onSetHandler(
                                      "central_blocks_epidural_g",
                                      e.target.value,
                                    )
                                  }
                                />
                              )}
                          </View>
                          {["Catheter", "Single", "Cont."].map((opt) => (
                            <View key={opt} className="flex items-center gap-2">
                              <CheckBox
                                checked={
                                  values?.central_blocks_epidural?.includes(
                                    opt,
                                  ) || false
                                }
                                onChange={() => {
                                  const arr =
                                    values?.central_blocks_epidural || [];
                                  onSetHandler(
                                    "central_blocks_epidural",
                                    arr.includes(opt)
                                      ? arr.filter((v) => v !== opt)
                                      : [...arr, opt],
                                  );
                                }}
                              />
                              <Text className="text-sm">{opt}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                      Regional Blocks
                    </Text>
                    <CheckboxGroup
                      name="regional_blocks"
                      options={[
                        "Brachial Plexus",
                        "Sciatic",
                        "Femoral",
                        "Ankle",
                        "Caudal",
                        "Local",
                      ]}
                      selected={values?.regional_blocks}
                      onChange={(newSelected) =>
                        onSetHandler("regional_blocks", newSelected)
                      }
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                  </View>

                  <View>
                    <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                      Others
                    </Text>
                    <CheckboxGroup
                      name="nerve_stimulator"
                      options={[
                        "Nerve Stimulator",
                        "Yes",
                        "No",
                        "Effect",
                        "Complete",
                        "Incomplete",
                        "Supplements",
                        "GA",
                        "Sedation",
                        "Complication",
                      ]}
                      selected={values?.nerve_stimulator}
                      onChange={(newSelected) =>
                        onSetHandler("nerve_stimulator", newSelected)
                      }
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                    {/* <View className="flex flex-wrap gap-4 items-center">
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.regional_other_opts?.includes(
                          "Nerve Stimulator",
                        )}
                        onChange={() =>
                          !readOnly &&
                          toggleSelection(
                            "regional_other_opts",
                            "Nerve Stimulator",
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">Nerve Stimulator</Text>
                    </View>
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.regional_nerve_stim_yes || false}
                        onChange={() =>
                          onSetHandler(
                            "regional_nerve_stim_yes",
                            !values?.regional_nerve_stim_yes,
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">Yes</Text>
                    </View>
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.regional_nerve_stim_no || false}
                        onChange={() =>
                          onSetHandler(
                            "regional_nerve_stim_no",
                            !values?.regional_nerve_stim_no,
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">No</Text>
                    </View>
                  </View>
                  <View className="mt-2">
                    <CheckboxGroup
                      options={[
                        "Effect",
                        "Complete",
                        "Incomplete",
                        "Supplements",
                        "GA",
                        "Sedation",
                        "Complication",
                      ]}
                      selected={values?.regional_other_opts}
                      onToggle={(val, checked) =>
                        toggleSelection("regional_other_opts", val)
                      }
                      readOnly={readOnly}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                  </View> */}
                  </View>
                </View>

                {/* Right Column: Drugs (Checkbox Controlled) */}
                <View>
                  <View className="mb-3">
                    <Text className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Drugs
                    </Text>
                    <CheckboxGroup
                      name="drugs_regional"
                      options={["Lignocaine", "Bupivacaine"]}
                      selected={values?.drugs_regional}
                      onChange={(newSelected) => {
                        // Normalise prevList: handles array, JSON string, or undefined
                        const rawSupplements = values?.regional_supplements;
                        const prevList: {
                          name?: string;
                          conc?: string;
                          vol?: string;
                        }[] = Array.isArray(rawSupplements)
                            ? rawSupplements
                            : typeof rawSupplements === "string"
                              ? (() => {
                                try {
                                  const p = JSON.parse(rawSupplements);
                                  return Array.isArray(p) ? p : [];
                                } catch {
                                  return [];
                                }
                              })()
                              : [];

                        const prevSelected: string[] = Array.isArray(
                          values?.drugs_regional,
                        )
                          ? values.drugs_regional
                          : [];

                        const updatedList = newSelected.map((name) => {
                          // 1. Find by name field (normal case)
                          const byName = prevList.find((d) => d.name === name);
                          if (byName) return byName;
                          // 2. Positional fallback (if name field was missing)
                          const oldIdx = prevSelected.indexOf(name);
                          if (oldIdx >= 0 && prevList[oldIdx])
                            return { ...prevList[oldIdx], name };
                          // 3. New entry
                          return { name, conc: "", vol: "" };
                        });

                        onSetHandler("drugs_regional", newSelected);
                        onSetHandler("regional_supplements", updatedList);
                      }}
                      className="flex flex-wrap gap-x-4 gap-y-2"
                      itemClassName="text-sm text-slate-700 dark:text-slate-200"
                    />
                    {/* <View className="flex gap-4 mb-3">
                    <View
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        !readOnly && toggleDrugSelection("Lignocaine")
                      }
                    >
                      <CheckBox
                        checked={
                          values?.selected_drugs?.includes("Lignocaine") ||
                          false
                        }
                        onChange={() =>
                          !readOnly && toggleDrugSelection("Lignocaine")
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm font-medium">Lignocaine</Text>
                    </View>
                    <View
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        !readOnly && toggleDrugSelection("Bupivacaine")
                      }
                    >
                      <CheckBox
                        checked={
                          values?.selected_drugs?.includes("Bupivacaine") ||
                          false
                        }
                        onChange={() =>
                          !readOnly && toggleDrugSelection("Bupivacaine")
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm font-medium">Bupivacaine</Text>
                    </View>
                  </View> */}
                  </View>
                  <View className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800/50">
                    <View className="grid grid-cols-12 bg-slate-100 dark:bg-slate-700 p-2 text-xs font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600">
                      <div className="col-span-1">No.</div>
                      <div className="col-span-6">Drug Name</div>
                      <div className="col-span-3">Conc.</div>
                      <div className="col-span-2">Vol.</div>
                    </View>
                    {values?.drugs_regional &&
                      values?.drugs_regional.length > 0 &&
                      (values?.drugs_regional || []).map((_drug, idx) => (
                        <View
                          key={idx}
                          className="grid grid-cols-12 p-2 border-b border-slate-100 dark:border-slate-700 last:border-0 items-center"
                        >
                          <div className="col-span-1 text-center text-xs text-slate-400">
                            {idx + 1}
                          </div>
                          <div className="col-span-6 px-1">
                            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {values?.drugs_regional
                                ? values?.drugs_regional[idx]
                                : "N/A"}
                            </Text>
                          </div>
                          <div className="col-span-3 px-1">
                            <Input
                              className="h-7 text-xs"
                              value={
                                values?.regional_supplements?.[idx]?.conc ?? ""
                              }
                              onChange={(e) => {
                                const arr = [
                                  ...(values?.regional_supplements || []),
                                ];
                                arr[idx] = {
                                  ...arr[idx],
                                  conc: e.target.value,
                                };
                                onSetHandler("regional_supplements", arr);
                              }}
                              placeholder="e.g. 0.5%"
                            />
                          </div>
                          <div className="col-span-2 px-1">
                            <Input
                              className="h-7 text-xs"
                              value={
                                values?.regional_supplements?.[idx]?.vol ?? ""
                              }
                              onChange={(e) => {
                                const arr = [
                                  ...(values?.regional_supplements || []),
                                ];
                                arr[idx] = { ...arr[idx], vol: e.target.value };
                                onSetHandler("regional_supplements", arr);
                              }}
                              placeholder="e.g. 10 ml"
                            />
                          </div>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
            </FormSection>

            {/* Monitoring */}
            <FormSection title="Monitoring" icon={HeartPulse}>
              <View className="space-y-4">
                {/* Row 1: ECG, NIBP, Pulse-Oximetry, EtCO2 */}
                <CheckboxGroup
                  name="monitoring_row1"
                  options={["ECG", "NIBP", "Pulse-Oximetry", "EtCO2"]}
                  selected={(values?.monitoring || []).filter((v) =>
                    ["ECG", "NIBP", "Pulse-Oximetry", "EtCO2"].includes(v),
                  )}
                  onChange={(newSelected) => {
                    const rest = (values?.monitoring || []).filter(
                      (v) =>
                        !["ECG", "NIBP", "Pulse-Oximetry", "EtCO2"].includes(v),
                    );
                    onSetHandler("monitoring", [...rest, ...newSelected]);
                  }}
                  className="flex flex-wrap gap-x-4 gap-y-2"
                  itemClassName="text-sm text-slate-700 dark:text-slate-200"
                />

                {/* Row 2: ABP & CVP — toggled inside monitoring[], sub-inputs stored as JSON */}
                <View className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                  {/* ABP */}
                  {(() => {
                    const abpChecked =
                      values?.monitoring?.includes("ABP") || false;
                    const abpData: {
                      site?: string;
                      size?: string;
                      location?: string;
                    } = (() => {
                      try {
                        return values?.abp_details
                          ? JSON.parse(values.abp_details)
                          : {};
                      } catch {
                        return {};
                      }
                    })();
                    const updateAbp = (patch: Record<string, string>) =>
                      onSetHandler(
                        "abp_details",
                        JSON.stringify({ ...abpData, ...patch }),
                      );
                    return (
                      <View className="p-3 bg-slate-50 dark:bg-slate-800/60 bg-opacity-50 rounded border border-slate-100 dark:border-slate-700">
                        <View className="flex items-center gap-2 mb-2">
                          <CheckBox
                            checked={abpChecked}
                            onChange={() => {
                              const rest = (values?.monitoring || []).filter(
                                (v) => v !== "ABP",
                              );
                              onSetHandler(
                                "monitoring",
                                abpChecked ? rest : [...rest, "ABP"],
                              );
                            }}
                          />
                          <Text className="font-bold text-sm">ABP</Text>
                        </View>
                        {abpChecked && (
                          <View className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-1">
                            <View className="grid grid-cols-2 gap-2">
                              <Input
                                label="Site"
                                placeholder="e.g. Radial"
                                className="h-7 text-sm"
                                value={abpData.site || ""}
                                onChange={(e) =>
                                  updateAbp({ site: e.target.value })
                                }
                              />
                              <Input
                                label="Size G"
                                placeholder="e.g. 20G"
                                className="h-7 text-sm"
                                value={abpData.size || ""}
                                onChange={(e) =>
                                  updateAbp({ size: e.target.value })
                                }
                              />
                            </View>
                            <RadioGroup
                              name="abp_loc"
                              options={[
                                { label: "OT", value: "OT" },
                                { label: "ICU", value: "ICU" },
                              ]}
                              value={abpData.location || ""}
                              onChange={(val) => updateAbp({ location: val })}
                              variant="button"
                              size="small"
                            />
                          </View>
                        )}
                      </View>
                    );
                  })()}

                  {/* CVP */}
                  {(() => {
                    const cvpChecked =
                      values?.monitoring?.includes("CVP") || false;
                    const cvpData: {
                      site?: string;
                      size?: string;
                      location?: string;
                    } = (() => {
                      try {
                        return values?.cvp_details
                          ? JSON.parse(values.cvp_details)
                          : {};
                      } catch {
                        return {};
                      }
                    })();
                    const updateCvp = (patch: Record<string, string>) =>
                      onSetHandler(
                        "cvp_details",
                        JSON.stringify({ ...cvpData, ...patch }),
                      );
                    return (
                      <View className="p-3 bg-slate-50 dark:bg-slate-800/60 bg-opacity-50 rounded border border-slate-100 dark:border-slate-700">
                        <View className="flex items-center gap-2 mb-2">
                          <CheckBox
                            checked={cvpChecked}
                            onChange={() => {
                              const rest = (values?.monitoring || []).filter(
                                (v) => v !== "CVP",
                              );
                              onSetHandler(
                                "monitoring",
                                cvpChecked ? rest : [...rest, "CVP"],
                              );
                            }}
                          />
                          <Text className="font-bold text-sm">CVP</Text>
                        </View>
                        {cvpChecked && (
                          <View className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-1">
                            <View className="grid grid-cols-2 gap-2">
                              <Input
                                label="Site"
                                placeholder="e.g. IJV"
                                className="h-7 text-sm"
                                value={cvpData.site || ""}
                                onChange={(e) =>
                                  updateCvp({ site: e.target.value })
                                }
                              />
                              <Input
                                label="Size G"
                                placeholder="e.g. 7Fr"
                                className="h-7 text-sm"
                                value={cvpData.size || ""}
                                onChange={(e) =>
                                  updateCvp({ size: e.target.value })
                                }
                              />
                            </View>
                            <RadioGroup
                              name="cvp_loc"
                              options={[
                                { label: "OT", value: "OT" },
                                { label: "ICU", value: "ICU" },
                                { label: "Ward", value: "Ward" },
                              ]}
                              value={cvpData.location || ""}
                              onChange={(val) => updateCvp({ location: val })}
                              variant="button"
                              size="small"
                            />
                          </View>
                        )}
                      </View>
                    );
                  })()}
                </View>

                {/* Row 3: Urine Output, Blood Loss, Other Fluids, Warmer */}
                <View className="border-t border-slate-100 dark:border-slate-700 pt-3">
                  <CheckboxGroup
                    name="monitoring_row3"
                    options={[
                      "Urine Output",
                      "Blood Loss",
                      "Other Fluids",
                      "Warmer",
                    ]}
                    selected={(values?.monitoring || []).filter((v) =>
                      [
                        "Urine Output",
                        "Blood Loss",
                        "Other Fluids",
                        "Warmer",
                      ].includes(v),
                    )}
                    onChange={(newSelected) => {
                      const rest = (values?.monitoring || []).filter(
                        (v) =>
                          ![
                            "Urine Output",
                            "Blood Loss",
                            "Other Fluids",
                            "Warmer",
                          ].includes(v),
                      );
                      onSetHandler("monitoring", [...rest, ...newSelected]);
                    }}
                    className="flex flex-wrap gap-x-4 gap-y-2"
                    itemClassName="text-sm text-slate-700 dark:text-slate-200"
                  />
                </View>

                {/* Row 4: Temperature */}
                <View className="border-t border-slate-100 dark:border-slate-700 pt-3 max-w-xs">
                  <Input
                    label="Temperature"
                    placeholder="e.g. 36.5°C"
                    value={values?.temperature || ""}
                    onChange={(e) =>
                      onSetHandler("temperature", e.target.value)
                    }
                    className="bg-slate-50 dark:bg-slate-800/50"
                  />
                </View>
              </View>
            </FormSection>

            {/* Total Fluids Transfused */}
            <FormSection title="Total Fluids Transfused" icon={Droplets}>
              <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(
                  [
                    { lable: "Crystalloids", name: "crystalloids_ml" },
                    { lable: "Colloids", name: "colloids_ml" },
                    { lable: "Blood", name: "blood_ml" },
                  ] as {
                    lable: string;
                    name: "crystalloids_ml" | "colloids_ml" | "blood_ml";
                  }[]
                ).map((type, index) => (
                  <View key={index}>
                    <Input
                      label={`${type.lable} (ml)`}
                      type="number"
                      value={String(values?.[type.name] ?? null)}
                      onChange={(e) =>
                        onSetHandler(
                          type.name,
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="e.g. 500"
                      className="bg-white dark:bg-slate-800/50"
                    />
                  </View>
                ))}
              </View>
            </FormSection>

            {/* Brief */}
            <FormSection title="Anaesthesia Technique Brief" icon={FileText}>
              <Textarea
                name="anaesthesia_technique_brief"
                value={values?.anaesthesia_technique_brief || ""}
                onChange={handleChange}
                className="min-h-[100px] bg-white dark:bg-slate-800/50"
                placeholder="Enter brief notes about the technique..."
              />
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
            placeholder="Enter anaesthesia summary..."
          />
          <View className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : "Submit Department of Anaesthesia Form"}
            </Button>
          </View>
        </View>
      </form>
    </>
  );
};

export default DeptAnaesthesiaForm;
