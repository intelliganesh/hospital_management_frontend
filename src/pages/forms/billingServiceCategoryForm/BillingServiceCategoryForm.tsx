import { clearBillingServiceCategoryDetailSlice } from "@/actions/slices/billingServiceCategory";
import { useBillingServiceCategory } from "@/actions/calls/billingServiceCategory";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import Text from "@/components/text";
import View from "@/components/view";
import { RootState } from "@/actions/store";
import { FormTypeProps } from "@/interfaces/dashboard";
import { BillingServiceCategory } from "@/interfaces/master/billingServiceCategory";
import { toast } from "@/utils/custom-hooks/use-toast";
import useForm from "@/utils/custom-hooks/use-form";
import { statusOptions } from "../serviceCostForm/serviceCostFormOptions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const normalizeBillingServiceCategory = (data: any) => ({
  ...data,
  category_name:
    data?.category_name || data?.service_category || data?.name || "",
});

const BillingServiceCategoryForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    addBillingServiceCategoryHandler,
    editBillingServiceCategoryHandler,
    billingServiceCategoryDetailHandler,
    cleanUp,
  } = useBillingServiceCategory();

  const billingServiceCategoryData = useSelector((state: RootState) =>
    normalizeBillingServiceCategory(
      state?.billingServiceCategory?.billingServiceCategoryDetailData
    )
  );

  const { values, handleChange, onSetHandler } =
    useForm<BillingServiceCategory | null>(billingServiceCategoryData);

  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);

  useEffect(() => {
    if (formType === "edit" && id) {
      billingServiceCategoryDetailHandler(id, () => {}, [], (status) => {
        setIsLoading(
          status === "pending"
            ? true
            : status === "failed"
            ? true
            : status === "success" && false
        );
      });
    }
    return () => {
      cleanUp();
      dispatch(clearBillingServiceCategoryDetailSlice());
    };
  }, [id]);

  const validateForm = (data: Partial<BillingServiceCategory>) => {
    const validationErrors: Record<string, string> = {};
    if (!data.category_name?.trim()) {
      validationErrors.category_name = "Category name is required";
    }
    if (!data.status) {
      validationErrors.status = "Status is required";
    }
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: Partial<BillingServiceCategory> = {
      category_name: values?.category_name || "",
      status: values?.status || statusOptions[0].value,
    };
    const validationErrors = validateForm(payload);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    if (formType === "add") {
      addBillingServiceCategoryHandler(payload, (success) => {
        setIsSubmitting(false);
        if (success) {
          toast({
            title: "Success!",
            description: "Billing service category added successfully.",
            variant: "success",
          });
          if (onModalSuccess) return onModalSuccess();
          navigate(-1);
        }
      });
      return;
    }

    if (id) {
      editBillingServiceCategoryHandler(id, payload, (success) => {
        setIsSubmitting(false);
        if (success) {
          toast({
            title: "Success!",
            description: "Billing service category updated successfully.",
            variant: "success",
          });
          if (onModalSuccess) return onModalSuccess();
          navigate(-1);
        }
      });
    }
  };

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-3xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add"
                ? "New Billing Service Category"
                : "Edit Billing Service Category"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the billing service category details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input
              id="category_name"
              name="category_name"
              required={true}
              error={errors?.category_name}
              label="Category Name"
              value={values?.category_name || ""}
              onChange={handleChange}
              placeholder="Enter Category Name"
            />
            <SingleSelector
              id="status"
              label="Status"
              name="status"
              error={errors?.status}
              value={values?.status || statusOptions[0].value}
              placeholder="Select Status"
              onChange={(value) => onSetHandler("status", value)}
              options={statusOptions}
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

export default BillingServiceCategoryForm;