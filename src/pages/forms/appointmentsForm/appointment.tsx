import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { Appointment } from "@/interfaces/appointments";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useAppointments } from "@/actions/calls/appointments";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { clearAppointmentDetailsSlice } from "@/actions/slices/appointments";
import { useDispatch, useSelector } from "react-redux";
import { usePatient } from "@/actions/calls/patient";
import PatientInfo from "@/pages/patient/PatientInfo";
import { RootState } from "@/actions/store";
import { validationForm } from "./validationForm";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import { APPOINTMENT_TABLE_URL } from "@/utils/urls/frontend";
import dayjs from "dayjs";

const AppointmentForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const prefilledPatientId = searchParams.get("patientId");
  const patient = useSelector(
    (state: RootState) => state?.patient?.patientDetailData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { patientDetailHandler } = usePatient();
  const {
    addAppointmentHandler,
    appointmentDetailHandler,
    editAppointmentHandler,
    cleanUp,
  } = useAppointments();

  useEffect(() => {
    if (formType === "edit" && id) {
      appointmentDetailHandler(id, () => {});
    }
    if (prefilledPatientId && formType === "add") {
      patientDetailHandler(prefilledPatientId, () => {});
    }
    return () => {
      dispatch(clearAppointmentDetailsSlice());
      cleanUp();
    };
  }, [id, formType]);

  //   const token = useSelector((state: any) => state.authentication.tokenStatus);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let appointmentFormObj: Partial<Appointment> = {};

    try {
      for (let [key, value] of formData.entries()) {
        if (key === "appointment_time") {
          const timeValue = value as string;
          // Check if the time already has seconds
          if (timeValue && timeValue.split(":").length === 2) {
            // If time is in HH:MM format, append :00 for seconds
            value = `${timeValue}:00`;
          }
        }
        appointmentFormObj[key as keyof Appointment] = value as any;
        appointmentFormObj["advice"] = "";
        appointmentFormObj["preliminary_diagnosis"] = "";
      }

      appointmentFormObj = {
        ...appointmentFormObj,
        // chief_complaints: "Select Chief Complaints",
        // surgical_history: "Select Surgical History",
        // co_morbidities:"Select Co-morbidities",
        // on_examination:"Select On Examination",
        // treatment_plan:"Select Treatment Plan",
        // tests:"Select Tests",
        // amount:0,
      };

      await validationForm.validate(appointmentFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addAppointmentHandler(appointmentFormObj, (success: boolean) => {
          if (success) {
            navigate(APPOINTMENT_TABLE_URL +
                  `?currentPage=1&from_date=${dayjs().format(
                    "YYYY-MM-DD"
                  )}&to_date=${dayjs().format("YYYY-MM-DD")}`);
            toast({
              title: "Success!",
              description: "Appointment scheduled successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to schedule Appointment",
            //   variant: "destructive",
            // });
          }
          
        });
      } else if (id) {
        editAppointmentHandler(id, appointmentFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Appointment Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Appointment",
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
      formSubmissionFailMessage();
    }
  };
  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add" ? "New Appointment" : "Edit Appointment"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the appointment details
            </Text>
          </View>
          <Button
            onPress={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Back
          </Button>
        </View>
        <View className="border-b border-slate-200 dark:border-slate-700 ">
          {prefilledPatientId && formType === "add" && (
            <PatientInfo patient={patient} need={false} />
          )}
        </View>
        <form onSubmit={handleSubmit} className="mt-6">
          <SectionOne
            formType={formType}
            prefilledPatientId={prefilledPatientId}
            errorsType={errors.type}
            errorsStatus={errors.status}
            errorsDoctorId={errors.doctor_id}
            // errorsComplaint={errors.complaint}
            // errorAmountFor={errors.amount_for}
            errorsPatientId={errors.patient_id}
            // errorPaymentType={errors.payment_type}
            // errorsConsultationFees={errors.amount}
            errorsAppointmentDate={errors.appointment_date}
            errorsAppointmentTime={errors.appointment_time}
            errorFrontDeskUserId={errors.front_desk_user_id}
          />

          {/* <View className="mt-4">
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold mb-2"
            >
              Referrence Details
            </Text>
            <SectionTwo />
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
export default AppointmentForm;
