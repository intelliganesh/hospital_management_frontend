import Text from "@/components/text";
import View from "@/components/view";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import Button from "@/components/button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { Medicine } from "@/interfaces/medicines";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useMedicine } from "@/actions/calls/medicine";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { clearMedicineDetailReducer } from "@/actions/slices/medicine";
import BouncingLoader from "@/components/BouncingLoader";

const MedicinesForm: React.FC<FormTypeProps> = ({
  // toAddInModal,
  onModalSuccess,
  formType = "add",
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    addMedicineHandler,
    medicineDetailHandler,
    editMedicineHandler,
    cleanUp,
  } = useMedicine();

  useEffect(() => {
    if (formType === "edit" && id) {
      medicineDetailHandler(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
        }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearMedicineDetailReducer());
    };
  }, [id, formType]);

  //   const token = useSelector((state: any) => state.authentication.tokenStatus);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let medicineFormObj: Partial<Medicine> = {};

    try {
      for (let [key, value] of formData.entries()) {
        let newValue: FormDataEntryValue | boolean = value;
        if (key === "is_active") {
          const dateValue = value as string;
          if (dateValue) {
            newValue = dateValue === "1" ? true : false;
          }
        }

        medicineFormObj[key as keyof Medicine] = newValue as any;
      }

      await validationForm.validate(medicineFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addMedicineHandler(medicineFormObj, (success: boolean) => {
          if (success && onModalSuccess) {
            onModalSuccess();
            toast({
              title: "Success!",
              description: "Medicine added successfully.",
              variant: "success",
            });
          } else if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Medicine added successfully.",
              variant: "success",
            });
          } else {
            if (onModalSuccess) {
              onModalSuccess();
              // toast({
              //   title: "Error!",
              //   description: "Failed to add Examination",
              //   variant: "destructive",
              // });
              return;
            }
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Examination",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editMedicineHandler(id, medicineFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Medicine Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Medicine",
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
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add" ? "New Medicine" : "Edit Medicine"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the medicine details
            </Text>
          </View>
          {!onModalSuccess && (
            <Button
              onPress={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back
            </Button>
          )}
          {/* <Button
            onPress={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Back
          </Button> */}
        </View>
        <form onSubmit={handleSubmit}>
          <View className="space-y-4">
            <Text
              as="h3"
              className="text-lg border-b pb-2 mb-4"
              weight="font-bold"
            >
              Basic Information
            </Text>
            <SectionOne
              errorMedicineName={errors?.medicine_name}
              // errorsType={errors.type}
              // errorsPatientId={errors.patient_id}
              // errorsAppointmentId={errors.appointment_id}
              // errorsDoctorId={errors.doctor_id}
            />
          </View>
          <View className="space-y-4">
            {/* <Text
              as="h3"
              className="text-lg border-b pb-2 mb-4"
              weight="font-bold"
            >
              Dosage & Strength
            </Text> */}
            <SectionTwo
              errorsDepartmentType={errors?.department_type}
              errorsIsActive={errors?.is_active}
              // errorsStrength={errors?.strength}
              // errorsType={errors.type}
              // errorsPatientId={errors.patient_id}
              // errorsDoctorId={errors.doctor_id}
              // errorsEnrollFees={errors.enroll_fees}
              // errorsAppointmentDate={errors.appointment_date}
              // errorsAppointmentTime={errors.appointment_time}
              // errorsComplaint={errors.complaint}
              // errorsStatus={errors.status}
            />
          </View>

          {/* <View className="space-y-4 mt-8">
            <Text
              as="h3"
              className="text-lg border-b pb-2 mb-4"
              weight="font-bold"
            >
              Inventory & Pricing
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
export default MedicinesForm;
