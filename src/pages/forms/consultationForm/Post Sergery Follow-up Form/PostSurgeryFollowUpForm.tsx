import Text from "@/components/text";
import View from "@/components/view";
import Button from "@/components/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { validationForm } from "./validationForm";
// import { FormTypeProps } from "@/interfaces/dashboard";
// import { toast } from "@/utils/custom-hooks/use-toast";

import { useParams } from "react-router-dom";
import useForm from "@/utils/custom-hooks/use-form";
// import SingleSelector from "@/components/SingleSelector";
// import { dietStatusOptions } from "./dietFormOptions";
// import DepartmentType from "../departmentType/DepartmentType";
import BouncingLoader from "@/components/BouncingLoader";
// import { Dre } from "@/interfaces/dre";
import { useDre } from "@/actions/calls/dre";
import { clearDreDetailSlice } from "@/actions/slices/dre";
import Input from "@/components/input";
import { PostSurgeryFollowUp } from "@/interfaces/consultation/postSurgeryFollowUp";
import dayjs from "dayjs";
import { RootState } from "@/actions/store";

interface PostSurgeryFollowUpFormProps {
  formType: "add" | "edit";
  toogleValue: boolean;
  toogleForm: (value: boolean) => void;
}
const PostSurgeryFollowUpForm: React.FC<PostSurgeryFollowUpFormProps> = ({
  formType = "add",
  toogleValue,
  toogleForm,
}) => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dreDetailHandler, cleanUp } = useDre();
  const [errors] = useState<Record<string, string>>({});
  const [isSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { patient_name, patient_age } = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.consultations
  );
  const postSurgeryFollowUpData = {
    name: patient_name,
    age: patient_age,
  };

  // const dreData = useSelector((state: any) => state.dre.dreDetailData);
  const { values, handleChange } = useForm<PostSurgeryFollowUp | null>(
    postSurgeryFollowUpData
  );

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

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // const formData = new FormData(e.currentTarget);
  //   // let postSurgeryFollowUpFormObj: Partial<PostSurgeryFollowUp> = {};

  //   try {
  //     // for (let [key, value] of formData.entries()) {
  //     //   postSurgeryFollowUpFormObj[key as keyof PostSurgeryFollowUp] =
  //     //     value as any;
  //     // }
  //     // await validationForm.validate(postSurgeryFollowUpFormObj, {
  //     //   abortEarly: false,
  //     // });
  //     // // console.log("postSurgeryFollowUpFormObj", postSurgeryFollowUpFormObj);
  //     // return;
  //     // setErrors({});
  //     // setIsSubmitting(true);
  //     // if (formType === "add") {
  //     //   addDreHandler(postSurgeryFollowUpFormObj, (success: boolean) => {
  //     //     if (success) {
  //     //       toast({
  //     //         title: "Success!",
  //     //         description: "Post Surgery Follow-up Added successfully.",
  //     //         variant: "success",
  //     //       });
  //     //       // if (onModalSuccess) {
  //     //       //   return onModalSuccess();
  //     //       // }
  //     //       navigate(-1);
  //     //     } else {
  //     //       setIsSubmitting(false);
  //     //       toast({
  //     //         title: "Error!",
  //     //         description: "Failed to add Post Surgery Follow-up",
  //     //         variant: "destructive",
  //     //       });
  //     //     }
  //     //   });
  //     // } else if (id) {
  //     //   editDreHandler(id, postSurgeryFollowUpFormObj, (success: boolean) => {
  //     //     if (success) {
  //     //       toast({
  //     //         title: "Success!",
  //     //         description: "Post Surgery Follow-up Updated successfully.",
  //     //         variant: "success",
  //     //       });
  //     //       // if (onModalSuccess) {
  //     //       //   return onModalSuccess();
  //     //       // }
  //     //       navigate(-1);
  //     //     } else {
  //     //       setIsSubmitting(false);
  //     //       toast({
  //     //         title: "Error!",
  //     //         description: "Failed to update Post Surgery Follow-up",
  //     //         variant: "destructive",
  //     //       });
  //     //     }
  //     //     setIsSubmitting(false);
  //     //   });
  //     // }
  //   } catch (error: any) {
  //     setIsSubmitting(false);
  //     if (error.inner) {
  //       const validationErrors: Record<string, string> = {};
  //       error.inner.forEach((e: any) => {
  //         validationErrors[e.path] = e.message;
  //       });
  //       setErrors(validationErrors);
  //     }
  //   }
  // };

  return (
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
      <BouncingLoader isLoading={isLoading} />
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            weight="font-bold"
            className="text-2xl font-bold text-center text-primary mb-2"
          >
            Post Surgery Follow-up Entry Form
          </Text>
          {/* {!onModalSuccess && ( */}
          <Button onPress={() => toogleForm(!toogleValue)} variant="outline">
            Back to Details
          </Button>
          {/* )} */}
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the post surgery follow-up details
        </Text>
        {/* <form onSubmit={handleSubmit}> */}
        <form>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <View>
              <Input
                required={true}
                id="name"
                name="name"
                label="Name"
                onChange={handleChange}
                error={errors?.name}
                value={values?.name || ""}
                placeholder="Enter Name"
              />
            </View>
            <View>
              <Input
                required={true}
                id="age"
                name="age"
                label="Age"
                onChange={handleChange}
                error={errors?.age}
                value={values?.age || ""}
                placeholder="Enter Age"
              />
            </View>
            <View>
              <Input
                required={true}
                type="date"
                id="date"
                name="date"
                label="Date"
                onChange={handleChange}
                error={errors?.date}
                value={
                  `${dayjs(values?.date).format("YYYY-MM-DD")}` ||
                  dayjs().format("YYYY-MM-DD")
                }
                placeholder="Enter Date"
              />
            </View>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              id="ks_changed"
              name="ks_changed"
              label="KS Changed"
              onChange={handleChange}
              error={errors?.ks_changed}
              value={values?.ks_changed || ""}
              placeholder="Enter KS Changed"
            />
            <Input
              id="dressing"
              name="dressing"
              label="Dressing"
              onChange={handleChange}
              error={errors?.dressing}
              value={values?.dressing || ""}
              placeholder="Enter Dressing"
            />
            <Input
              id="partial_lay_open"
              name="partial_lay_open"
              label="Partial Lay Open"
              onChange={handleChange}
              error={errors?.partial_lay_open}
              value={values?.partial_lay_open || ""}
              placeholder="Enter Partial Lay Open"
            />
            <Input
              id="follow_up_examination"
              name="follow_up_examination"
              label="Follow Up Examination"
              onChange={handleChange}
              error={errors?.follow_up_examination}
              value={values?.follow_up_examination || ""}
              placeholder="Enter Follow Up Examination"
            />
            <Input
              id="new_abscess_i_or_d"
              name="new_abscess_i_or_d"
              label="New Abscess I or D"
              onChange={handleChange}
              error={errors?.new_abscess_i_or_d}
              value={values?.new_abscess_i_or_d || ""}
              placeholder="Enter New Abscess I or D"
            />
            <Input
              id="new_tract_primary_threading"
              name="new_tract_primary_threading"
              label="New Tract Primary Threading"
              onChange={handleChange}
              error={errors?.new_tract_primary_threading}
              value={values?.new_tract_primary_threading || ""}
              placeholder="Enter New Tract Primary Threading"
            />
            <View className="col-span-2">
              <Input
                id="cut_through_or_any_other"
                name="cut_through_or_any_other"
                label="Cut Through Or Any Other"
                onChange={handleChange}
                error={errors?.cut_through_or_any_other}
                value={values?.cut_through_or_any_other || ""}
                placeholder="Enter Cut Through Or Any Other"
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

export default PostSurgeryFollowUpForm;
