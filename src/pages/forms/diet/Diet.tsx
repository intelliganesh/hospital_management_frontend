import Text from "@/components/text";
import View from "@/components/view";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { FormTypeProps } from "@/interfaces/dashboard";
import { toast } from "@/utils/custom-hooks/use-toast";

import { useNavigate, useParams } from "react-router-dom";
import { useDiet } from "@/actions/calls/diet";
import { clearDieticianDetailSlice } from "@/actions/slices/diet";
import { Diet } from "@/interfaces/master/diet";
import useForm from "@/utils/custom-hooks/use-form";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import { dietStatusOptions } from "./dietFormOptions";
import Textarea from "@/components/Textarea";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";

const DietForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  iAmIn = ""
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addDietHandler, editDietHandler, dietDetailHandler, cleanUp } =
    useDiet();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dietData = useSelector((state: any) => state.diet.dietDetailData);
  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";
  const { values, handleChange, onSetHandler } = useForm<Diet | null>(dietData);

  useEffect(() => {
    if (formType === "edit" && id) {
      dietDetailHandler(
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
      dispatch(clearDieticianDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let dietFormObj: Partial<Diet> = {};

    try {
      for (let [key, value] of formData.entries()) {
        dietFormObj[key as keyof Diet] = value as any;
      }
      await validationForm.validate(dietFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addDietHandler(dietFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Diet Added successfully.",
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
            //   description: "Failed to add Diet",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editDietHandler(id, dietFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Diet Updated successfully.",
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
            //   description: "Failed to update Diet",
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
              {formType === "add" ? "New Diet" : "Edit Diet"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Diet details
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
          {/* <SectionOne
             errorName = {errors?.amount_for}
            errorStatus={errors?.status}
            errorDescription={errors?.description}
          /> */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Input
                required={true}
                id="diet_name"
                name="diet_name"
                label="Diet Name"
                onChange={handleChange}
                error={errors?.diet_name}
                value={values?.diet_name || ""}
                placeholder="Enter Diet Name"
              />
            </View>
            <View>
              <Input
                // required={true}
                id="calories"
                name="calories"
                label="Calories"
                onChange={handleChange}
                error={errors?.calories}
                value={values?.calories || ""}
                placeholder="Enter Calories"
              />
            </View>
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <View className="col-span-2">
              <DepartmentType
                required={true}
                value={values?.department_type ? values?.department_type : (iAmIn === "consultation") && departmentType ? departmentType : ""}
                error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
              />
            </View>
          </View>
          <View className="mt-4">
            <Textarea
              id="description"
              name="description"
              label="Description"
              error={errors?.description}
              value={values?.description || ""}
              placeholder="Enter Description"
              onChange={handleChange}
            />
          </View>
          <View className="mt-4">
            <SingleSelector
              id="is_active"
              label="Is Active"
              name="is_active"
              error={errors?.is_active}
              value={values?.is_active || dietStatusOptions[0].value}
              placeholder="Select Is Active"
              onChange={(value) => {
                onSetHandler("is_active", value);
              }}
              options={dietStatusOptions}
              required={true}
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

export default DietForm;
