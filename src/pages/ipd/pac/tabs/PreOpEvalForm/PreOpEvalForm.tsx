import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Input from "@/components/input";
import Text from "@/components/text";
import RadioGroup from "@/components/RadioGroup";
// import CheckBox from "@/components/CheckBox";
// import CollapsibleContainer from "@/components/CollapsibleContainer";
import FormSection from "../../components/FormSection";
// import CheckboxGroup from "../components/CheckboxGroup";
import {
  Activity,
  AlertTriangle,
  Wind,
  Clipboard,
  // FlaskConical,
  // Stethoscope,
  // User,
} from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import Upload from "@/components/Upload";
import {
  PreOpAnaesthesiaEvalAdd,
  PreOpAnaesthesiaEvalDetails,
} from "@/interfaces/ipd/anaesthesia/pre-opAnaesthesiaEvaluation";
import Textarea from "@/components/Textarea";
import { Card } from "@/components/ui/card";
import Button from "@/components/button";
import { usePreOpAnaesthesiaEval } from "@/actions/calls/ipd/anaesthesia/pre-opAnaesthesiaEvaluation";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import { toast } from "@/utils/custom-hooks/use-toast";
import { imageUpload } from "@/actions/calls/uesImage";
import { validationForm } from "./PreOpEvalFromValidation";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";

interface Props {
  readOnly?: boolean;
}

