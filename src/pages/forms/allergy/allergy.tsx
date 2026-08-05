import Text from "@/components/text";
import View from "@/components/view";
import SectionOne from "./SectionOne";
import Button from "@/components/button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { FormTypeProps } from "@/interfaces/dashboard";
import { toast } from "@/utils/custom-hooks/use-toast";
import { AllergyRecord } from "@/interfaces/allergies";
import { useAllergies } from "@/actions/calls/allergies";
import { useNavigate, useParams } from "react-router-dom";
import { clearAllergies } from "@/actions/slices/allergies";
import BouncingLoader from "@/components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";

const AllergyForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    addAllergyHandler,
    editAllergyHandler,
    allergyDetailHandler,
    cleanUp,
  } = useAllergies();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      allergyDetailHandler(id, () => {}, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearAllergies());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let allergyFormObj: Partial<AllergyRecord> = {};

    try {
      for (let [key, value] of formData.entries()) {
        allergyFormObj[key as keyof AllergyRecord] = value as any;
      }
      await validationForm.validate(allergyFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addAllergyHandler(allergyFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Allergy Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Allergy",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editAllergyHandler(id, allergyFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Allergy Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Allergy",
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
              {formType === "add" ? "New Allergy" : "Edit Allergy"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the allergy details
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
        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsNotes={errors.notes}
            errorsManagement={errors.management}
            errorsAllergyName={errors.allergen_name}
            errorsAllergyType={errors.allergen_type}
            errorsDocumentedBy={errors.documented_by}
            errorsOtherAllergenType={errors.other_allergen_type}
            errorDepartmentType={errors.department_type}
            // errorsDateFirstExperienced={errors.date_first_experienced}
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

export default AllergyForm;
