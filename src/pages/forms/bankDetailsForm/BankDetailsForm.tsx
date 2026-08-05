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
import { useBankDetails } from "@/actions/calls/bankDetails";
import { clearBankDetailsDetailSlice } from "@/actions/slices/bankDetails";
import { BankDetails } from "@/interfaces/bankDetails/index";
import BouncingLoader from "@/components/BouncingLoader";

const BankDetailsForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    addBankDetailsHandler,
    bankDetailsDetailHandler,
    editBankDetailsHandler,
  } = useBankDetails();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      bankDetailsDetailHandler(
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
      dispatch(clearBankDetailsDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let bankDetailsFormObj: Partial<BankDetails> = {};

    try {
      for (let [key, value] of formData.entries()) {
        bankDetailsFormObj[key as keyof BankDetails] = value as any;
      }
      bankDetailsFormObj["is_active"] =
        Number(bankDetailsFormObj["is_active" as keyof BankDetails]) === 1
          ? 1
          : 0;

      await validationForm.validate(bankDetailsFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);

      if (formType === "add") {
        addBankDetailsHandler(bankDetailsFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Bank Details Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
          }
        });
      } else if (id) {
        editBankDetailsHandler(id, bankDetailsFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Bank Details Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
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
              {formType === "add" ? "New Bank Details" : "Edit Bank Details"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the bank information
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
            errorsBankName={errors.title}
            errorsAccountDetails={errors.details}
            errorsIsActive={errors.is_active}
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

export default BankDetailsForm;