const PreOpEvalForm: React.FC<Props> = ({ readOnly }) => {
  // const { id } = useParams();
  const validationFieldLabels: Record<string, string> = {
    ipd_id: "IPD ID",
    ipd_surgery_id: "IPD Surgery ID",
    ipd_anaesthesia_id: "PAC ID",
    datetime: "Date",
    previous_anaesthesia_surgery: "Previous Anaesthesia / Surgery",
    current_medication: "Current Medications",
    allergies: "Allergies",
    asa_grading: "ASA Grading",
    mouth_opening: "Mouth Opening",
    teeth: "Teeth",
    neck_movement: "Neck Movements",
    tmd: "TMD",
    mallampati_score: "Mallampati Score",
    dentures_check: "Dentures Check",
    summary: "Summary",
  };

  const anaesthesiaData =
    (useSelector(
      (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
    ) as AnaesthesiaDetails) || null;

  const preOpAnaesthesiaEvalData =
    (useSelector(
      (state: RootState) =>
        state.preOpAnaesthesiaEval.PreOpAnaesthesiaEvalDetails,
    ) as PreOpAnaesthesiaEvalDetails) || null;
  const AId = preOpAnaesthesiaEvalData?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { values, handleChange, onSetHandler } =
    useForm<PreOpAnaesthesiaEvalAdd | null>(preOpAnaesthesiaEvalData);

  const {
    addPreOpAnaesthesiaEvalHandler,
    preOpAnaesthesiaEvalDetailsHandler,
    editPreOpAnaesthesiaEvalHandler,
  } = usePreOpAnaesthesiaEval();

  // const handleCheckboxToggle = (
  //   field: string,
  //   value: string,
  //   checked: boolean,
  // ) => {
  //   const current = (values?.[field as keyof PreOpEval] as string[]) || [];
  //   const updated = checked
  //     ? [...current, value]
  //     : current.filter((item) => item !== value);
  //   onSetHandler(field, updated);
  // };

  useEffect(() => {
    if (anaesthesiaData?.id) {
      preOpAnaesthesiaEvalDetailsHandler(anaesthesiaData?.id, () => {});
    }
  }, [anaesthesiaData?.id]);

  const handleUpload = () => {
    const uploadData = {
      id: AId || "",
      modal_type: "ipd_pre_operative_anaesthesia_evaluation",
      file_name: "upload_pdf_path",
      folder_name: "ipd_pre_operative_anaesthesia_evaluation",
      image: values?.upload_pdf_path || "",
    };

    imageUpload(uploadData, (uploadSuccess: boolean) => {
      if (uploadSuccess) {
        toast({
          title: "Success!",
          description:
            "Pre-Op Anaesthesia Evaluation Record file uploaded successfully!.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error!",
          description:
            "Failed to upload Pre-Op Anaesthesia Evaluation Record file.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let PreOpAnaesthesiaEvalFormObj: Partial<PreOpAnaesthesiaEvalAdd> = {
      ...values,
    };

    try {
      for (let [key, value] of formData.entries()) {
        PreOpAnaesthesiaEvalFormObj[key as keyof PreOpAnaesthesiaEvalAdd] =
          value as any;
      }

      PreOpAnaesthesiaEvalFormObj = {
        ...PreOpAnaesthesiaEvalFormObj,
        ipd_id: anaesthesiaData?.ipd_id,
        ipd_surgery_id: anaesthesiaData?.ipd_surgery_id,
        ipd_anaesthesia_id: anaesthesiaData?.id,
        datetime: anaesthesiaData?.datetime,
      };

      delete PreOpAnaesthesiaEvalFormObj["upload_pdf_path"];

      await validationForm.validate(PreOpAnaesthesiaEvalFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);

      // const submitDetails = () => {
      if (preOpAnaesthesiaEvalData?.id) {
        editPreOpAnaesthesiaEvalHandler(
          anaesthesiaData?.id,
          // preOpAnaesthesiaEvalData?.ipd_surgery_id,
          PreOpAnaesthesiaEvalFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Pre-Op Anaesthesia Evaluation updated successfully.",
                variant: "success",
              });
            } else {
              toast({
                title: "Error!",
                description: "Failed to update Pre-Op Anaesthesia Evaluation.",
                variant: "destructive",
              });
            }
          },
        );
      } else {
        addPreOpAnaesthesiaEvalHandler(
          PreOpAnaesthesiaEvalFormObj,
          (success) => {
            if (success) {
              values?.upload_pdf_path && handleUpload();
              toast({
                title: "Success!",
                description:
                  "Pre-Op Anaesthesia Evaluation saved successfully.",
                variant: "success",
              });

              preOpAnaesthesiaEvalDetailsHandler(
                anaesthesiaData?.id,
                // anaesthesiaData?.ipd_surgery_id,
                () => {},
              );
            } else {
              toast({
                title: "Error!",
                description: "Failed to save Pre-Op Anaesthesia Evaluation.",
                variant: "destructive",
              });
            }
            setIsSubmitting(false);
          },
        );
      }

      // };

      // submitDetails();

      // if (values?.upload_pdf_path instanceof File) {
      //   const uploadData = {
      //     id,
      //     modal_type: "ipd_pre_operative_anaesthesia_evaluation",
      //     file_name: "upload_pdf_path",
      //     folder_name: "ipd_pre_operative_anaesthesia_evaluation",
      //     image: values?.upload_pdf_path || "",
      //   };
      //   imageUpload(uploadData, (uploadSuccess: boolean) => {
      //     if (uploadSuccess) {
      //       submitDetails();
      //     } else {
      //       toast({
      //         title: "Error!",
      //         description:
      //           "Failed to upload Pre-Op Anaesthesia Evaluation Record file.",
      //         variant: "destructive",
      //       });
      //       setIsSubmitting(false);
      //     }
      //   });
      // }
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

      const errorMessages = Object.entries(validationErrors).map(
        ([field, message]) =>
          `${validationFieldLabels[field] || field}: ${message}`,
      );

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
      <form onSubmit={handleSubmit}>
        <FormSection title="History & Medications" icon={Clipboard}>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea
              id="previous_anaesthesia"
              name="previous_anaesthesia_surgery"
              label="Previous Anaesthesia / Surgery"
              value={values?.previous_anaesthesia_surgery || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              placeholder="e.g. Appendectomy under GA, 2019"
              error={errors?.previous_anaesthesia_surgery || ""}
            />
            <Textarea
              id="current_medications"
              name="current_medication"
              label="Current Medications"
              value={values?.current_medication || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              placeholder="e.g. Metformin 500mg twice daily"
              error={errors?.current_medication || ""}
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
            <Textarea
              id="allergies"
              name="allergies"
              value={values?.allergies || ""}
              onChange={handleChange}
              disabled={readOnly}
              className="bg-white dark:bg-slate-800 border-0 focus:ring-0 p-0 resize-none min-h-[80px]"
              placeholder="List allergies..."
              error={errors?.allergies || ""}
            />
          </FormSection>

          <FormSection
            title="ASA Grading"
            icon={Activity}
            className="h-full mb-0"
          >
            <View className="flex items-center justify-start h-full pb-4">
              <RadioGroup
                name="asa_grading"
                value={(values as any)?.asa_grading || ""}
                onChange={(val) => onSetHandler("asa_grading", val)}
                variant="button"
                options={["1", "2", "3", "4", "5", "E"].map((g) => ({
                  value: g,
                  label: g,
                }))}
                error={errors?.asa_grading || ""}
                // disabled={readOnly}
              />
            </View>
          </FormSection>
        </View>
        {/* Airway Assessment */}
        <FormSection title="Airway Assessment" icon={Wind} className="mt-6">
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Input
              label="Mouth Opening"
              name="mouth_opening"
              value={values?.mouth_opening || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              error={errors?.mouth_opening || ""}
              placeholder="e.g. 3 cm"
            />
            <Input
              label="Teeth"
              name="teeth"
              value={values?.teeth || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              error={errors?.teeth || ""}
              placeholder="e.g. Good / Loose"
            />
            <Input
              label="Neck Movements"
              name="neck_movement"
              value={values?.neck_movement || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              error={errors?.neck_movement || ""}
              placeholder="e.g. Full / Restricted"
            />
            <Input
              label="TMD"
              name="tmd"
              value={values?.tmd || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              error={errors?.tmd || ""}
              placeholder="e.g. 6 cm"
            />
            <Input
              label="Mallampati Score"
              name="mallampati_score"
              value={values?.mallampati_score || ""}
              onChange={handleChange}
              // disabled={readOnly}
              className="bg-white dark:bg-slate-800"
              error={errors?.mallampati_score || ""}
              placeholder="e.g. Class II"
            />
          </View>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <Text className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              Dentures Check:
            </Text>
            <RadioGroup
              name="dentures_check"
              value={values?.dentures_check}
              onChange={(val) => onSetHandler("dentures_check", val)}
              variant="button"
              size="small"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              error={errors?.dentures_check || ""}
              // disabled={readOnly}
            />
          </div>
        </FormSection>
        {/* Clinical Evaluation Systems */}
        {/* <FormSection title="Clinical Evaluation – Systems" icon={Stethoscope}>
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
        </FormSection> */}
        {/* Investigations */}
        {/* <FormSection title="Investigations" icon={FlaskConical}>
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
        </FormSection> */}
        {/* Footer Info */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <FormSection
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
          </FormSection> */}

          {/* <FormSection
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
          </FormSection> */}
        </View>
        {/* end CollapsibleContainer */}
        {/* </CollapsibleContainer> */}
        {/* Upload filled form */}
        <View className="flex justify-center mt-8">
          <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5 ">
            <Upload
              label="Upload Filled Pre-Op Evaluation Form"
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
        <Card className="p-4 mt-4 space-y-4">
          <Textarea
            label="Summary"
            placeholder="Enter pre-op evaluation summary..."
            name="summary"
            value={values?.summary || ""}
            onChange={handleChange}
            className="min-h-[100px]"
          />
          <View className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : "Submit Pre-Op Anaesthesia Evalution"}
            </Button>
          </View>
        </Card>
      </form>
    </>
  );
};

export default PreOpEvalForm;
