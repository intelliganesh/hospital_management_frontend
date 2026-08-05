import { useFistula } from "@/actions/calls/fistula";
import { useOpd } from "@/actions/calls/opd";
import { RootState } from "@/actions/store";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SectionSeven from "../forms/consultationForm/Sections/SectionSeven";
import { toast } from "@/utils/custom-hooks/use-toast";
import { clearPatientFistulaDetailSlice } from "@/actions/slices/fistula";
import SingleSelector from "@/components/SingleSelector";

const FistulaEntryForm: React.FC<{ formType: "add" | "edit" }> = ({
  formType,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const fistulaDetail = useSelector(
    (state: RootState) => state.fistula.patientFistulaDetailData,
  );

  useEffect(() => {
    if (fistulaDetail?.patient_id) {
      setSelectedPatient(fistulaDetail.patient_id);
    }
  }, [fistulaDetail?.patient_id]);

  const {
    addPatientFistulaHandler,
    editPatientFistulaHandler,
    patientFistulaDetailHandler,
    cleanUp,
  } = useFistula();

  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);
  const patientList = useSelector((state: RootState) => state.opd.patientList);

  // Load detail for edit
  useEffect(() => {
    if (formType === "edit" && id) {
      patientFistulaDetailHandler(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(status !== "success");
        },
      );
    }

    return () => {
      cleanUp();
      dispatch(clearPatientFistulaDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let payload: any = {};
    try {
      for (let [key, value] of formData.entries()) {
        payload[key] = value;
      }

      setIsSubmitting(true);
      if (formType === "add") {
        addPatientFistulaHandler(payload, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Test Added successfully.",
              variant: "success",
            });
            navigate(-1);
          } else {
            setIsSubmitting(false);
          }
        });
      } else if (id) {
        editPatientFistulaHandler(id, payload, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Test Updated successfully.",
              variant: "success",
            });
            navigate(-1);
          } else {
            setIsSubmitting(false);
          }
        });
      }
    } catch (error: any) {
      console.error("Validation Error:", error);
      setIsSubmitting(false);
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <View className="p-6 max-w-7xl mx-auto">
      <BouncingLoader isLoading={isLoading} />

      <View className="flex justify-between mb-6">
        <Text as="h2" className="text-2xl font-bold">
          {formType === "add" ? "New Fistula Entry" : "Edit Fistula Entry"}
        </Text>
        <Button onPress={() => navigate(-1)} variant="outline">
          Back
        </Button>
      </View>

      <form onSubmit={handleSubmit}>
        {/* 1. Patient selector */}
        <View className="mb-6">
          <SingleSelector
            id="patient_id"
            name="patient_id"
            label="Patient"
            required
            value={selectedPatient}
            onChange={(value) => {
              setSelectedPatient(value);
            }}
            options={patientList?.map((p: any) => ({
              label: `${p.patient_number} - ${p.first_name}`,
              value: p.id,
            }))}
          />
        </View>
        <input type="hidden" name="patient_id" value={selectedPatient} />

        {/* 2. All your existing clinical UI */}
        <SectionSeven
          initialData={fistulaDetail}
          errorFistulaRecurrenceCount={errors.fistula_recurrence_surgery_count}
        />

        {/* 3. Submit */}
        <Button
          htmlType="submit"
          loading={isSubmitting}
          className="w-full mt-6"
        >
          Submit
        </Button>
      </form>
    </View>
  );
};

export default FistulaEntryForm;
