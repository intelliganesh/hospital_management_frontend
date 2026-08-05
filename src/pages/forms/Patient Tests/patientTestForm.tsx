import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { Test } from "@/interfaces/test";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import { usePatientTest } from "@/actions/calls/patientTest";
import { clearPatientTestDetailSlice } from "@/actions/slices/patientTest";

const PatientTestForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPatientTestHandler, patientTestEditHandler, patientTestDetailHandler,
    cleanUp,
  } = usePatientTest();

  useEffect(() => {
    if (formType === "edit" && id) {
      patientTestDetailHandler(id, () => {});
    }
    return () => {
      cleanUp();
      dispatch(clearPatientTestDetailSlice());
    };
  }, [id, formType]);

  // const testData = useSelector((state: any) => state.test.testDetailData);
  // const { values, handleChange ,handleTipTapChange} = useForm<Test | null>(testData);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let testFormObj: Partial<Test> = {};
    try {
      for (let [key, value] of formData.entries()) {
        testFormObj[key as keyof Test] = value as any;
      }
      await validationForm.validate(testFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addPatientTestHandler(testFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Test Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to add Test",
              variant: "destructive",
            });
          }
        });
      } else if (id) {
        patientTestEditHandler(id, testFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Test Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to update Test",
              variant: "destructive",
            });
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
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
      <View className="border border-border dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            weight="font-bold"
            className="text-2xl font-bold text-center text-primary mb-1"
          >
            Add Patient Test
          </Text>

          <Button onPress={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details to create a Test
        </Text>
        <form onSubmit={handleSubmit}>
           <View className="space-y-4">
              <Text
                as="h3"
                className="text-lg border-b pb-2 mb-4"
                weight="font-bold"
              >
                Test Details
              </Text>
              <SectionOne
                // errorDOB={formErrors.dob}
                // errorEmail={formErrors.email}
                // errorPhoneNo={formErrors.phone_no}
                // errorsGender={formErrors.gender}
                // errorLastName={formErrors.last_name}
                // errorFirstName={formErrors.first_name}
                // errorAttendantWithPatientName={
                //   formErrors.attendant_with_patient_name
                // }
                // errorAttendantWithPatientPhoneNo={
                //   formErrors.attendant_with_patient_phone_no
                // }
              />
            </View>
           <View className="space-y-4 mt-8">
              <Text
                as="h3"
                className="text-lg border-b pb-2 mb-4"
                weight="font-bold"
              >
                Associations
              </Text>
              <SectionTwo
                // errorDOB={formErrors.dob}
                // errorEmail={formErrors.email}
                // errorPhoneNo={formErrors.phone_no}
                // errorsGender={formErrors.gender}
                // errorLastName={formErrors.last_name}
                // errorFirstName={formErrors.first_name}
                // errorAttendantWithPatientName={
                //   formErrors.attendant_with_patient_name
                // }
                // errorAttendantWithPatientPhoneNo={
                //   formErrors.attendant_with_patient_phone_no
                // }
              />
            </View>
           <View className="space-y-4 mt-8">
              <Text
                as="h3"
                className="text-lg border-b pb-2 mb-4"
                weight="font-bold"
              >
                 Test Status
              </Text>
              <SectionThree
                // errorDOB={formErrors.dob}
                // errorEmail={formErrors.email}
                // errorPhoneNo={formErrors.phone_no}
                // errorsGender={formErrors.gender}
                // errorLastName={formErrors.last_name}
                // errorFirstName={formErrors.first_name}
                // errorAttendantWithPatientName={
                //   formErrors.attendant_with_patient_name
                // }
                // errorAttendantWithPatientPhoneNo={
                //   formErrors.attendant_with_patient_phone_no
                // }
              />
            </View>
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
export default PatientTestForm;
