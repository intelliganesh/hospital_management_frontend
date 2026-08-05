import Text from "@/components/text";
import View from "@/components/view";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { FormTypeProps } from "@/interfaces/dashboard";
import { toast } from "@/utils/custom-hooks/use-toast";

import { useNavigate, useParams } from "react-router-dom";
import useForm from "@/utils/custom-hooks/use-form";
// import { dietStatusOptions } from "./dietFormOptions";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";
import { Dre } from "@/interfaces/dre";
import { useDre } from "@/actions/calls/dre";
import { clearDreDetailSlice } from "@/actions/slices/dre";
import Input from "@/components/input";

const DreForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
  iAmIn = ""
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addDreHandler, editDreHandler, dreDetailHandler, cleanUp } = useDre();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dreData = useSelector((state: any) => state.dre.dreDetailData);
  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";
  const { values, handleChange, onSetHandler } = useForm<Dre | null>(dreData);

  useEffect(() => {
    if (formType === "edit" && id) {
      dreDetailHandler(
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
      dispatch(clearDreDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let dreFormObj: Partial<Dre> = {};

    try {
      for (let [key, value] of formData.entries()) {
        dreFormObj[key as keyof Dre] = value as any;
      }
      await validationForm.validate(dreFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addDreHandler(dreFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "DRE Added successfully.",
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
            //   description: "Failed to add DRE",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editDreHandler(id, dreFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "DRE Updated successfully.",
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
            //   description: "Failed to update DRE",
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
              {formType === "add" ? "New DRE" : "Edit DRE"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the DRE details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Input
                required={true}
                id="dre_name"
                name="dre_name"
                label="DRE Name"
                onChange={handleChange}
                // options={dres}
                error={errors?.dre_name}
                value={values?.dre_name || ""}
                placeholder="DRE Name"
              />
            </View>
            <View>
              <DepartmentType
                required={true}
                value={values?.department_type ? values?.department_type : (iAmIn === "consultation") && departmentType ? departmentType : ""}
                error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
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

export default DreForm;
