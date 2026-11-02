import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import BouncingLoader from "@/components/BouncingLoader";
import { toast } from "@/utils/custom-hooks/use-toast";
import { RootState } from "@/actions/store";
import { useIpdPatients } from "@/actions/calls/ipd";
import { usePreliminaryNotes } from "@/actions/calls/ipd/preliminaryNotes";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { clearpreliminaryNotesDetailSlice } from "@/actions/slices/ipd/preliminaryNotes";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import { LoadingStatus } from "@/interfaces";
import SectionFive from "@/pages/ipd patients/preliminary notes/SectionFive";

// keys of preliminary notes that should not be sent back while updating
const NON_EDITABLE_KEYS = ["id", "ipd", "ipd_id", "created_at", "updated_at", "deleted_at"];

const LaboratoryInvestigationsForm: React.FC = () => {
  const { id: ipdId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ipdPatientDetailHandler, cleanUp } = useIpdPatients();
  const { preliminaryNotesDetail, addPreliminaryNotes, updatePreliminaryNotes } =
    usePreliminaryNotes();

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );
  const preliminaryNotesData = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData,
  ) as Partial<PreliminaryNotes> | null;

  useEffect(() => {
    if (ipdId) {
      dispatch(clearpreliminaryNotesDetailSlice());
      ipdPatientDetailHandler(ipdId, () => {}, [], (status: LoadingStatus) => {
        setIsLoading(status === "pending");
      });
      // lab results are stored in the preliminary notes of this IPD
      preliminaryNotesDetail(ipdId, () => {});
    }
    return () => {
      cleanUp();
      dispatch(clearIpdPatientDetailDataSlice());
      dispatch(clearpreliminaryNotesDetailSlice());
    };
  }, [ipdId]);

  const onSaveHandler = (success: boolean) => {
    setIsSubmitting(false);
    if (success) {
      toast({
        title: "Success!",
        description: "Laboratory investigations saved successfully.",
        variant: "success",
      });
      navigate(-1);
    } else {
      toast({
        title: "Error!",
        description: "Failed to save laboratory investigations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ipdId) return;

    const formData = new FormData(e.currentTarget);
    const labInvestigationsObj: Partial<PreliminaryNotes> = {};
    for (let [key, value] of formData.entries()) {
      labInvestigationsObj[key as keyof PreliminaryNotes] = value as any;
    }

    setIsSubmitting(true);

    if (preliminaryNotesData?.id) {
      // keep the doctor's existing notes as they are and update only the lab fields
      const existingNotes = Object.fromEntries(
        Object.entries(preliminaryNotesData)
          .filter(
            ([key, value]) =>
              !NON_EDITABLE_KEYS.includes(key) &&
              (value === null || typeof value !== "object"),
          )
          .map(([key, value]) => [key, value ?? ""]),
      );
      updatePreliminaryNotes(
        preliminaryNotesData.id,
        { ...existingNotes, ...labInvestigationsObj },
        onSaveHandler,
      );
    } else {
      addPreliminaryNotes(ipdId, labInvestigationsObj, onSaveHandler);
    }
  };

  const patientInfo = [
    { label: "IPD Number", value: ipdPatientDetailData?.ipd_number },
    {
      label: "Patient Name",
      value: ipdPatientDetailData?.patient_name,
      subValue: ipdPatientDetailData?.patient_number,
    },
    { label: "Patient Phone", value: ipdPatientDetailData?.patient_phone },
    {
      label: "Ward / Room / Bed",
      value: `${ipdPatientDetailData?.ward_type || "N/A"} / ${ipdPatientDetailData?.room_number || "N/A"} / ${ipdPatientDetailData?.bed_number || "N/A"}`,
    },
  ];

  if (isLoading) {
    return <BouncingLoader isLoading={true} />;
  }

  return (
    <View className="min-h-screen dark:bg-background flex flex-col items-center p-4">
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-7xl p-6 md:p-8">
        <View className="flex justify-between items-center mb-2">
          <Text as="h2" weight="font-bold" className="text-2xl text-primary">
            Laboratory Investigations
          </Text>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          Record the laboratory investigation results. They will be shown in the
          patient's preliminary notes.
        </Text>

        <View className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
          {patientInfo.map((info) => (
            <View key={info.label}>
              <Text as="p" className="text-text-light text-left mb-1">
                {info.label}
              </Text>
              <Text as="p" className="text-text font-semibold">
                {info.value || "N/A"}
              </Text>
              {info.subValue && (
                <Text as="p" className="text-xs text-muted-foreground">
                  {info.subValue}
                </Text>
              )}
            </View>
          ))}
        </View>

        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionFive />
          <Button
            htmlType="submit"
            loading={isSubmitting}
            className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
          >
            {isSubmitting ? "Saving..." : "Save Investigations"}
          </Button>
        </form>
      </View>
    </View>
  );
};

export default LaboratoryInvestigationsForm;
