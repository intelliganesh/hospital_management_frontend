import Button from "@/components/button";
import Input from "@/components/input";
import Text from "@/components/text";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useMedicineCategory } from "@/actions/calls/medicineCategory";
import { clearMedicineCategoryDetailSlice } from "@/actions/slices/medicineCategory";
import { RootState } from "@/actions/store";
import { MedicineCategory } from "@/interfaces/medicines/medicine_category";
import BouncingLoader from "@/components/BouncingLoader";

const MedicineCategoryForm: React.FC<FormTypeProps> = ({
  formType = "add",
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    addMedicineCategoryHandler,
    editMedicineCategoryHandler,
    detailMedicineCategoryHandler,
    cleanUp,
  } = useMedicineCategory();

  useEffect(() => {
    if (formType === "edit" && id) {
      detailMedicineCategoryHandler(id, () => { }, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearMedicineCategoryDetailSlice());
    };
  }, [id, formType]);

  const medicineCategoryData = useSelector(
    (state: RootState) => state.medicineCategory.medicineCategoryDetailData
  );
  const { values, handleChange } = useForm<MedicineCategory | null>(
    medicineCategoryData
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let medicineCategoryFormObj: Partial<MedicineCategory> = {};
    try {
      for (let [key, value] of formData.entries()) {
        medicineCategoryFormObj[key as keyof MedicineCategory] = value as any;
      }
      await validationForm.validate(medicineCategoryFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addMedicineCategoryHandler(
          medicineCategoryFormObj,
          (success: boolean) => {
            if (success) {
              navigate(-1);
              toast({
                title: "Success!",
                description: "Medicine Category Added successfully.",
                variant: "success",
              });
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to add Medicine Category",
              //   variant: "destructive",
              // });
            }
          }
        );
      } else if (id) {
        editMedicineCategoryHandler(
          id,
          medicineCategoryFormObj,
          (success: boolean) => {
            if (success) {
              navigate(-1);
              toast({
                title: "Success!",
                description: "Medicine Category Updated successfully.",
                variant: "success",
              });
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to update Medicine Category",
              //   variant: "destructive",
              // });
            }
          }
        );
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
              {formType === "add" ? "New Medicine Category" : "Edit Medicine Category"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the medicine category details
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
          <View>
            <Input
              required={true}
              id="category_name"
              name="category_name"
              label="Category Name"
              onChange={handleChange}
              placeholder="Category Name"
              error={errors?.category_name}
              value={values?.category_name}
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
export default MedicineCategoryForm;
