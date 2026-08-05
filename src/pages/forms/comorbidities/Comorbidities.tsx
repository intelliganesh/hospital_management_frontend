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
import { useComorbidity } from "@/actions/calls/comorbidities";
import { clearComorbiditySlice } from "@/actions/slices/comorbidities";
import { Comorbidity } from "@/interfaces/slices/comorbidities";
import BouncingLoader from "@/components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";

const ComorbidityForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  iAmIn = "",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addComorbidity, comobidityUpdate, cleanUp, comorbidityDetail } =
    useComorbidity();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      comorbidityDetail(
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
      dispatch(clearComorbiditySlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let comorbidityFormObj: Partial<Comorbidity> = {};

    try {
      for (let [key, value] of formData.entries()) {
        if (key === "is_chronic") {
          comorbidityFormObj[key as keyof Comorbidity] = value === "True";
        } else {
          comorbidityFormObj[key as keyof Comorbidity] = value as any;
        }
      }

      await validationForm.validate(comorbidityFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addComorbidity(comorbidityFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Comorbidities Added successfully.",
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
            //   description: "Failed to add Comorbidities",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        comobidityUpdate(id, comorbidityFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Comorbidities Updated successfully.",
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
            //   description: "Failed to update Comorbidities",
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
      <BouncingLoader isLoading={isLoading} />
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add" ? "New Comorbidities" : "Edit Comorbidities"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Comorbidities details
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
        </View>
        <form onSubmit={handleSubmit}>
          <SectionOne
            iAmIn={iAmIn}
            errorsName={errors.name}
            errorsIsChronic={errors.is_chronic}
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

export default ComorbidityForm;
