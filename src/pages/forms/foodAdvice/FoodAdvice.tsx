import { useFoodAdvice } from "@/actions/calls/foodAdvice";
import { clearFoodAdviceSlice } from "@/actions/slices/foodAdvice";
import { RootState } from "@/actions/store";
import Button from "@/components/button";
import Input from "@/components/input";
import Text from "@/components/text";
import View from "@/components/view";
import { FormTypeProps } from "@/interfaces/dashboard";
import useForm from "@/utils/custom-hooks/use-form";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import {
  FoodAdvice,
  foodAdviceStatusOptions,
  foodAdviceTimingsOptions,
} from "@/interfaces/slices/foodAdvice";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";

const FoodAdviceForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const foodAdviceData = useSelector(
    (state: RootState) => state.foodAdvice.foodAdviceDetails
  );
  const { values, handleChange, onSetHandler } = useForm<FoodAdvice | null>(
    foodAdviceData
  );
  const { addFoodAdvice, updateFoodAdvice, foodAdviceDetail, cleanUp } =
    useFoodAdvice();

  useEffect(() => {
    if (formType === "edit" && id) {
      foodAdviceDetail(id, () => { }, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearFoodAdviceSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const foodAdviceFormObj: Partial<FoodAdvice> = {};

    try {
      for (let [key, value] of formData.entries()) {
        foodAdviceFormObj[key as keyof FoodAdvice] = value as any;
      }
      await validationForm.validate(foodAdviceFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addFoodAdvice(foodAdviceFormObj, (success) => {
          setIsSubmitting(false);
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "The Food Advice created successfully.",
              variant: "success",
            });
          } else {
            // toast({
            //   title: "Error!",
            //   description: response?.message,
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateFoodAdvice(id, foodAdviceFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Food Advice Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Food Advice",
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
              {formType === "add" ? "New Food Advice" : "Edit Food Advice"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the food advice details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <View>
              <Input
                id="advice_text"
                name="advice_text"
                required={true}
                label="Food Advice"
                error={errors?.advice_text}
                value={values?.advice_text}
                onChange={handleChange}
                placeholder="Food Advice"
              />
            </View>
            <View>
              <SingleSelector
                id="meal_times"
                required={true}
                name="meal_times"
                label="Timings"
                error={errors?.meal_times}
                placeholder="Timings"
                value={values?.meal_times ?? ""}
                options={foodAdviceTimingsOptions}
                onChange={(e: any) =>
                  onSetHandler("meal_times", e.target.value)
                }
              />
            </View>
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <View>
              <DepartmentType
                value={values?.department_type}
                error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
                required={true}
              />
            </View>
            <View>
              <SingleSelector
                id="status"
                required={true}
                name="status"
                label="Status"
                error={errors?.status}
                placeholder="Status"
                value={values?.status || GenericStatus.ACTIVE}
                options={foodAdviceStatusOptions}
                onChange={(e: any) => onSetHandler("status", e.target.value)}
              />
            </View>
          </View>
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

export default FoodAdviceForm;
