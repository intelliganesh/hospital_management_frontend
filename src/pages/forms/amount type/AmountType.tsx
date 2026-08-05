import Text from "@/components/text";
import View from "@/components/view";
import SectionOne from "./SectionOne";
import Button from "@/components/button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { FormTypeProps } from "@/interfaces/dashboard";
import { toast } from "@/utils/custom-hooks/use-toast";

import { useNavigate, useParams } from "react-router-dom";
import { useAmountType } from "@/actions/calls/amountType";
import { clearAmountTypeDetailSlice } from "@/actions/slices/amountType";
import { AmountType } from "@/interfaces/master/amount types";
import BouncingLoader from "@/components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";

const AmountTypeForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    addAmountTypeHandler,
    editAmountTypeHandler,
    amountTypeDetailHandler,
    cleanUp,
  } = useAmountType();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      amountTypeDetailHandler(id, () => { }, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearAmountTypeDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let amountTypeFormObj: Partial<AmountType> = {};

    try {
      for (let [key, value] of formData.entries()) {
        amountTypeFormObj[key as keyof AmountType] = value as any;
      }
      await validationForm.validate(amountTypeFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addAmountTypeHandler(amountTypeFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Amount Type Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Amount Type",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editAmountTypeHandler(id, amountTypeFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Amount Type Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Amount Type",
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
              {formType === "add" ? "New Amount Type" : "Edit Amount Type"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the amount type details
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
            errorName={errors?.amount_for}
            errorStatus={errors?.status}
            errorDescription={errors?.description}
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

export default AmountTypeForm;
