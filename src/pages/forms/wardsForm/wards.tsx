import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import { useWards } from "@/actions/calls/wards";
import { Ward } from "@/interfaces/wards";
import { clearWardDetailSlice } from "@/actions/slices/wards";

const WardsForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addWardHandler, wardDetailHandler, editWardHandler } = useWards();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      wardDetailHandler(id, () => {});
    }
    return () => {
      dispatch(clearWardDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let wardFormObj: Partial<Ward> = {};

    try {
      for (let [key, value] of formData.entries()) {
        wardFormObj[key as keyof Ward] = value as any;
      }
      await validationForm.validate(wardFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      
      if (formType === "add") {
        addWardHandler(wardFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Ward Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description:  "Failed to add Ward",
              variant: "destructive",
            });
          }
        });
      } else if (id) {
        editWardHandler(id, wardFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Ward Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to update Ward",
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
            className="text-2xl font-bold text-center text-primary "
          >
            Ward Registration
          </Text>
          <Button onPress={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details to register Ward
        </Text>
        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsName={errors.name}
            errorsType={errors.type}
            errorsWardNumber={errors.ward_number}
            // errorsLocation={errors.location}
            errorsStatus={errors.status}
            errorsFloor={errors.floor}
            errorsDescription={errors.description}
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

export default WardsForm;
