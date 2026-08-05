import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import { validationForm } from "./validationForm";
import { clearComorbiditySlice } from "@/actions/slices/comorbidities";
import { useDiagnosis } from "@/actions/calls/diagnosis";
import { Diagnosis } from "@/interfaces/slices/diagnosis";
import BouncingLoader from "@/components/BouncingLoader";

const DiagnosisForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addDiagnosis, updateDiagnosis, cleanUp, diagnosisDetail } =
    useDiagnosis();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      diagnosisDetail(id, () => {}, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearComorbiditySlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let diagnosisFormObj: Partial<Diagnosis> = {};

    try {
      for (let [key, value] of formData.entries()) {
        diagnosisFormObj[key as keyof Diagnosis] = value as any;
      }

      await validationForm.validate(diagnosisFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addDiagnosis(diagnosisFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Diagnosis Added successfully.",
              variant: "success",
            });
            if (onModalSuccess) {
              return onModalSuccess();
            }
            navigate(-1);
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Diagnosis",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateDiagnosis(id, diagnosisFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Diagnosis Updated successfully.",
              variant: "success",
            });
            if (onModalSuccess) {
              return onModalSuccess();
            }
            navigate(-1);
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Diagnosis",
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
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            weight="font-bold"
            className="text-2xl font-bold text-center text-primary "
          >
            Diagnosis
          </Text>
          {!onModalSuccess && (
            <Button onPress={() => navigate(-1)} variant="outline">
              Back to Home
            </Button>
          )}
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details
        </Text>
        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsDiagnosisName={errors.diagnosis_name}
            errorsStatus={errors.is_active}
            errorsDepartmentType={errors.department_type}
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

export default DiagnosisForm;
