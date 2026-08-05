import View from "@/components/view";
import SectionOne from "./sectionOne";
import Text from "@/components/text";
import SectionTwo from "./sectionTwo";
import Button from "@/components/button";
import { useUsers } from "@/actions/calls/user";
import { validationForm } from "./validationForm";
import { toast } from "@/components/ui/use-toast";
import { UserInterface } from "@/interfaces/users";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useNavigate, useParams } from "react-router-dom";
import { clearUserDetailsSlice } from "@/actions/slices/userSlice";
import useForm from "@/utils/custom-hooks/use-form";
import { imageUpload } from "@/actions/calls/uesImage";
import { RootState } from "@/actions/store";
import BouncingLoader from "../../../components/BouncingLoader";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import DoctorAvailabilitySection from "./DoctorAvailabilitySection";
// import WebcamCapture from "@/components/Capture";
// import ResetUserPassword from "@/components/resetUserPassword";

const Register: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, getUserDetails, updateUser, cleanUp } = useUsers();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [image, setImage] = useState<File[] | string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state: any) => state.authentication.tokenStatus);
  const userDetails = useSelector((state: any) => state.users.userDetails);
  const userDetailData = useMemo(() => {
    const base = { ...userDetails, id_edited: false };
    const availabilityFields = ["available_days", "leave_date"];
    availabilityFields.forEach((key) => {
      const val = (base as any)[key];
      if (typeof val === "string") {
        try {
          (base as any)[key] = JSON.parse(val);
        } catch {}
      }
    });
    // slot_duration may come back as a string from the API — coerce to number
    if ((base as any)["slot_duration"] != null)
      (base as any)["slot_duration"] =
        Number((base as any)["slot_duration"]) || 30;
    return base;
  }, [userDetails]);
  const { values: formValues, onSetHandler } =
    useForm<UserInterface>(userDetailData);

  const [selectedRole, setSelectedRole] = useState<string>(
    userDetailData?.role ?? "",
  );

  // Keep selectedRole in sync when editing an existing user (data loads async)
  useEffect(() => {
    if (userDetailData?.role) setSelectedRole(userDetailData.role);
  }, [userDetailData?.role]);

  const settings = useSelector(
    (state: RootState) => state.systemSettings.settings,
  );

  useEffect(() => {
    if (formType === "edit" && id) {
      getUserDetails(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
    return () => {
      cleanUp();
      dispatch(clearUserDetailsSlice());
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userFormObj: Partial<UserInterface> = {};
    if (!settings?.id) {
      return;
    }

    try {
      for (let [key, value] of formData.entries()) {
        userFormObj[key as keyof UserInterface] = value as any;
      }

      userFormObj["system_settings_id"] = Number(settings?.id) as number;
      userFormObj["phone"] =
        userFormObj["countryContactCode"] + " " + userFormObj["phone"];
      userFormObj["consent"] =
        userFormObj["consent" as keyof UserInterface] === "1" ||
        userFormObj["consent" as keyof UserInterface] === "true"
          ? true
          : false;
      userFormObj["files"] = formValues?.files;
      if (formValues?.available_days)
        (userFormObj as any)["available_days"] = JSON.stringify(
          formValues.available_days,
        );
      (userFormObj as any)["slot_duration"] =
        formValues?.slot_duration?.toString() || "30";
      if (formValues?.leave_date)
        (userFormObj as any)["leave_date"] = JSON.stringify(
          formValues.leave_date,
        );
      userFormObj["id_edited"] =
        formValues?.id_value?.includes("X") &&
        formValues?.id_value?.includes("x")
          ? false
          : formValues?.id_edited;

      await validationForm.validate(userFormObj, {
        abortEarly: false,
        context: {
          userDetails,
          isEditMode: formType === "edit", // Pass edit mode flag
        },
      });

      delete userFormObj["files"];

      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addUser(userFormObj, (success, response) => {
          setIsSubmitting(false);
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: " registration submitted successfully.",
              variant: "success",
            });
            const userId = response?.data?.id;

            if (userId && formValues?.files) {
              const imageUploadData = {
                id: userId,
                modal_type: "user_address_proof",
                file_name: "image",
                folder_name: "user_address_image",
                image: formValues?.files,
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
                  //   description: "Failed to upload file",
                  //   variant: "destructive",
                  // });
                }
              });
            }
          } else {
            // toast({
            //   title: "Error!",
            //   description: response?.message,
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateUser(id, userFormObj, (success: boolean, response: any) => {
          if (success) {
            toast({
              title: "Success!",
              variant: "success",
              description: response?.message ?? "User Updated successfully.",
            });
            const userId = response?.data?.id;
            if (userId && formValues?.files) {
              const imageUploadData = {
                id: userId,
                modal_type: "user_address_proof",
                file_name: "image",
                folder_name: "user_address_image",
                image: formValues?.files,
              };
              imageUpload(imageUploadData, (success, _) => {
                if (success) {
                  toast({
                    title: "Success!",
                    description: "File uploaded successfully",
                    variant: "success",
                  });
                  // setIsSubmitting(false);
                } else {
                  // toast({
                  //   title: "Error!",
                  //   description: "Failed to upload file",
                  //   variant: "destructive",
                  // });
                }
              });
            }

            setIsSubmitting(false);
            navigate(-1);
          } else {
            // toast({
            //   title: "Error!",
            //   variant: "destructive",
            //   // description: response?.message,
            // });
            setIsSubmitting(false);
          }
        });
      }
    } catch (error: any) {
      console.error("Validation Error:", error);
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
      {/* Header */}
      {!token && (
        <View className="text-center mb-6">
          <Text
            as="h1"
            className="text-primary-600 text-3xl md:text-4xl font-bold"
          >
            {import.meta.env.VITE_HOSPITAL_NAME}
          </Text>
          <Text as="p" className="text-text-light mt-1">
            {import.meta.env.VITE_TYPE_OF_APPLICATION}
          </Text>
        </View>
      )}

      {/* Registration Card */}
      <View className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 w-full max-w-6xl p-6 md:p-8 mb-8">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text
              as="h2"
              weight="font-bold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              {formType === "add" ? "New User" : "Edit User"}
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Fill in the user details
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
          {/* <View className="grid grid-cols-2 md:grid-cols-1 gap-6"> */}
          {/* Personal Information Section */}
          <View className="col-span-2">
            <Text
              as="h3"
              className="text-lg font-semibold text-text-DEFAULT mb-3 pb-2"
            >
              Personal Information
            </Text>
          </View>

          <SectionOne
            errorsDOB={errors.DOB}
            errorsName={errors.name}
            errorsEmail={errors.email}
            errorsPassword={errors.password}
            errorsPhone={errors.phone}
            errorsGender={errors.gender}
            errorsAge={errors.age}
            errorsMaritalStatus={errors.marital_status}
            errorsIds={errors.id_type}
            errorsIdValue={errors.id_value}
            errorConsent={errors.consent}
            errorsFiles={errors.files}
            errorsIdProofForPan={errors.id_proof_for_pan}
            formType={formType}
            setFiles={onSetHandler}
          />

          {/* Address Section */}
          {/* <View className="col-span-2">
              <Text
                as="h3"
                className="text-lg font-semibold text-text-DEFAULT mb-3 border-b border-neutral-200 pb-2"
              >
                Address Information
              </Text>
            </View> */}

          {/* Address */}
          <SectionTwo
            formType={formType}
            errorsAddress={errors.address}
            errorsCity={errors.city}
            errorsState={errors.state}
            errorsCountry={errors.country}
            errorsPinCode={errors.pincode}
            errorsRole={errors.role}
            errorsDesignation={errors.designation}
            errorsQualification={errors.qualification}
            errorsDepartment={errors.department}
            errorsStatus={errors.status}
            onRoleChange={(role) => setSelectedRole(role)}
          />

          {/* Doctor Availability */}
          {selectedRole === "Doctor" && (
            <DoctorAvailabilitySection
              values={formValues}
              onSetHandler={onSetHandler}
            />
          )}

          {/* Submit Button - spans full width */}
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </View>
          {/* </View> */}
        </form>
      </View>

      {/* Footer */}
      {!token && (
        <View className="mt-4 text-center text-text-lighter text-sm pb-6">
          © {new Date().getFullYear()} {import.meta.env.VITE_HOSPITAL_NAME}{" "}
          Hospital Management System. All rights reserved.
        </View>
      )}
    </View>
  );
};

export default Register;
