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
import SingleSelector from "@/components/SingleSelector";
// import { dietStatusOptions } from "./dietFormOptions";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";
import { statusOptions, subFistulaOptions } from "./fistulaFormOptions";
import { useFistula } from "@/actions/calls/fistula";
import { clearFistulaDetailSlice } from "@/actions/slices/fistula";
import { Fistula } from "@/interfaces/fistula";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";

const FistulaForm: React.FC<FormTypeProps> = ({
  formType = "add",
  onModalSuccess,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addFistulaHandler, editFistulaHandler, fistulaDetailHandler, cleanUp } =
    useFistula();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fistulaData = useSelector((state: any) => state.fistula.fistulaDetailData);
  const { values, handleChange, onSetHandler } = useForm<Fistula | null>(fistulaData);

  useEffect(() => {
    if (formType === "edit" && id) {
      fistulaDetailHandler(id, () => { }, [], (status) => {
        setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
    return () => {
      cleanUp();
      dispatch(clearFistulaDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let fistulaFormObj: Partial<Fistula> = {};

    try {
      for (let [key, value] of formData.entries()) {
        fistulaFormObj[key as keyof Fistula] = value as any;
      }
      await validationForm.validate(fistulaFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addFistulaHandler(fistulaFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Fistula Added successfully.",
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
            //   description: "Failed to add Fistula",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        editFistulaHandler(id, fistulaFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Fistula Updated successfully.",
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
            //   description: "Failed to update Fistula",
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
              {formType === "add" ? "New Fistula" : "Edit Fistula"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Fistula details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required={true}
              id="fistula_name"
              name="fistula_name"
              label="Fistula Name"
              onChange={handleChange}
              error={errors?.fistula_name}
              value={values?.fistula_name || ""}
              placeholder="Select Fistula Name"
            />
            <SingleSelector
              required={true}
              id="sub_fistula_name"
              name="sub_fistula_name"
              label="Sub Fistula name"
              onChange={handleChange}
              options={subFistulaOptions}
              error={errors?.sub_fistula_name}
              value={values?.sub_fistula_name || ""}
              placeholder="Select Sub Fistula Name"
            />

            <View className="col-span-2">
              <Textarea
                id="description"
                name="description"
                label="Description"
                onChange={handleChange}
                error={errors?.description || ""}
                value={values?.description || ""}
                placeholder="Enter Description"
              />
            </View>
            {/* <View> */}
            <DepartmentType
              required={true}
              value={values?.department_type || ""}
              error={errors?.department_type}
              onChange={(value) => onSetHandler("department_type", value)}
            />
            {/* </View> */}
            <View>
              <SingleSelector
                id="is_active"
                label="Status"
                name="is_active"
                error={errors?.is_active}
                value={values?.is_active || statusOptions[0].value}
                placeholder="Select Status"
                onChange={(value) => {
                  onSetHandler("is_active", value);
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

export default FistulaForm;
