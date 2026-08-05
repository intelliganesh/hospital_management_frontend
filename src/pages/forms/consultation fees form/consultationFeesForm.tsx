import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SectionOne from "./SectionOne";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";

import { useConsultationFees } from "@/actions/calls/consultationFees";
import { ConsultationFees } from "@/interfaces/master/consultatoin fees(cost)";
import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import { statusOptions } from "./consultationFormOptions";
import { clearConsultationFeesDetailSlice } from "@/actions/slices/consultationFees";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";

const ConsultationFeesForm: React.FC<FormTypeProps> = ({
  formType = "add",
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    addConsultationFeesHandler,
    editConsultationFeesHandler,
    consultationFeesDetailHandler,
    cleanUp,
  } = useConsultationFees();
  const consultationFeesData = useSelector(
    (state: any) => state?.consultationFees?.consultationFeesDetailData
  );
  const { values, handleChange, onSetHandler } =
    useForm<ConsultationFees | null>(consultationFeesData);

  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);
  useEffect(() => {
    if (id) {
      consultationFeesDetailHandler(id, () => { }, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearConsultationFeesDetailSlice());
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const consultationFeesFormObj: Partial<ConsultationFees> = {};

    try {
      for (let [key, value] of formData.entries()) {
        consultationFeesFormObj[key as keyof ConsultationFees] = value as any;
      }
      await validationForm.validate(consultationFeesFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addConsultationFeesHandler(
          consultationFeesFormObj,
          (success) => {
            setIsSubmitting(false);
            if (success) {
              toast({
                title: "Success!",
                description: "The consultation fees added successfully.",
                variant: "default",
              });
              navigate(-1);
            } else {
              // toast({
              //   title: "Error!",
              //   description: response?.message,
              //   variant: "destructive",
              // });
            }
          }
        );
      } else if (id) {
        editConsultationFeesHandler(
          id,
          consultationFeesFormObj,
          (success: boolean) => {
            if (success) {
              navigate(-1);
              toast({
                title: "Success!",
                description: "Consultation Fees Updated successfully.",
                variant: "success",
              });
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to update Consultation Fees",
              //   variant: "destructive",
              // });
            }
            setIsSubmitting(false);
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
              {formType === "add" ? "New Consultaton Fees" : "Edit Consultaton Fees"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the consultaton fees details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Input
                id="consultation_name"
                name="consultation_name"
                required={true}
                error={errors?.consultation_name}
                label="Consultation Name"
                value={values?.consultation_name || ""}
                onChange={handleChange}
                placeholder="Enter Name"
              />
            </View>
            <View>
              <Input
                id="amount"
                name="amount"
                required={true}
                error={errors?.amount}
                label="Consultation Amount"
                value={values?.amount || ""}
                onChange={handleChange}
                placeholder="Enter Finding Name"
              />
            </View>
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <View>
              <DepartmentType
                value={values?.department_type}
                // error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
                // required={true}
              />
            </View>
            <View>
              <SingleSelector
                id="status"
                label="Status"
                name="status"
                error={errors?.status}
                value={values?.status || statusOptions[0].value}
                placeholder="Select Status"
                onChange={(value) => {
                  onSetHandler("status", value);
                }}
                options={statusOptions}
                required={true}
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
export default ConsultationFeesForm;
