import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import { Examination } from "@/interfaces/examination";
import { useExaminations } from "@/actions/calls/examination";
import { clearExaminationDetailsReducer } from "@/actions/slices/examination";

const ExaminationForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    addExaminationHandler,
    examinationDetailHandler,
    editExaminationHandler,
    cleanUp,
  } = useExaminations();

  useEffect(() => {
    if (formType === "edit" && id) {
      examinationDetailHandler(id, () => {});
    }
    return () => {
      cleanUp();
      dispatch(clearExaminationDetailsReducer());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let examinationFormObj: Partial<Examination> = {};

    try {
      for (let [key, value] of formData.entries()) {
        if (key === "temperature") {
          const dateValue = value as string;
          if (dateValue) {
            value = dateValue + " " + formData?.get("temperature_unit");
          }
        }
        if (key === "bp") {
          const dateValue = value as string;
          if (dateValue) {
            value = dateValue + " mmHg";
          }
        }
        if (key === "pulse") {
          const dateValue = value as string;
          if (dateValue) {
            value = dateValue + " bpm";
          }
        }

        examinationFormObj[key as keyof Examination] = value as any;
      }

      delete examinationFormObj["temperature_unit"];

      await validationForm.validate(examinationFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addExaminationHandler(examinationFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Examination submitted successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to submit Examination",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editExaminationHandler(id, examinationFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Examination Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Examination",
            //   variant: "destructive",
            // });
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
            className="text-2xl font-bold text-center text-text-DEFAULT"
          >
            New Examination
          </Text>
          <Button onPress={() => navigate(-1)} variant="ghost">
            Back
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the examination details
        </Text>
        <form onSubmit={handleSubmit}>
          <View className="space-y-4">
            <Text
              as="h3"
              className="text-lg border-b pb-2 mb-4"
              weight="font-bold"
            >
              Patient and Appointment Details
            </Text>
            <SectionOne
              errorsPatientId={errors.patient_id}
              errorsAppointmentId={errors.appointment_id}
              errorsDoctorId={errors.doctor_id}
              formType={formType}
            />
          </View>

          {/* <View className="space-y-4 mt-8">
          <Text
              as="h3"
              className="text-lg border-b pb-2 mb-4"
              weight="font-bold"
            >
              Diagnosis & Advice
            </Text>
            <SectionThree
            // errorsType={errors.type}
            // errorsPatientId={errors.patient_id}
            // errorsDoctorId={errors.doctor_id}
            // errorsEnrollFees={errors.enroll_fees}
            // errorsAppointmentDate={errors.appointment_date}
            // errorsAppointmentTime={errors.appointment_time}
            // errorsComplaint={errors.complaint}
            // errorsStatus={errors.status}
          />
            </View> */}

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
export default ExaminationForm;
