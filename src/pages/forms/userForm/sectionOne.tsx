import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { UserInterface } from "@/interfaces/users";
import useForm from "@/utils/custom-hooks/use-form";
import { Gender, Ids, MaratalStatus } from "@/interfaces";
import { useAgeCalculate } from "@/utils/custom-hooks/use-age-calculate";
import Text from "@/components/text";
import SingleSelector from "@/components/SingleSelector";
import { useUsers } from "@/actions/calls/user";
import WebcamCapture from "@/components/Capture";
import { Eye, EyeOff, Lock } from "lucide-react";
import { countryCodeOptions } from "../patientForm/patientFormOptions";
// import MultiSelector from "@/components/MultiSelector2";
// import TransferList from "@/components/TransferList";

interface SectionOneProps {
  errorsName: string;
  errorsEmail: string;
  errorsPassword: string;
  errorsPhone: string;
  errorsDOB: string;
  errorsGender: string;
  errorsMaritalStatus: string;
  errorsIds: string;
  errorsIdValue: string;
  errorConsent: string;
  errorsFiles: string;
  errorsAge: string;
  errorsIdProofForPan: string;
  formType: "add" | "edit";
  setFiles: (name: string, value: any) => void;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsDOB,
  errorsName,
  errorsEmail,
  errorsPassword,
  errorsPhone,
  errorsGender,
  errorsAge,
  // errorsMaritalStatus,
  errorsIdValue,
  errorsIds,
  errorConsent,
  errorsFiles,
  errorsIdProofForPan,
  setFiles,
  formType,
}) => {
  const { cleanUp } = useUsers();
  const { userAge, calculateAge } = useAgeCalculate();
  const userDetails = useSelector((state: any) => state?.users?.userDetails);
  const [showPassword, setShowPassword] = useState(false);

  const userDetailsData = {
    ...userDetails,
    id_value: userDetails?.id_number_masked,
    id_edited: false,
    countryContactCode:
      userDetails?.phone?.split(" ").length > 1
        ? userDetails?.phone?.split(" ")[0]
        : "",
    phone: userDetails?.phone?.split(" ")[1],
    files: userDetails?.gov_image,
  };

  const { values, handleChange, onSetHandler } =
    useForm<UserInterface>(userDetailsData);

  useEffect(() => {
    onSetHandler("gender", userDetails?.gender);
    onSetHandler("marital_status", userDetails?.marital_status);
    if (userDetails?.DOB) {
      onSetHandler("DOB", userDetails?.DOB);
      calculateAge(userDetails?.DOB);
    }
    if (values?.id_number_masked) {
      onSetHandler("id_value", values?.id_number_masked);
    }
    return () => {
      cleanUp();
    };
  }, [userDetails?.DOB, userDetails?.gender, userDetails?.marital_status]);

  // const Examples: any = {
  //   Aadhar: "123456789012",
  //   Passport: "A1234567",
  //   Voter_ID: "123456789012",
  //   PAN: "ABCDE1234F",
  //   Driving_License: "123456789012",
  //   Ration_Card: "123456789012",
  // };

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* First Name */}
        <View className={formType === "add" ? "col-span-2" : ""}>
          <Input
            name="name"
            type="text"
            label="Full Name"
            id="firstName"
            placeholder="Ex: Vishnu Kumar"
            error={errorsName}
            value={values?.name || ""}
            onChange={handleChange}
            required={true}
          />
        </View>

        {/* Email */}
        <View>
          <Input
            type="text"
            label="Email"
            id="email"
            name="email"
            error={errorsEmail}
            value={values?.email}
            onChange={handleChange}
            placeholder="Ex: vishnukumar@example.com"
            required={true}
          />
        </View>

        {/* Password */}
        {/* <View>
          <Input
            type="password"
            label="Password"
            id="password"
            name="password"
            // error={errorsPassword}
            value={values?.password || ""}
            onChange={handleChange}
            placeholder="Ex: ********"
            required={true}
          />
        </View> */}
        {formType === "add" && (
          <View>
            <View className="flex items-center justify-between">
              <Text
                as="label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password <span className="text-red-500">*</span>
              </Text>
            </View>
            <View className="relative mt-2">
              <View className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 z-10" />
              </View>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 "
                placeholder="••••••••"
                // error={errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </View>
            {errorsPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errorsPassword}
              </Text>
            )}
          </View>
        )}

        {/* Confirm Password */}
        {/* <View>
          <Input
            type="password"
            label="Confirm Password"
            id="confirmPassword"
            name="confirm_password"
            // error={errorsConfirmPassword}
            value={values?.confirm_password || ""}
            onChange={handleChange}
            placeholder="Ex: ********"
            // required={true}
          />
        </View> */}
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Phone */}
        {/* <View>
          <Input
            id="phone"
            type="text"
            label="Phone"
            name="phone"
            error={errorsPhone}
            value={values?.phone}
            onChange={handleChange}
            placeholder="Ex: 8765432109"
            required={true}
          />
        </View> */}
        <View>
          <View className="flex gap-2">
            <View className="w-[30%]">
              <SingleSelector
                name="countryContactCode"
                value={values?.countryContactCode || "+91"}
                options={countryCodeOptions}
                label="Phone No"
                onChange={(value) =>
                  onSetHandler("countryContactCode", value?.value)
                }
                className=""
                required
              />
            </View>
            <View className="flex items-end w-[70%]">
              <Input
                type="tel"
                // label="Phone No"
                id="phone"
                name="phone"
                // error={errorPhoneNo}
                className={`w-full`}
                onChange={handleChange}
                value={values?.phone}
                placeholder="Phone Number"
                required={true}
              />
            </View>
          </View>
          {
            <Text className="text-red-500 dark:text-red-400 text-sm mt-2">
              {errorsPhone ? errorsPhone : ""}
            </Text>
          }
        </View>
        {/* Date of Birth */}
        <View>
          <Input
            id="dob"
            name="DOB"
            label="Date of Birth"
            type="date"
            error={errorsDOB}
            max={new Date().toISOString().split("T")[0]}
            value={
              values?.DOB instanceof Date
                ? values?.DOB?.toISOString().split("T")[0]
                : values?.DOB || ""
            }
            onBlur={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("DOB", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
            onKeyUp={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("DOB", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
            onChange={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("DOB", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          <Input
            id="age"
            label="Age"
            placeholder="Enter Age"
            readOnly={values?.DOB ? true : false}
            name="age"
            value={
              values?.age
                ? values?.age + ""
                : !values?.DOB && userAge
                ? ""
                : userAge
            }
            onChange={handleChange}
            // required={true}
            error={errorsAge}
          />
        </View>

        {/* Gender */}
        <View>
          {/* <Select
            id="gender"
            label="Gender"
            name="gender"
            error={errorsGender}
            value={values?.gender}
            placeholder="Gender"
            onChange={(e) => {
              onSetHandler("gender", e.currentTarget.value);
            }}
            options={[
              { value: Gender.MALE, label: "Male" },
              { value: Gender.FEMALE, label: "Female" },
              { value: Gender.OTHER, label: "Other" },
            ]}
            required={true}
          /> */}
          <SingleSelector
            id="gender"
            label="Gender"
            name="gender"
            error={errorsGender}
            value={values?.gender || ""}
            placeholder="Select Gender"
            onChange={(value) => {
              onSetHandler("gender", value);
            }}
            options={[
              { value: Gender.MALE, label: "Male" },
              { value: Gender.FEMALE, label: "Female" },
              { value: Gender.OTHER, label: "Other" },
            ]}
            closeOnSelect={true}
            required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Marital Status */}
        <View>
          {/* <Select
            id="maratalStatus"
            label="Marital Status"
            name="marital_status"
            error={errorsMaritalStatus}
            value={values?.marital_status}
            placeholder="Marital Status"
            onChange={(e) => {
              onSetHandler("marital_status", e?.currentTarget?.value);
            }}
            options={[
              { value: MaratalStatus.SINGLE, label: "Single" },
              { value: MaratalStatus.MARRIED, label: "Married" },
              { value: MaratalStatus.DIVORCED, label: "Divorced" },
              // { value: MaratalStatus.WIDOWED, label: "Widowed" },
            ]}
            required={true}
          /> */}
          <SingleSelector
            id="marital_status"
            label="Marital Status"
            name="marital_status"
            // error={errorsMaritalStatus}
            value={values?.marital_status || ""}
            placeholder="Select Marital Status"
            onChange={(value) => {
              onSetHandler("marital_status", value);
            }}
            options={[
              { value: MaratalStatus.SINGLE, label: "Single" },
              { value: MaratalStatus.MARRIED, label: "Married" },
              { value: MaratalStatus.DIVORCED, label: "Divorced" },
              // { value: MaratalStatus.WIDOWED, label: "Widowed" },
            ]}
            closeOnSelect={true}
            // required={true}
          />

          {/* <TransferList
            // id="marital_status"
            label="Marital Status"
            // name="marital_status"
            error={errorsMaritalStatus}
            name="marital_status"
            height="200px"
            // value={values?.marital_status ? [values?.marital_status] : []}
            onSelectionChange={(value: any) => {
              console.log("value", value);
              onSetHandler("marital_status", value);
              
            }}
            // value={test || []}
            // onChange={(value) => {
            //   setTest(value);
            // }}
            // sourceData={maritalStatusData}
            sourceData={maritalStatusData}
            selectedItems={ values?.marital_status ? values?.marital_status : []}
            required={true}
            // allowCustomValues={true}
          /> */}

          {/* <SingleSelector
            id="marital_status"
            label="Marital Status"
            name="marital_status"
            error={errorsMaritalStatus}
            value={values?.marital_status || ""}
            placeholder="Marital Status"
            onChange={(value) => {
              onSetHandler("marital_status", value);
            }}
            options={[
              { value: MaratalStatus.SINGLE, label: "Single" },
              { value: MaratalStatus.MARRIED, label: "Married" },
              { value: MaratalStatus.DIVORCED, label: "Divorced" },
              // { value: MaratalStatus.WIDOWED, label: "Widowed" },
            ]}
            closeOnSelect={true}
            required={true}
          /> */}
        </View>
        {/* {userDetails?.id_type && userDetails?.id_number_masked ? (
          <View className="flex items-center space-y-4">
            <Text className="text-base font-medium">
              {userDetails?.id_type} : {userDetails?.id_number_masked}
            </Text>
          </View>
        ) : (
          <> */}
        <View className="space-y-4">
          {/* <Select
                id="id_type"
                label="Identifications"
                name="id_type"
                error={errorsIds}
                value={values?.id_type || ""}
                placeholder="Select ID"
                onChange={(e) => {
                  onSetHandler("id_type", e?.currentTarget?.value);
                }}
                options={[
                  { value: Ids.ADHAR, label: "Aadhar" },
                  { value: Ids.PASSPORT, label: "Passport" },
                  { value: Ids.VOTER_ID, label: "Voter ID" },
                  { value: Ids.DRIVING_LICENSE, label: "Driving License" },
                  { value: Ids.RATION_CARD, label: "Ration Card" },
                  { value: "", label: "None" },
                  // { value: MaratalStatus.WIDOWED, label: "Widowed" },
                ]}
              /> */}
          <SingleSelector
            id="id_type"
            label="Identifications"
            name="id_type"
            error={errorsIds}
            value={values?.id_type || ""}
            placeholder="Select ID"
            onChange={(value) => {
              onSetHandler("id_type", value);
            }}
            options={[
              { value: Ids.ADHAR, label: "Aadhar" },
              { value: Ids.PASSPORT, label: "Passport" },
              { value: Ids.VOTER_ID, label: "Voter ID" },
              { value: Ids.DRIVING_LICENSE, label: "Driving License" },
              { value: Ids.RATION_CARD, label: "Ration Card" },
              { value: "", label: "None" },
            ]}
            // required={true}
          />
          {values?.id_type ? (
            <>
              <Input
                name="id_value"
                label={`Enter ${
                  values?.id_type?.charAt(0)?.toUpperCase() +
                  values?.id_type?.slice(1)
                } Number`}
                onChange={(e) => {
                  if (formType === "edit") {
                    setFiles("id_edited", true);
                  } else {
                    setFiles("id_edited", false);
                  }
                  onSetHandler("id_value", e.target.value);
                }}
                error={errorsIdValue}
                // value={formType === "edit" ? values?.id_value ? values?.id_value || "" : values?.id_number_masked || "" : values?.id_value || ""}
                value={values?.id_value || ""}
                placeholder="Enter ID Number"
                required={true}
              />

              <View className="space-y-1">
                <View className="flex items-center justify-center space-x-2">
                  <View>
                    <Input
                      type="checkbox"
                      name="consent"
                      checked={!!values?.consent}
                      onChange={(e) => {
                        onSetHandler("consent", e.target.checked);
                      }}
                      value={values?.consent}
                    />
                  </View>
                  <Text className="font-sm w-full">
                    I consent to the storage of my ID for address verification.{" "}
                    <Text as="span" className="text-red-600">
                      *
                    </Text>
                  </Text>
                </View>
                {errorConsent ? (
                  <Text className="text-sm text-red-500">{errorConsent}</Text>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        {values?.id_type ? (
          <View className="col-span-2">
            {/* <Upload
              label="Upload ID Proof (Adhar Card, Passport, Voter ID, etc.)"
              name="image"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              maxSize={1024 * 1024 * 2}
              multiple={false}
              maxCount={1}
              // required={true}
              error={errorsImage}
              existingFiles={
                typeof values?.image === "string"
                  ? values?.image
                  : Array.isArray(values?.image) && values?.image.length > 0
                  ? values?.image
                      .filter((item) => typeof item === "string")
                      .join(",")
                  : ""
              }
              onChange={(fileList: any) => {
                // Extract the actual File objects from FileItem array

                const file =
                  fileList?.map((item: any) => {
                    if (item.isExisting) {
                      return item.url;
                    } else {
                      return item.file;
                    }
                  }) || [];

                setImage("image", file);
              }}
            /> */}
            <WebcamCapture
              label="Upload ID Proof (Adhar Card, Passport, Voter ID, etc.)"
              name="files"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              maxSize={1024 * 1024 * 2}
              multiple={false}
              maxCount={2}
              // required={true}
              error={errorsFiles}
              existingFiles={
                typeof values?.files === "string"
                  ? values?.files
                  : Array.isArray(values?.files) && values?.files.length > 0
                  ? values?.files
                      .filter((item) => typeof item === "string")
                      .join(",")
                  : ""
              }
              onChange={(fileList: any) => {
                const file =
                  fileList?.map((item: any) => {
                    if (item.isExisting) {
                      return item.url;
                    } else {
                      return item.file;
                    }
                  }) || [];

                setFiles("files", file);
              }}
            />
          </View>
        ) : null}
        {/* </>
        )} */}
      </View>

      <View>
        <Input
          label="PAN Number"
          name="id_proof_for_pan"
          id="id_proof_for_pan"
          onChange={handleChange}
          value={values?.id_proof_for_pan || ""}
          placeholder="Enter PAN Number"
          error={errorsIdProofForPan}
        />
      </View>
    </React.Fragment>
  );
};

export default SectionOne;
