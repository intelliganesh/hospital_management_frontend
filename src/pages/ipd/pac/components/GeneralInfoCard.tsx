import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import Button from "@/components/button";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import { clearAnaesthesiaDetailSlice } from "@/actions/slices/ipd/anaesthesia/anaesthesia";
import BouncingLoader from "@/components/BouncingLoader";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import dayjs from "dayjs";

interface GeneralInfo {
  patient_name?: string;
  age?: string;
  gender?: string;
  patient_community?: string;
  patient_mother_tongue?: string;
  ip_no?: string;
  datetime?: string;
  patient_height?: string;
  patient_weight?: string;
  diagnosis?: string;
  surgery?: string;
  position?: string;
  surgeons?: string;
  surgeon_assistants?: string;
  anesthesiologist?: string;
  anaesthetist_assistant?: string;
}

interface Props {
  readOnly?: boolean;
  onSave?: (info: GeneralInfo) => void;
}

/** Read-only display field that visually matches the Input component */
const ViewField: React.FC<{
  label: string;
  value?: string | null;
  className?: string;
}> = ({ label, value, className }) => (
  <View className={`flex flex-col ${className || ""}`}>
    <Text as="label" className="block text-slate-700 dark:text-slate-300 mb-2">
      {label}
    </Text>
    <View className="h-10 flex items-center px-4 bg-slate-100 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-lg">
      <Text
        as="span"
        className="text-sm text-slate-800 dark:text-slate-200 truncate"
      >
        {value || "\u2014"}
      </Text>
    </View>
  </View>
);

const GeneralInfoCard: React.FC<Props> = ({ readOnly }) => {
  const { id: _id, pacId } = useParams<{ id: string; pacId?: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { anaesthesiaDetailHandler, editAnaesthesiaHandler, cleanUp } =
    useAnaesthesia();
  const anaesthesiaDetail = useSelector(
    (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
  ) as AnaesthesiaDetails | null;

  const { values, handleChange } = useForm<GeneralInfo | null>(
    anaesthesiaDetail as GeneralInfo,
  );

  useEffect(() => {
    if (pacId) {
      anaesthesiaDetailHandler(
        pacId,
        () => {
          setIsLoading(false);
        },
        undefined,
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }

    return () => {
      cleanUp();
      dispatch(clearAnaesthesiaDetailSlice());
    };
  }, [pacId]);

  const handleAddPAC = () => {
    if (
      !anaesthesiaDetail?.ipd_id &&
      !anaesthesiaDetail?.id &&
      !anaesthesiaDetail?.ipd_surgery_id
    )
      return;
    editAnaesthesiaHandler(
      anaesthesiaDetail?.id || "",
      {
        ipd_id: anaesthesiaDetail?.ipd_id || "",
        ipd_surgery_id: anaesthesiaDetail?.ipd_surgery_id || "",
        datetime: values?.datetime
          ? !values?.datetime.includes("00:00:00")
            ? `${values.datetime} 00:00:00`
            : values?.datetime
          : "",
        patient_height: values?.patient_height || "",
        patient_weight: values?.patient_weight || "",
        patient_community: values?.patient_community,
        patient_mother_tongue: values?.patient_mother_tongue,
        position: values?.position || "",
        anaesthetist_assistant: values?.anaesthetist_assistant || "",
      },
      () => {
        anaesthesiaDetailHandler(
          anaesthesiaDetail?.id || "",
          () => {
            setIsLoading(false);
          },
          undefined,
          (status) => {
            setIsLoading(
              status === "pending"
                ? true
                : status === "failed"
                  ? true
                  : status === "success" && false,
            );
          },
        );
      },
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <BouncingLoader isLoading={isLoading} />

      <Text as="h3" className="font-semibold text-lg">
        General Information
      </Text>

      {/* Patient Demographics */}
      <View>
        <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
          Patient Demographics
        </Text>

        {/* View-only fields */}
        <View className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <ViewField
            label="IP No"
            value={anaesthesiaDetail?.ipd?.ipd_number || "N/A"}
          />
          <ViewField
            label="Patient Name"
            value={anaesthesiaDetail?.ipd?.patient_name || "N/A"}
          />
          <ViewField
            label="Age"
            value={anaesthesiaDetail?.ipd?.patient_age || "N/A"}
          />
          <ViewField label="Gender" value={anaesthesiaDetail?.ipd?.patient?.gender || "N/A"} />
        </View>

        {/* Input fields */}
        <View className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            id="date"
            name="datetime"
            label="Date"
            type="date"
            value={
              values?.datetime && dayjs(values.datetime).isValid()
                ? dayjs(values.datetime).format("YYYY-MM-DD")
                : ""
            }
            onChange={handleChange}
            required
          />
          <Input
            id="height"
            name="patient_height"
            label="Height (cm)"
            type="number"
            value={values?.patient_height || ""}
            onChange={handleChange}
            // readOnly={readOnly}
            placeholder="Enter Height in cm"
          />
          <Input
            id="weight"
            name="patient_weight"
            label="Weight (kg)"
            value={values?.patient_weight || ""}
            onChange={handleChange}
            // readOnly={readOnly}
            placeholder="Enter Weight in kg"
          />
          <Input
            id="community"
            name="patient_community"
            label="Community"
            value={values?.patient_community || ""}
            onChange={handleChange}
            // readOnly={readOnly}
            placeholder="Enter Community"
          />
          <Input
            id="mother_tongue"
            name="patient_mother_tongue"
            label="Mother Tongue"
            value={values?.patient_mother_tongue || ""}
            onChange={handleChange}
            // readOnly={readOnly}
            placeholder="Enter Mother Tongue"
          />
        </View>
      </View>

      {/* Clinical Information */}
      <View>
        <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
          Clinical Information
        </Text>

        {/* View-only fields */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ViewField
            label="Diagnosis"
            value={anaesthesiaDetail?.diagnosis || "N/A"}
          />
          <ViewField
            label="Surgery"
            value={anaesthesiaDetail?.surgery?.surgery_name || "N/A"}
          />
        </View>

        {/* Input fields */}
        <View className="grid grid-cols-1 gap-4">
          <Input
            id="position"
            name="position"
            label="Position"
            value={values?.position || ""}
            onChange={handleChange}
            readOnly={readOnly}
            // required
          />
        </View>
      </View>

      {/* Medical Team */}
      <View>
        <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
          Medical Team
        </Text>

        {/* All view-only */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ViewField
            label="Surgeons"
            value={anaesthesiaDetail?.surgery?.surgeon || "N/A"}
          />
          <ViewField
            label="Assistant Surgeons"
            value={values?.surgeon_assistants || "N/A"}
          />
          <ViewField
            label="Anesthetist"
            value={anaesthesiaDetail?.surgery?.anaesthetist || "N/A"}
          />

          {/* <Input
            id="anesthesiologist_assistants"
            name="anaesthetist_assistant"
            label="Anaesthesiologist Assistants"
            value={values?.anaesthetist_assistant || ""}
            onChange={handleChange}
          /> */}
        </View>
      </View>

      {/* Save Button */}
      {!readOnly && (
        <View className="flex justify-end pt-4">
          <Button variant="primary" onPress={handleAddPAC} className="px-8">
            Save
          </Button>
        </View>
      )}
    </Card>
  );
};

export default GeneralInfoCard;
