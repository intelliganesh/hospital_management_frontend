import React, { useState } from "react";
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

interface Props {
  readOnly?: boolean;
}

interface FormValues {
  // Pre-Anaesthesia
  pre_state?: string[];
  npo_status?: string;

  // Patient Safety
  patient_safety?: string[];

  // GA
  // ga_general?: string[]; // Hardcoded Pre-Oxygenation
  induction?: string; // Radio: Intravenous | Inhalational
  ga_rapid_sequence?: boolean;
  ga_cricoid_pressure?: boolean;

  // Airway
  airway_laryngoscopy?: string[];
  airway_ett_route?: string[]; // Oral, Nasal, Cuff
  airway_ett_type?: string[]; // Regular...
  airway_ett_size_check?: boolean;
  airway_ett_size_val?: string;
  airway_ett_fixed_check?: boolean;
  airway_ett_fixed_val?: string;

  airway_airway_opts?: string[]; // Oral, Nasal, LMA, I-Gel
  airway_airway_size_check?: boolean;
  airway_airway_size_val?: string;

  airway_mask_opts?: string[]; // Nasal Cannula, Oxygen Mask
  airway_throat_pack?: string; // Inserted | Removed

  airway_nasogastric?: string; // Inserted | Removed

  // Maintenance
  maintenance?: string[];

  // IV Access
  iv_access?: { id: string; site: string; size: string; location: string }[]; // location: OT | Ward

  // Regional
  spinal?: {
    needle_checked: boolean;
    needle_val: string;
    catheter_checked: boolean;
    catheter_val: string;
    single: boolean;
    cont: boolean;
  };
  epidural?: {
    needle_checked: boolean;
    needle_val: string;
    catheter_checked: boolean;
    catheter_val: string;
    single: boolean;
    cont: boolean;
  };
  regional_blocks?: string[];
  regional_other_opts?: string[]; // Nerve Stimulator, Complication etc.
  regional_nerve_stim_yes?: boolean;
  regional_nerve_stim_no?: boolean;

  regional_drugs?: { id: string; name: string; conc: string; vol: string }[];

  // Monitoring
  monitoring_main?: string[]; // ECG, NIBP, Pulse-Ox, EtCO2, Urine, Blood Loss, Other Fluids, Warmer
  monitoring_abp_check?: boolean;
  monitoring_abp?: { site: string; size: string; location: string }; // location: OT | ICU
  monitoring_cvp_check?: boolean;
  monitoring_cvp?: { site: string; size: string; location: string }; // location: OT | ICU | Ward
  monitoring_temp?: string;

  // Fluids
  fluids?: { crystalloids?: string; colloids?: string; blood?: string };

  // Brief
  anaesthesia_technique_brief?: string;
}

