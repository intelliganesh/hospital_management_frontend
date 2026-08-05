import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import { useOnExamination } from "@/actions/calls/onExamination";
import { clearOnExaminationSlice } from "@/actions/slices/onExamination";
import { OnExamination } from "@/interfaces/slices/onExamination";
import { validationForm } from "./validationForm";
import BouncingLoader from "@/components/BouncingLoader";

const OnExaminationForms: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  iAmIn = "",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    addOnExamination,
    updateOnExamination,
    cleanUp,
    onExaminationDetail,
  } = useOnExamination();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      onExaminationDetail(
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
      dispatch(clearOnExaminationSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let onExaminationFormObj: Partial<OnExamination> = {};

    try {
      for (let [key, value] of formData.entries()) {
        onExaminationFormObj[key as keyof OnExamination] = value as any;
      }
      await validationForm.validate(onExaminationFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addOnExamination(onExaminationFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "On Examination Added successfully.",
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
            //   description: "Failed to add On Examination",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateOnExamination(id, onExaminationFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "On Examination Updated successfully.",
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
            //   description: "Failed to update On Examination",
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
              {formType === "add"
                ? "New On Examination"
                : "Edit On Examination"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the on examination details
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
            errorsFinding={errors.finding}
            errorsStatus={errors.status}
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

export default OnExaminationForms;
