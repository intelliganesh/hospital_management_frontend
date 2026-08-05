import { useSurgicalHistory } from "@/actions/calls/surgicalHistory";
import { clearSurgicalHistoryDetailDataSlice } from "@/actions/slices/surgicalHistory";
import { RootState } from "@/actions/store";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import Text from "@/components/text";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { FormTypeProps } from "@/interfaces/dashboard";
import {
  SurgicalHistory,
  surgicalHistoryTypeOptions,
} from "@/interfaces/slices/surgicalHistory";
import useForm from "@/utils/custom-hooks/use-form";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";
import { GenericStatus } from "@/interfaces";

const SurgicalHistoryForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  iAmIn = "",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const surgicalData = useSelector(
    (state: RootState) => state.surgicalHistory.surgicalHistoryDetailData
  );

  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";

  const { values, handleChange, onSetHandler } =
    useForm<SurgicalHistory | null>(surgicalData);
  const {
    addSurgicalHistory,
    surgicalHistoryUpdate,
    surgicalHistoryDetail,
    cleanUp,
  } = useSurgicalHistory();

  useEffect(() => {
    if (formType === "edit" && id) {
      surgicalHistoryDetail(
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
      dispatch(clearSurgicalHistoryDetailDataSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const surgicalFormObj: Partial<SurgicalHistory> = {};

    try {
      for (let [key, value] of formData.entries()) {
        surgicalFormObj[key as keyof SurgicalHistory] = value as any;
      }
      await validationForm.validate(surgicalFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addSurgicalHistory(surgicalFormObj, (success) => {
          setIsSubmitting(false);
          if (success) {
            toast({
              title: "Success!",
              description:
                "The Surgical History has been created successfully.",
              variant: "success",
            });
            if (onModalSuccess) {
              return onModalSuccess();
            }
            navigate(-1);
          } else {
            // toast({
            //   title: "Error!",
            //   description: response?.message,
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        surgicalHistoryUpdate(id, surgicalFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Surgical History Updated successfully.",
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
            //   description: "Failed to update Surgical History",
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
              {formType === "add"
                ? "New Surgical History"
                : "Edit Surgical History"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the surgical history details
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
          {/* <Button
            onPress={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Back
          </Button> */}
        </View>
        <form onSubmit={handleSubmit}>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <View>
              <Input
                id="surgery_name"
                name="surgery_name"
                required={true}
                label="Surgery Name"
                error={errors?.surgery_name}
                value={values?.surgery_name}
                onChange={handleChange}
                placeholder="Surgery Name"
              />
            </View>
            <View>
              <DepartmentType
                value={values?.department_type ? values?.department_type : (iAmIn === "consultation") && departmentType ? departmentType : ""}
                error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
                required={true}
              />
            </View>
          </View>

          <View className="mt-4">
            <Textarea
              id="description"
              name="description"
              label="Description"
              value={values?.description ?? ""}
              onChange={handleChange}
              placeholder="Description"
            />
          </View>
          <View>
            <SingleSelector
              id="is_active"
              label="Status"
              name="is_active"
              required={true}
              error={errors?.is_active}
              value={values?.is_active || GenericStatus.ACTIVE}
              placeholder="Select Status"
              onChange={(value) => {
                onSetHandler("is_active", value);
              }}
              options={surgicalHistoryTypeOptions}
            />
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

export default SurgicalHistoryForm;
