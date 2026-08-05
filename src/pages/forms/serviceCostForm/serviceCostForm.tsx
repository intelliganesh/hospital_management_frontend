import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SectionOne from "./SectionOne";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";

import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import { statusOptions } from "./serviceCostFormOptions";

import { useServiceCost } from "@/actions/calls/serviceCost";
import { ServiceCost } from "@/interfaces/master/serviceCost";
import Textarea from "@/components/Textarea";
import { clearserviceCostDetailSlice } from "@/actions/slices/serviceCost";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";

const ServiceCostForm: React.FC<FormTypeProps> = ({
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
    addServiceCostHandler,
    editServiceCostHandler,
    serviceCostDetailHandler,
    cleanUp,
  } = useServiceCost();
  const serviceCostData = useSelector(
    (state: any) => state?.serviceCost?.serviceCostDetailData
  );
  const { values, handleChange, onSetHandler } = useForm<ServiceCost | null>(
    serviceCostData
  );

  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);
  useEffect(() => {
    if (formType === "edit" && id) {
      serviceCostDetailHandler(
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
      dispatch(clearserviceCostDetailSlice());
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceCostFormObj: Partial<ServiceCost> = {};

    try {
      for (let [key, value] of formData.entries()) {
        serviceCostFormObj[key as keyof ServiceCost] = value as any;
      }
      await validationForm.validate(serviceCostFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addServiceCostHandler(serviceCostFormObj, (success) => {
          setIsSubmitting(false);
          if (success) {
            toast({
              title: "Success!",
              description: "The service cost added successfully.",
              variant: "success",
            });
            if (onModalSuccess) return onModalSuccess();
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
        editServiceCostHandler(id, serviceCostFormObj, (success: boolean) => {
          if (success) {
            toast({
              title: "Success!",
              description: "Service Cost Updated successfully.",
              variant: "success",
            });
            if (onModalSuccess) return onModalSuccess();
            navigate(-1);
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Service Cost",
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
              {formType === "add" ? "New Service Cost" : "Edit Service Cost"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the Service Cost details
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
            <View>
              <Input
                id="service_name"
                name="service_name"
                required={true}
                error={errors?.service_name}
                label="Service Name"
                value={values?.service_name || ""}
                onChange={handleChange}
                placeholder="Enter Service Name"
              />
            </View>
            <View>
              <Input
                id="cost"
                name="cost"
                required={true}
                error={errors?.cost}
                label="Sevice Cost"
                value={values?.cost || ""}
                onChange={handleChange}
                placeholder="Enter Service Cost"
              />
            </View>
          </View>

          <View>
            <Textarea
              id="description"
              name="description"
              label="Description"
              error={errors?.description}
              value={values?.description || ""}
              placeholder="Enter Description"
              onChange={handleChange}
            />
          </View>
          <View className="grid grid-cols-1  gap-6 mb-4">
            <View className="mt-4">
              <DepartmentType
                value={values?.department_type}
                // error={errors?.department_type}
                onChange={(value) => onSetHandler("department_type", value)}
                // required={true}
                showCaseType={true}
                caseTypeRequired={true}
                caseTypeError={errors?.case_type}
                caseTypeValue={values?.case_type}
                onCaseTypeChange={(value) => onSetHandler("case_type", value)}
                className="md:grid-cols-2 gap-6"
              />
            </View>
            <View className="">
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
export default ServiceCostForm;
