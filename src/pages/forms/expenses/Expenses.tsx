import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { validationForm } from "./validationForm";
import { useExpenses } from "@/actions/calls/expenses";
import { clearExpenseSlice } from "@/actions/slices/expenses";
import { Expenses } from "@/interfaces/slices/expenses";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";
import { imageUpload } from "@/actions/calls/uesImage";

const ExpensesPage: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addExpenses, updateExpenses, cleanUp, expensesDetail } =
    useExpenses();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      expensesDetail(id, () => {});
    }
    return () => {
      cleanUp();
      dispatch(clearExpenseSlice());
    };
  }, [id, formType]);

  const expensesData = useSelector(
    (state: RootState) => state.expenses.expensesDetails
  );
  const expenseDetail = { ...expensesData, id_edited: false };

  const { values: formValues, onSetHandler } =
    useForm<Partial<Expenses> | null>(expenseDetail);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const expensesFormObj: Partial<Expenses> = {};

    try {
      for (let [key, value] of formData.entries()) {
        expensesFormObj[key as keyof Expenses] = value as any;
      }

      if (formData.get("generate_voucher_number") === "on") {
          (expensesFormObj as any)["generate_voucher_number"] = true;
        } else {
          (expensesFormObj as any)["generate_voucher_number"] = false;
        }

      expensesFormObj["image"] = formValues?.image;

      await validationForm.validate(expensesFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      delete expensesFormObj["image"];
      if (formType === "add") {
        addExpenses(expensesFormObj, (success: boolean, response: any) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Expense Added successfully.",
              variant: "success",
            });
            const expenseId = response?.data?.id;
            if (expenseId && formValues?.image) {
              const imageUploadData = {
                id: expenseId,
                modal_type: "expense",
                file_name: "image",
                folder_name: "expense_image",
                image: formValues?.image,
              };
              imageUpload(imageUploadData, (success, _) => {
                if (success) {
                  toast({
                    title: "Success!",
                    description: "File uploaded successfully",
                    variant: "success",
                  });
                } else {
                  // toast({
                  //   title: "Error!",
                  //   description: "Failed to upload File",
                  //   variant: "destructive",
                  // });
                }
              });
            }
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to add Expense",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateExpenses(id, expensesFormObj, (success: boolean, _: any) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Expense Updated successfully.",
              variant: "success",
            });
            // const expenseId = response?.data?.id;
            if (formValues?.image) {
              const imageUploadData = {
                id: id,
                modal_type: "expense",
                file_name: "image",
                folder_name: "expense_image",
                image: formValues?.image,
              };
              imageUpload(imageUploadData, (success, _) => {
                if (success) {
                  toast({
                    title: "Success!",
                    description: "File uploaded successfully",
                    variant: "success",
                  });
                } else {
                  // toast({
                  //   title: "Error!",
                  //   description: "Failed to upload File",
                  //   variant: "destructive",
                  // });
                }
              });
            }
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Expense",
            //   variant: "destructive",
            // });
          }
          setIsSubmitting(false);
        });
      }
    } catch (error: any) {
      console.log(error);
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
              {formType === "add" ? "New Expense" : "Edit Expense"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the expense details
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
            errorsDate={errors.date}
            errorsAmount={errors.amount}
            errorsDescription={errors.description}
            errorsModeOfPayment={errors.mode_of_payment}
            errorsTransactionId={errors.transaction_id}
            errorsName={errors.expense_name}
            setImage={onSetHandler}
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

export default ExpensesPage;
