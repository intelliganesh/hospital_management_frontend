import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { MedicineCategoryMapping } from "@/interfaces/medicines/medicine_category";
import { useMedicineCategoryMapping } from "@/actions/calls/medicineCategoryMapping";
import { validationForm } from "./validationForm";
import { RootState } from "@/actions/store";
import { useSelector } from "react-redux";
import Select from "@/components/Select";

const MedicineCategoryMappingForm: React.FC<FormTypeProps> = ({
  formType = "add",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    cleanUp,
    medicineCategoryMapingGet,
    medicineCategoryMapingAllList,
    addMedicineCategoryMappingHandler,
    editMedicineCategoryMappingHandler,
  } = useMedicineCategoryMapping();

  useEffect(() => {
    if (formType === "edit" && id) {
      medicineCategoryMapingGet(id, () => {});
    }
    medicineCategoryMapingAllList((_: boolean) => {});
    return () => {
      cleanUp();
    };
  }, []);

  const medicineCategoryMappingDetails = useSelector(
    (state: RootState) =>
      state.medicineCategoryMapping.medicineCategoryMappingDetails
  );
  const medicineCategoryMappingAllListData = useSelector(
    (state: RootState) =>
      state.medicineCategoryMapping.medicineCategoryMappingAllListData
  );
  const { values, onSetHandler } = useForm<MedicineCategoryMapping | null>(
    medicineCategoryMappingDetails
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let medicineCategoryMappingFormObj: Partial<MedicineCategoryMapping> = {};
    try {
      for (let [key, value] of formData.entries()) {
        medicineCategoryMappingFormObj[key as keyof MedicineCategoryMapping] =
          value as any;
      }
      await validationForm.validate(medicineCategoryMappingFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addMedicineCategoryMappingHandler(
          medicineCategoryMappingFormObj,
          (success: boolean) => {
            if (success) {
              navigate(-1);
              toast({
                title: "Success!",
                description: "Medicine Category Mapping Added successfully.",
                variant: "success",
              });
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to add Medicine Category Mapping",
              //   variant: "destructive",
              // });
            }
          }
        );
      } else if (id) {
        editMedicineCategoryMappingHandler(
          id,
          medicineCategoryMappingFormObj,
          (success: boolean) => {
            if (success) {
              navigate(-1);
              toast({
                title: "Success!",
                description: "Medicine Category Mapping Updated successfully.",
                variant: "success",
              });
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to update Medicine Category Mapping",
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
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add"
                ? "New Medicine Category Mapping"
                : "Edit Medicine Category Mapping"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Medicine Category Mapping details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <View>
              <Select
                required={true}
                id="medicine_id"
                name="medicine_id"
                label="Medicine Name"
                error={errors?.medicine_id}
                placeholder="Medicine Name"
                options={medicineCategoryMappingAllListData?.medicine?.map(
                  (value: any) => {
                    return { label: value.medicine_name, value: value.id };
                  }
                )}
                value={values?.medicine_id}
                onChange={(e: any) => {
                  onSetHandler("medicine_id", e.target.value);
                }}
              />
            </View>
            <View>
              <Select
                required={true}
                id="category_id"
                name="category_id"
                label="Category Name"
                error={errors?.category_id}
                placeholder="Category Name"
                options={medicineCategoryMappingAllListData?.medicine_category?.map(
                  (value: any) => {
                    return { label: value.category_name, value: value.id };
                  }
                )}
                value={values?.category_id}
                onChange={(e: any) => {
                  onSetHandler("category_id", e.target.value);
                }}
              />
            </View>
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
export default MedicineCategoryMappingForm;
