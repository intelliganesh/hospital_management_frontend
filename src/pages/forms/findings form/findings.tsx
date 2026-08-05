import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { Finding } from "@/interfaces/findings";
import { useFindings } from "@/actions/calls/findings";

const FindingsForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addFindingHandler, editFindingHandler } = useFindings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const findingFormObj: Partial<Finding> = {};

    try {
      for (let [key, value] of formData.entries()) {

        findingFormObj[key as keyof Finding] = value as any;
      }
      await validationForm.validate(findingFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addFindingHandler(findingFormObj, (success, response) => {
          setIsSubmitting(false);
          if (success) {
            toast({
              title: "Success!",
              description: "The role has been created successfully.",
              variant: "default",
            });
            navigate(-1);
          } else {
            toast({
              title: "Error!",
              description: response?.message,
              variant: "destructive",
            });
          }
        });
      } else if (id) {
        editFindingHandler(id, findingFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Role Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to update Role",
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
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            weight="font-bold"
            className="text-2xl font-bold text-center text-primary mb-2"
          >
            {formType === "add" ? "New Finding" : "Edit Finding"}
          </Text>
          <Button onPress={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill the finding details
        </Text>
        <form onSubmit={handleSubmit}>
          <SectionOne
            formType={formType}
            errorsName={errors.finding_name}
            errorsDescription={errors.finding_description}
            errorsCategory={errors.category}
            errorsStatus={errors.status}
          />
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              onPress={() => handleSubmit}
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
export default FindingsForm;