const DeptAnaesthesiaForm: React.FC<Props> = ({ readOnly }) => {
  const initialValues: FormValues = {
    iv_access: [{ id: "1", site: "", size: "", location: "" }],
    regional_drugs: [{ id: "1", name: "", conc: "", vol: "" }],
    spinal: {
      needle_checked: false,
      needle_val: "",
      catheter_checked: false,
      catheter_val: "",
      single: false,
      cont: false,
    },
    epidural: {
      needle_checked: false,
      needle_val: "",
      catheter_checked: false,
      catheter_val: "",
      single: false,
      cont: false,
    },
    monitoring_abp: { site: "", size: "", location: "" },
    monitoring_cvp: { site: "", size: "", location: "" },
  };

  const { values, handleChange, onSetHandler, setValues } =
    useForm<FormValues>(initialValues);

  // --- Helpers ---
  const toggleSelection = (field: keyof FormValues, value: string) => {
    const current = (values?.[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onSetHandler(field, updated);
  };

  const CheckboxGroup = ({
    options,
    selected = [],
    fieldName,
  }: {
    options: string[];
    selected?: string[];
    fieldName: keyof FormValues;
  }) => (
    <View className="flex flex-wrap gap-x-4 gap-y-2">
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
            className="text-sm text-slate-700 dark:text-slate-200"
          >
            {opt}
          </Text>
        </View>
      ))}
    </View>
  );

  const SubHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
    <View className="flex items-center gap-2 mb-3 mt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
      {Icon && <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
      <Text className="text-xs font-bold uppercase text-slate-500 tracking-wider">
        {title}
      </Text>
    </View>
  );

  const FormSection = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm mb-6 bg-white dark:bg-slate-900">
      <View className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <View className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </View>
        <Text
          as="h3"
          className="font-bold text-sm uppercase text-slate-800 dark:text-slate-100"
        >
          {title}
        </Text>
      </View>
      <View className="p-5">{children}</View>
    </Card>
  );

  return (
    <>
      {/* Upload filled form */}
      <View className="flex justify-center mt-8">
        <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5 ">
          <Upload
            label="Upload Filled Anaesthesia Form"
            name="anaes_upload"
            multiple={false}
            maxCount={1}
            accept=".pdf,.jpg,.png, .jpeg, .webp"
            browseText="Upload Form"
          />
        </View>
      </View>
      <View className="my-6 border-t border-slate-200" />

      <CollapsibleContainer
        title="Anaesthesia Fields"
        defaultOpen={false}
        variant="default"
        containerClassName="shadow-none"
        contentClassName="space-y-6 pb-20 animate-in fade-in duration-500"
      >
        <View className="space-y-6 pb-20 animate-in fade-in duration-500">
          {/* Pre-Anaesthesia State */}
          <FormSection title="Pre-Anaesthesia State" icon={User}>
            <View className="space-y-4">
              <View>
                <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                  Status
                </Text>
                <CheckboxGroup
                  options={[
                    "Awake",
                    "Apprehensive",
                    "Uncooperative",
                    "Calm",
                    "Asleep",
                    "Confused",
                    "Unresponsive",
                    "GCS",
                    "Ventilated Patient",
                    "VIA ETT",
                    "VIA Tracheostomy",
                  ]}
                  selected={values?.pre_state}
                  fieldName="pre_state"
                />
              </View>
              <View className="max-w-xs">
                <Input
                  label="NPO Status"
                  value={values?.npo_status}
                  onChange={handleChange}
                  name="npo_status"
                  disabled={readOnly}
                  className="bg-slate-50"
                />
              </View>
            </View>
          </FormSection>

          {/* Patient Safety */}
          <FormSection title="Patient Safety" icon={Shield}>
            <CheckboxGroup
              options={[
                "Anaes. Machine Checked",
                "Pressure Points Checked",
                "Eye Care",
                "Ointment",
                "Eye Pad",
              ]}
              selected={values?.patient_safety}
              fieldName="patient_safety"
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
                  value={values?.induction}
                  onChange={(val) => onSetHandler("induction", val)}
                  variant="button"
                  size="small"
                  disabled={readOnly}
                />

                {/* Conditional Fields */}
                {(values?.induction === "Intravenous" ||
                  values?.induction === "Inhalational") && (
                  <View className="flex gap-4 mt-2 animate-in fade-in slide-in-from-top-1">
                    <View className="flex items-center gap-2">
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
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Airway Management Sub-Section */}
            <SubHeader title="Airway Management" icon={Wind} />
            <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Col 1: Laryngoscopy */}
              <View>
                <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                  Laryngoscopy
                </Text>
                <CheckboxGroup
                  options={[
                    "Direct",
                    "Fibre Optic Scope",
                    "Blind",
                    "Others",
                    "Difficult Intubation",
                  ]}
                  selected={values?.airway_laryngoscopy}
                  fieldName="airway_laryngoscopy"
                />
              </View>

              {/* Col 2: ETT & Others */}
              <View className="space-y-6">
                {/* ETT */}
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Endo Tracheal Tube
                  </Text>
                  <View className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                    {["Oral", "Nasal", "Cuff"].map((opt) => (
                      <View
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          !readOnly && toggleSelection("airway_ett_route", opt)
                        }
                      >
                        <CheckBox
                          checked={values?.airway_ett_route?.includes(opt)}
                          onChange={() =>
                            !readOnly &&
                            toggleSelection("airway_ett_route", opt)
                          }
                          disabled={readOnly}
                        />
                        <Text className="text-sm">{opt}</Text>
                      </View>
                    ))}
                  </View>
                  {/* Routes + Types */}
                  <View className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                    {[
                      "Regular",
                      "Reinforced",
                      "RAE",
                      "MLS Tube",
                      "Endobronchial",
                      "Laser",
                    ].map((opt) => (
                      <View
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          !readOnly && toggleSelection("airway_ett_type", opt)
                        }
                      >
                        <CheckBox
                          checked={values?.airway_ett_type?.includes(opt)}
                          onChange={() =>
                            !readOnly && toggleSelection("airway_ett_type", opt)
                          }
                          disabled={readOnly}
                        />
                        <Text className="text-sm">{opt}</Text>
                      </View>
                    ))}
                  </View>
                  {/* Size & Fixed At */}
                  <View className="flex flex-wrap gap-4 items-center">
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.airway_ett_size_check || false}
                        onChange={() =>
                          onSetHandler(
                            "airway_ett_size_check",
                            !values?.airway_ett_size_check,
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">Size</Text>
                      {values?.airway_ett_size_check && (
                        <Input
                          className="w-16 h-7"
                          value={values?.airway_ett_size_val}
                          onChange={(e) =>
                            onSetHandler("airway_ett_size_val", e.target.value)
                          }
                          disabled={readOnly}
                        />
                      )}
                    </View>
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.airway_ett_fixed_check || false}
                        onChange={() =>
                          onSetHandler(
                            "airway_ett_fixed_check",
                            !values?.airway_ett_fixed_check,
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">Fixedat</Text>
                      {values?.airway_ett_fixed_check && (
                        <Input
                          className="w-16 h-7"
                          value={values?.airway_ett_fixed_val}
                          onChange={(e) =>
                            onSetHandler("airway_ett_fixed_val", e.target.value)
                          }
                          disabled={readOnly}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Airway */}
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Airway
                  </Text>
                  <View className="flex flex-wrap gap-4 items-center">
                    {["Oral", "Nasal", "LMA", "I-Gel"].map((opt) => (
                      <View
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          !readOnly &&
                          toggleSelection("airway_airway_opts", opt)
                        }
                      >
                        <CheckBox
                          checked={values?.airway_airway_opts?.includes(opt)}
                          onChange={() =>
                            !readOnly &&
                            toggleSelection("airway_airway_opts", opt)
                          }
                          disabled={readOnly}
                        />
                        <Text className="text-sm">{opt}</Text>
                      </View>
                    ))}
                    <View className="flex items-center gap-2">
                      <CheckBox
                        checked={values?.airway_airway_size_check || false}
                        onChange={() =>
                          onSetHandler(
                            "airway_airway_size_check",
                            !values?.airway_airway_size_check,
                          )
                        }
                        disabled={readOnly}
                      />
                      <Text className="text-sm">Size</Text>
                      {values?.airway_airway_size_check && (
                        <Input
                          className="w-16 h-7"
                          value={values?.airway_airway_size_val}
                          onChange={(e) =>
                            onSetHandler(
                              "airway_airway_size_val",
                              e.target.value,
                            )
                          }
                          disabled={readOnly}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Mask Anaesthesia */}
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Mask Anaesthesia
                  </Text>
                  <View className="flex flex-wrap gap-4 items-center mb-3">
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
                            !readOnly &&
                            toggleSelection("airway_mask_opts", opt)
                          }
                          disabled={readOnly}
                        />
                        <Text className="text-sm">{opt}</Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex flex-wrap gap-4 items-center">
                    <Text className="text-sm font-semibold">Throat Pack:</Text>
                    <RadioGroup
                      name="throat_pack"
                      options={[
                        { label: "Inserted", value: "Inserted" },
                        { label: "Removed", value: "Removed" },
                      ]}
                      value={values?.airway_throat_pack}
                      onChange={(val) =>
                        onSetHandler("airway_throat_pack", val)
                      }
                      variant="button"
                      size="small"
                      disabled={readOnly}
                    />
                  </View>
                </View>

                {/* Nasogastric Tube */}
                <View className="flex flex-wrap gap-4 items-center">
                  <Text className="text-xs font-bold text-slate-500 uppercase">
                    Nasogastric Tube:
                  </Text>
                  <RadioGroup
                    name="nasogastric"
                    options={[
                      { label: "Inserted", value: "Inserted" },
                      { label: "Removed", value: "Removed" },
                    ]}
                    value={values?.airway_nasogastric}
                    onChange={(val) => onSetHandler("airway_nasogastric", val)}
                    variant="button"
                    size="small"
                    disabled={readOnly}
                  />
                </View>

                {/* Maintenance (keeping as per request flow, though arguably separate) */}
                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Maintenance
                  </Text>
                  <CheckboxGroup
                    options={["Inhalational", "TIVA", "Regional"]}
                    selected={values?.maintenance}
                    fieldName="maintenance"
                  />
                </View>
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
                  key={iv.id || index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-1 text-center text-slate-400 font-bold">
                    #{index + 1}
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={iv.site}
                      onChange={(e) => {
                        const arr = [...(values?.iv_access || [])];
                        arr[index].site = e.target.value;
                        onSetHandler("iv_access", arr);
                      }}
                      className="h-8"
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={iv.size}
                      onChange={(e) => {
                        const arr = [...(values?.iv_access || [])];
                        arr[index].size = e.target.value;
                        onSetHandler("iv_access", arr);
                      }}
                      className="h-8"
                      disabled={readOnly}
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
                      disabled={readOnly}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {!readOnly && (
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
                    )}
                  </div>
                </View>
              ))}
              {!readOnly && (
                <Button
                  variant="outline"
                  size="small"
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
              )}
            </View>
          </FormSection>

          {/* Regional Anaesthesia */}
          <FormSection title="Regional Anaesthesia / Analgesia" icon={Activity}>
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
                    <View className="p-3 bg-slate-50 rounded border border-slate-100">
                      <Text className="font-bold text-sm mb-2">SPINAL</Text>
                      <View className="flex flex-wrap gap-4 items-center">
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.spinal?.needle_checked || false}
                            onChange={() =>
                              onSetHandler("spinal", {
                                ...values?.spinal,
                                needle_checked: !values?.spinal?.needle_checked,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Needle G</Text>
                          {values?.spinal?.needle_checked && (
                            <Input
                              className="w-16 h-7"
                              value={values?.spinal?.needle_val}
                              onChange={(e) =>
                                onSetHandler("spinal", {
                                  ...values?.spinal,
                                  needle_val: e.target.value,
                                })
                              }
                              disabled={readOnly}
                            />
                          )}
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.spinal?.catheter_checked || false}
                            onChange={() =>
                              onSetHandler("spinal", {
                                ...values?.spinal,
                                catheter_checked:
                                  !values?.spinal?.catheter_checked,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Catheter</Text>
                          {values?.spinal?.catheter_checked && (
                            <Input
                              className="w-16 h-7"
                              value={values?.spinal?.catheter_val}
                              onChange={(e) =>
                                onSetHandler("spinal", {
                                  ...values?.spinal,
                                  catheter_val: e.target.value,
                                })
                              }
                              disabled={readOnly}
                            />
                          )}
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.spinal?.single || false}
                            onChange={() =>
                              onSetHandler("spinal", {
                                ...values?.spinal,
                                single: !values?.spinal?.single,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Single</Text>
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.spinal?.cont || false}
                            onChange={() =>
                              onSetHandler("spinal", {
                                ...values?.spinal,
                                cont: !values?.spinal?.cont,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Cont.</Text>
                        </View>
                      </View>
                    </View>

                    {/* EPIDURAL */}
                    <View className="p-3 bg-slate-50 rounded border border-slate-100">
                      <Text className="font-bold text-sm mb-2">EPIDURAL</Text>
                      <View className="flex flex-wrap gap-4 items-center">
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.epidural?.needle_checked || false}
                            onChange={() =>
                              onSetHandler("epidural", {
                                ...values?.epidural,
                                needle_checked:
                                  !values?.epidural?.needle_checked,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Needle G</Text>
                          {values?.epidural?.needle_checked && (
                            <Input
                              className="w-16 h-7"
                              value={values?.epidural?.needle_val}
                              onChange={(e) =>
                                onSetHandler("epidural", {
                                  ...values?.epidural,
                                  needle_val: e.target.value,
                                })
                              }
                              disabled={readOnly}
                            />
                          )}
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={
                              values?.epidural?.catheter_checked || false
                            }
                            onChange={() =>
                              onSetHandler("epidural", {
                                ...values?.epidural,
                                catheter_checked:
                                  !values?.epidural?.catheter_checked,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Catheter</Text>
                          {values?.epidural?.catheter_checked && (
                            <Input
                              className="w-16 h-7"
                              value={values?.epidural?.catheter_val}
                              onChange={(e) =>
                                onSetHandler("epidural", {
                                  ...values?.epidural,
                                  catheter_val: e.target.value,
                                })
                              }
                              disabled={readOnly}
                            />
                          )}
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.epidural?.single || false}
                            onChange={() =>
                              onSetHandler("epidural", {
                                ...values?.epidural,
                                single: !values?.epidural?.single,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Single</Text>
                        </View>
                        <View className="flex items-center gap-2">
                          <CheckBox
                            checked={values?.epidural?.cont || false}
                            onChange={() =>
                              onSetHandler("epidural", {
                                ...values?.epidural,
                                cont: !values?.epidural?.cont,
                              })
                            }
                            disabled={readOnly}
                          />
                          <Text className="text-sm">Cont.</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Regional Blocks
                  </Text>
                  <CheckboxGroup
                    options={[
                      "Brachial Plexus",
                      "Sciatic",
                      "Femoral",
                      "Ankle",
                      "Caudal",
                    ]}
                    selected={values?.regional_blocks}
                    fieldName="regional_blocks"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    Others/Technique
                  </Text>
                  <View className="flex flex-wrap gap-4 items-center">
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
                      fieldName="regional_other_opts"
                    />
                  </View>
                </View>
              </View>

              {/* Right Column: Drugs (Dynamic) */}
              <View>
                <View className="flex justify-between items-center mb-2">
                  <Text className="text-xs font-bold text-slate-500 uppercase">
                    Drugs
                  </Text>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="small"
                      onPress={() =>
                        onSetHandler("regional_drugs", [
                          ...(values?.regional_drugs || []),
                          {
                            id: Date.now().toString(),
                            name: "",
                            conc: "",
                            vol: "",
                          },
                        ])
                      }
                    >
                      <Plus size={14} className="mr-1" /> Add Drug
                    </Button>
                  )}
                </View>
                <View className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <View className="grid grid-cols-12 bg-slate-100 p-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                    <div className="col-span-1">No.</div>
                    <div className="col-span-5">Drug Name</div>
                    <div className="col-span-3">Conc.</div>
                    <div className="col-span-2">Vol.</div>
                    <div className="col-span-1"></div>
                  </View>
                  {(values?.regional_drugs || []).map((drug, idx) => (
                    <View
                      key={drug.id || idx}
                      className="grid grid-cols-12 p-2 border-b border-slate-100 last:border-0 items-center"
                    >
                      <div className="col-span-1 text-center text-xs text-slate-400">
                        {idx + 1}
                      </div>
                      <div className="col-span-5 px-1">
                        <Input
                          className="h-7 text-xs"
                          value={drug.name}
                          onChange={(e) => {
                            const arr = [...(values?.regional_drugs || [])];
                            arr[idx].name = e.target.value;
                            onSetHandler("regional_drugs", arr);
                          }}
                          disabled={readOnly}
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-span-3 px-1">
                        <Input
                          className="h-7 text-xs"
                          value={drug.conc}
                          onChange={(e) => {
                            const arr = [...(values?.regional_drugs || [])];
                            arr[idx].conc = e.target.value;
                            onSetHandler("regional_drugs", arr);
                          }}
                          disabled={readOnly}
                          placeholder="%"
                        />
                      </div>
                      <div className="col-span-2 px-1">
                        <Input
                          className="h-7 text-xs"
                          value={drug.vol}
                          onChange={(e) => {
                            const arr = [...(values?.regional_drugs || [])];
                            arr[idx].vol = e.target.value;
                            onSetHandler("regional_drugs", arr);
                          }}
                          disabled={readOnly}
                          placeholder="ml"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="small"
                            className="text-red-500 h-6 w-6 p-0"
                            onPress={() => {
                              const arr = (values?.regional_drugs || []).filter(
                                (_, i) => i !== idx,
                              );
                              onSetHandler("regional_drugs", arr);
                            }}
                          >
                            <X size={12} />
                          </Button>
                        )}
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
              {/* Row 1 */}
              <CheckboxGroup
                options={["ECG", "NIBP", "Pulse-Oximetry", "EtCO2"]}
                selected={values?.monitoring_main}
                fieldName="monitoring_main"
              />

              {/* Row 2: ABP & CVP with Logic */}
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                {/* ABP */}
                <View className="p-3 bg-slate-50 bg-opacity-50 rounded border border-slate-100">
                  <View className="flex items-center gap-2 mb-2">
                    <CheckBox
                      checked={values?.monitoring_abp_check || false}
                      onChange={() =>
                        onSetHandler(
                          "monitoring_abp_check",
                          !values?.monitoring_abp_check,
                        )
                      }
                      disabled={readOnly}
                    />
                    <Text className="font-bold text-sm">ABP</Text>
                  </View>
                  {values?.monitoring_abp_check && (
                    <View className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-1">
                      <View className="grid grid-cols-2 gap-2">
                        <Input
                          label="Site"
                          className="h-7 text-sm"
                          value={values?.monitoring_abp?.site}
                          onChange={(e) =>
                            onSetHandler("monitoring_abp", {
                              ...values?.monitoring_abp,
                              site: e.target.value,
                            })
                          }
                          disabled={readOnly}
                        />
                        <Input
                          label="Size G"
                          className="h-7 text-sm"
                          value={values?.monitoring_abp?.size}
                          onChange={(e) =>
                            onSetHandler("monitoring_abp", {
                              ...values?.monitoring_abp,
                              size: e.target.value,
                            })
                          }
                          disabled={readOnly}
                        />
                      </View>
                      <RadioGroup
                        name="abp_loc"
                        options={[
                          { label: "OT", value: "OT" },
                          { label: "ICU", value: "ICU" },
                        ]}
                        value={values?.monitoring_abp?.location}
                        onChange={(val) =>
                          onSetHandler("monitoring_abp", {
                            ...values?.monitoring_abp,
                            location: val,
                          })
                        }
                        variant="button"
                        size="small"
                        disabled={readOnly}
                      />
                    </View>
                  )}
                </View>

                {/* CVP */}
                <View className="p-3 bg-slate-50 bg-opacity-50 rounded border border-slate-100">
                  <View className="flex items-center gap-2 mb-2">
                    <CheckBox
                      checked={values?.monitoring_cvp_check || false}
                      onChange={() =>
                        onSetHandler(
                          "monitoring_cvp_check",
                          !values?.monitoring_cvp_check,
                        )
                      }
                      disabled={readOnly}
                    />
                    <Text className="font-bold text-sm">CVP</Text>
                  </View>
                  {values?.monitoring_cvp_check && (
                    <View className="space-y-2 pl-6 animate-in fade-in slide-in-from-top-1">
                      <View className="grid grid-cols-2 gap-2">
                        <Input
                          label="Site"
                          className="h-7 text-sm"
                          value={values?.monitoring_cvp?.site}
                          onChange={(e) =>
                            onSetHandler("monitoring_cvp", {
                              ...values?.monitoring_cvp,
                              site: e.target.value,
                            })
                          }
                          disabled={readOnly}
                        />
                        <Input
                          label="Size G"
                          className="h-7 text-sm"
                          value={values?.monitoring_cvp?.size}
                          onChange={(e) =>
                            onSetHandler("monitoring_cvp", {
                              ...values?.monitoring_cvp,
                              size: e.target.value,
                            })
                          }
                          disabled={readOnly}
                        />
                      </View>
                      <RadioGroup
                        name="cvp_loc"
                        options={[
                          { label: "OT", value: "OT" },
                          { label: "ICU", value: "ICU" },
                          { label: "Ward", value: "Ward" },
                        ]}
                        value={values?.monitoring_cvp?.location}
                        onChange={(val) =>
                          onSetHandler("monitoring_cvp", {
                            ...values?.monitoring_cvp,
                            location: val,
                          })
                        }
                        variant="button"
                        size="small"
                        disabled={readOnly}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Row 3 */}
              <View className="border-t border-slate-100 pt-3">
                <CheckboxGroup
                  options={[
                    "Urine Output",
                    "Blood Loss",
                    "Other Fluids",
                    "Warmer",
                  ]}
                  selected={values?.monitoring_main}
                  fieldName="monitoring_main"
                />
              </View>

              {/* Row 4 */}
              <View className="border-t border-slate-100 pt-3 max-w-xs">
                <Input
                  label="Temperature"
                  value={values?.monitoring_temp}
                  onChange={(e) =>
                    onSetHandler("monitoring_temp", e.target.value)
                  }
                  disabled={readOnly}
                  className="bg-slate-50"
                />
              </View>
            </View>
          </FormSection>

          {/* Total Fluids Transfused */}
          <FormSection title="Total Fluids Transfused" icon={Droplets}>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Crystalloids", "Colloids", "Blood"].map((type) => (
                <View key={type}>
                  <Input
                    label={`${type} (ml)`}
                    value={(values?.fluids as any)?.[type.toLowerCase()] || ""}
                    onChange={(e) =>
                      onSetHandler("fluids", {
                        ...values?.fluids,
                        [type.toLowerCase()]: e.target.value,
                      })
                    }
                    disabled={readOnly}
                    className="bg-white"
                  />
                </View>
              ))}
            </View>
          </FormSection>

          {/* Brief */}
          <FormSection title="Anaesthesia Technique Brief" icon={FileText}>
            <Textarea
              name="anaesthesia_technique_brief"
              value={values?.anaesthesia_technique_brief}
              onChange={handleChange}
              disabled={readOnly}
              className="min-h-[100px] bg-white"
              placeholder="Enter brief notes about the technique..."
            />
          </FormSection>
        </View>
      </CollapsibleContainer>
    </>
  );
};

export default DeptAnaesthesiaForm;
