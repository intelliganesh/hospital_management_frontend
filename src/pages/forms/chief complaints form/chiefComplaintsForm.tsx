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
import { statusOptions } from "./chiefComplaintsFormOptions";
import { useChiefComplaint } from "@/actions/calls/chiefComplaints";
import { clearChiefComplaintDetailSlice } from "@/actions/slices/chiefComplaints";
import { ChiefComplaint } from "@/interfaces/master/chiefComplaints";
import Textarea from "@/components/Textarea";
import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";

const ChiefComplaintForm: React.FC<FormTypeProps> = ({
  onModalSuccess,
  formType = "add",
  iAmIn = ""
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    addChiefComplaintHandler,
    editChiefComplaintHandler,
    chiefComplaintDetailHandler,
    cleanUp,
  } = useChiefComplaint();
  const chiefComplaintData = useSelector(
    (state: any) => state?.chiefComplaint?.chiefComplaintDetailData
  );

  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";
  
  const { values, handleChange, onSetHandler } = useForm<ChiefComplaint | null>(
    chiefComplaintData
  );  

  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);
  useEffect(() => {
    if (id && formType === "edit") {
      chiefComplaintDetailHandler(
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
      dispatch(clearChiefComplaintDetailSlice());
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const chiefComplaintFormObj: Partial<ChiefComplaint> = {};

    try {
      for (let [key, value] of formData.entries()) {
        chiefComplaintFormObj[key as keyof ChiefComplaint] = value as any;
      }
      await validationForm.validate(chiefComplaintFormObj, {
        abortEarly: false,
      });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addChiefComplaintHandler(chiefComplaintFormObj, (success) => {
          setIsSubmitting(false);
          if (success) {
            toast({
              title: "Success!",
              description: "The Chief Complaint added successfully.",
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
        editChiefComplaintHandler(
          id,
          chiefComplaintFormObj,
          (success: boolean) => {
            toast({
              title: "Success!",
              description: "Chief Complaint Updated successfully.",
              variant: "success",
            });
            if (success) {
              if (onModalSuccess) {
                return onModalSuccess();
              }
              navigate(-1);
            } else {
              setIsSubmitting(false);
              // toast({
              //   title: "Error!",
              //   description: "Failed to update Chief Complaint",
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
      formSubmissionFailMessage();
    }
  };
  return (
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
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
                ? "New Chief Complaint"
                : "Edit Chief Complaint"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the chief complaint details
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
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <Input
                id="complaint_name"
                name="complaint_name"
                required={true}
                error={errors?.complaint_name}
                label="Chief Complaint"
                value={values?.complaint_name || ""}
                onChange={handleChange}
                placeholder="Enter Chief Complaint"
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
          {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
          <View className="mt-4">
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
          <View className="mt-2">
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
          {/* </View> */}

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
export default ChiefComplaintForm;
