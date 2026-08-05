import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { OpdCase } from "@/interfaces/opdCases";
import { validationForm } from "./validationForm";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useOpd } from "@/actions/calls/opd";
import { toast } from "@/utils/custom-hooks/use-toast";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { clearOpdDetailSlice } from "@/actions/slices/opd";

const OpdCaseForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addOpdHandler, opdEditHandler, opdDetailHandler, cleanUp } = useOpd();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formType === "edit" && id) {
      opdDetailHandler(id, () => {});
    }
    return () => {
      cleanUp();
      dispatch(clearOpdDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let opdFormObj: Partial<OpdCase> = {};
    try {
      for (let [key, value] of formData.entries()) {
        if (key === "visit_date") {
          const dateTime = value as string;
          if (dateTime && dateTime.includes("T")) {
            value = dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
          }
        }
        opdFormObj[key as keyof OpdCase] = value as any;
      }

      await validationForm.validate(opdFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addOpdHandler(opdFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "OPD Case Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to add OPD Case",
              variant: "destructive",
            });
          }
        });
      } else if (id) {
        opdEditHandler(id, opdFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "OPD Case Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to update OPD Case",
              variant: "destructive",
            });
          }
          setIsSubmitting(false);
        });
      }
    } catch (error: any) {
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
    <View className="min-h-screen bg-primary-50 dark:bg-background flex flex-col  items-center p-4">
      <View className="bg-white dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            className="text-2xl font-bold text-center text-text-DEFAULT mb-2"
          >
            Register OPD Patient
          </Text>
          <View className="flex gap-3">
            {/* <Button
              htmlType="submit"
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              Convert to IPD
            </Button> */}
            <Button onPress={() => navigate(-1)} variant="ghost">
              Back
            </Button>
          </View>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details to register a new OPD patient
        </Text>

        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsPatientId={errors.patient_id}
            errorsAppointmentId={errors.appointment_id}
            errorsStatus={errors.status}
            errorsVisitDate={errors.visit_date}
            errorsComplaint={errors.complaint}
            errorsRefferedDoctorId={errors.referred_to_doctor_id}
          />
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </View>
        </form>
      </View>
    </View>
  );
};

export default OpdCaseForm;
