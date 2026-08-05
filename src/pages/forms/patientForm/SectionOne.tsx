import View from "@/components/view";
import Input from "@/components/input";
import Select from "@/components/Select";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useForm from "@/utils/custom-hooks/use-form";
import {
  countryCodeOptions,
  genderOptions,
  maritalStatusOptions,
} from "./patientFormOptions";
import { PatientInterface } from "@/interfaces/patients";
import { useAgeCalculate } from "@/utils/custom-hooks/use-age-calculate";
import { Ids } from "@/interfaces";
import Text from "@/components/text";
import SingleSelector from "@/components/SingleSelector";
import { usePatient } from "@/actions/calls/patient";
import WebcamCapture from "@/components/Capture";
import dayjs from "dayjs";
import { useReferedByDoc } from "@/actions/calls/referedByDoc";

interface SectionOneProps {
  errorDOB: string;
  errorEmail: string;
  errorPhoneNo: string;
  errorsGender: string;
  errorLastName: string;
  errorFirstName: string;
  errorMaritalStatus: string;
  errorAge: string;
  setImage: (name: string, value: any) => void;
  errorAttendantWithPatientName: string;
  errorAttendantWithPatientPhoneNo: string;
  errorsAttendantIdProofForPan: string;
  errorsIdProofForPan: string;
  errorsAttendantIdValue: string;
  errorAttendantConsent: string;
  formType: "add" | "edit";
  errorConsent: string;
  errorsIdValue: string;
  errorsRefferdBy: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorDOB,
  errorEmail,
  errorsGender,
  errorPhoneNo,
  errorAge,
  // errorLastName,
  errorFirstName,
  // errorMaritalStatus,
  errorAttendantWithPatientName,
  errorAttendantWithPatientPhoneNo,
  errorConsent,
  errorsIdProofForPan,
  errorsAttendantIdProofForPan,
  errorsAttendantIdValue,
  errorAttendantConsent,
  formType,
  setImage,
  errorsIdValue,
  errorsRefferdBy,
}) => {
  const patientDetail = useSelector(
    (state: any) => state.patient.patientDetailData
  );
  const { referedByDocDropdownHandler } = useReferedByDoc();
  const referedByDocList = useSelector(
    (state: any) => state.referedByDoc.referedByDropdownData
  );

  const patientDetailData = {
    ...patientDetail,
    id_edited: patientDetail?.id_number_masked ? false : true,
    attendant_id_edited: patientDetail?.attendant_id_number_masked
      ? false
      : true,

    countryContactCode:
      patientDetail?.phone_no?.split(" ").length > 1
        ? patientDetail?.phone_no?.split(" ")[0]
        : "",
    phone_no: patientDetail?.phone_no?.split(" ")[1],

    attendantCountryContactCode:
      patientDetail?.attendant_with_patient_phone_no?.split(" ").length > 1
        ? patientDetail?.attendant_with_patient_phone_no?.split(" ")[0]
        : "",
    attendant_with_patient_phone_no:
      patientDetail?.attendant_with_patient_phone_no?.split(" ")[1],
  };
  const { cleanUp } = usePatient();
  const { userAge, calculateAge } = useAgeCalculate();
  const { values, handleChange, onSetHandler } =
    useForm<PatientInterface>(patientDetailData);
  useEffect(() => {
    if (patientDetail?.dob) {
      onSetHandler("dob", patientDetail?.dob);
      calculateAge(patientDetail.dob);
    }
    referedByDocDropdownHandler(() => {});
    return () => {
      cleanUp();
    };
  }, [patientDetail?.dob]);

  const selectedOption = referedByDocList?.find(
    (item: any) => String(item.id) === String(values?.referred_by_name)
  );

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            type="text"
            label="First Name"
            id="first_name"
            name="first_name"
            className={`w-full`}
            error={errorFirstName}
            onChange={handleChange}
            placeholder="First Name"
            value={values?.first_name}
            required={true}
          />
        </View>

        <View>
          <Input
            type="text"
            label="Last Name"
            id="last_name"
            name="last_name"
            className={`w-full`}
            // error={errorLastName}
            onChange={handleChange}
            placeholder="Last Name"
            value={values?.last_name}
            // required={true}
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            label="Date of Birth"
            id="dob"
            name="dob"
            type="date"
            error={errorDOB}
            className={`w-full`}
            max={new Date().toISOString().split("T")[0]}
            value={
              values?.dob instanceof Date
                ? values?.dob?.toISOString().split("T")[0]
                : values?.dob || ""
            }
            onChange={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("dob", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
            onBlur={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("dob", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
            onKeyUp={(e) => {
              const newDob = e.currentTarget.value;
              onSetHandler("dob", newDob);
              if (newDob) {
                calculateAge(new Date(newDob).toISOString().split("T")[0]);
              }
              onSetHandler("age", newDob ? userAge : "");
            }}
          />
        </View>
        <View>
          <Input
            id="age"
            name="age"
            label="Age"
            error={errorAge}
            placeholder="Enter Age"
            onChange={handleChange}
            readOnly={values?.dob ? true : false}
            value={
              values?.age
                ? values?.age + ""
                : !values?.dob && userAge
                ? ""
                : userAge
            }
            className="w-full"
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                // required
              />
            </View>
            <View className="flex items-end w-[70%]">
              <Input
                type="tel"
                // label="Phone No"
                id="phone_no"
                name="phone_no"
                // error={errorPhoneNo}
                className={`w-full`}
                onChange={handleChange}
                value={values?.phone_no}
                placeholder="Phone Number"
                // required={true}
              />
            </View>
          </View>
          {
            <Text className="text-red-500 dark:text-red-400 text-sm mt-2">
              {errorPhoneNo ? errorPhoneNo : ""}
            </Text>
          }
        </View>
        <View>
          {/* <Select
            id="gender"
            label="Gender"
            name="gender"
            variant="default"
            className="w-full"
            placeholder="Gender"
            error={errorsGender}
            options={genderOptions}
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
            options={genderOptions}
            closeOnSelect={true}
            required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            label="Patient Created At"
            type="date"
            name="created_at"
            id="created_at"
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            value={
              values?.created_at
                ? dayjs(values.created_at).format("YYYY-MM-DD")
                : dayjs().format("YYYY-MM-DD")
            }
            placeholder="Enter Patient Created Date"
          />
        </View>
        <View>
          <SingleSelector
            id="marital_status"
            label="Marital Status"
            name="marital_status"
            // error={errorMaritalStatus}
            value={values?.marital_status || ""}
            placeholder="Select Marital Status"
            onChange={(value) => {
              onSetHandler("marital_status", value);
            }}
            options={maritalStatusOptions}
            closeOnSelect={true}
            // required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            id="email"
            label="Email"
            type="email"
            name="email"
            // required={true}
            error={errorEmail}
            placeholder="Email"
            className={`w-full`}
            value={values?.email}
            onChange={handleChange}
          />
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
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            label="Attendant With Patient Name"
            type="text"
            id="attendant_with_patient_name"
            className="w-full"
            name="attendant_with_patient_name"
            placeholder="Attendant With Patient Name"
            error={errorAttendantWithPatientName}
            onChange={handleChange}
            value={values?.attendant_with_patient_name}
          />
        </View>
        <View>
          <View className="flex gap-2">
            {/* Country Code */}
            <View className="w-[30%]">
              <SingleSelector
                name="attendantCountryContactCode"
                value={values?.countryContactCode || "+91"}
                options={countryCodeOptions}
                label="Attendant Phone"
                onChange={(value) =>
                  onSetHandler("attendantCountryContactCode", value?.value)
                }
                className=""
              />
            </View>

            {/* Phone Number */}
            <View className="flex items-end w-[70%]">
              <Input
                type="tel"
                id="attendant_with_patient_phone_no"
                name="attendant_with_patient_phone_no"
                className={`w-full`}
                onChange={handleChange}
                value={values?.attendant_with_patient_phone_no}
                placeholder="Attendant Phone Number"
              />
            </View>
          </View>

          {errorAttendantWithPatientPhoneNo && (
            <Text className="text-red-500 dark:text-red-400 text-sm mt-2">
              {errorAttendantWithPatientPhoneNo}
            </Text>
          )}
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <SingleSelector
            label="Referred By"
            id="referred_by_name"
            name="referred_by_name"
            placeholder="Ex: Dr. Vishnu"
            className="w-full"
            error={errorsRefferdBy}
            options={referedByDocList?.map((value: any) => ({
              label: value.name,
              value: value.id,
            }))}
            value={selectedOption?.id || ""}
            onChange={(e: any) => {
              onSetHandler("referred_by_name", e.target.value);
            }}
            closeOnSelect={true}
          />
        </View>

        <View>
          <Input
            label="Attendant PAN Number"
            name="attendant_id_proof_for_pan"
            id="attendant_id_proof_for_pan"
            onChange={handleChange}
            value={values?.attendant_id_proof_for_pan || ""}
            placeholder="Enter Attendant PAN Number"
            error={errorsAttendantIdProofForPan}
          />
        </View>
      </View>

      <View
        className={`grid gap-4 mb-4 ${
          values?.id_type ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <View className="space-y-4">
          <Select
            id="id_type"
            label="Patient Identifications"
            name="id_type"
            // error={errorsIds}
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
            ]}
          />
        </View>
        <View>
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
                    setImage("id_edited", true);
                  } else {
                    setImage("id_edited", true);
                  }
                  onSetHandler("id_value", e.target.value);
                }}
                // onChange={handleChange}
                error={errorsIdValue}
                value={
                  formType === "edit"
                    ? values?.id_value
                      ? values?.id_value || ""
                      : values?.id_number_masked || ""
                    : values?.id_value || ""
                }
                // value={values?.id_value || ""}
                placeholder="Enter ID Number"
                required={true}
              />

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
                  <span className="text-red-500">*</span>
                </Text>
              </View>
              {errorConsent ? (
                <Text className="text-sm text-red-500">{errorConsent}</Text>
              ) : null}
            </>
          ) : null}
        </View>
      </View>

      {values?.id_type ? (
        <View className="col-span-2 mb-4">
          <WebcamCapture
            label="Upload ID Proof (Adhar Card, Passport, Voter ID, etc.)"
            name="image"
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
            maxSize={1024 * 1024 * 2}
            multiple={false}
            maxCount={2}
            // required={true}
            // error={errorsImage}
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
          />
        </View>
      ) : null}

      <View
        className={`grid gap-4 mb-4 ${
          values?.attendant_id_type ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        <View className="space-y-4">
          <Select
            id="attendant_id_type"
            label="Attendant Identifications"
            name="attendant_id_type"
            // error={errorsIds}
            value={values?.attendant_id_type || ""}
            placeholder="Select ID"
            onChange={(e) => {
              onSetHandler("attendant_id_type", e?.currentTarget?.value);
            }}
            options={[
              { value: Ids.ADHAR, label: "Aadhar" },
              { value: Ids.PASSPORT, label: "Passport" },
              { value: Ids.VOTER_ID, label: "Voter ID" },
              { value: Ids.DRIVING_LICENSE, label: "Driving License" },
              { value: Ids.RATION_CARD, label: "Ration Card" },
              { value: "", label: "None" },
            ]}
          />
        </View>
        <View>
          {values?.attendant_id_type ? (
            <>
              <Input
                name="attendant_id_value"
                label={`Enter ${
                  values?.attendant_id_type?.charAt(0)?.toUpperCase() +
                  values?.attendant_id_type?.slice(1)
                } Number`}
                onChange={(e) => {
                  if (formType === "edit") {
                    setImage("attendant_id_edited", true);
                  } else {
                    setImage("attendant_id_edited", true);
                  }
                  onSetHandler("attendant_id_value", e.target.value);
                }}
                // onChange={handleChange}
                error={errorsAttendantIdValue}
                value={
                  formType === "edit"
                    ? values?.attendant_id_value
                      ? values?.attendant_id_value || ""
                      : values?.attendant_id_number_masked || ""
                    : values?.attendant_id_value || ""
                }
                // value={values?.attendant_id_value || ""}
                placeholder="Enter ID Number"
                required={true}
              />

              <View className="flex items-center justify-center space-x-2">
                <View>
                  <Input
                    type="checkbox"
                    name="attendant_consent"
                    checked={!!values?.attendant_consent}
                    onChange={(e) => {
                      onSetHandler("attendant_consent", e.target.checked);
                    }}
                    value={values?.attendant_consent}
                  />
                </View>
                <Text className="font-sm w-full">
                  I consent to the storage of my ID for address verification.{" "}
                  <span className="text-red-500">*</span>
                </Text>
              </View>
              {errorAttendantConsent ? (
                <Text className="text-sm text-red-500">
                  {errorAttendantConsent}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>

        {values?.attendant_id_type ? (
          <View className="col-span-2">
            {/* <Upload
              label="Upload ID Proof (Adhar Card, Passport, Voter ID, etc.)"
              name="image"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              maxSize={1024 * 1024 * 2}
              multiple={false}
              maxCount={1}
              // required={true}
              // error={errorsImage}
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
              label="Upload Attendant ID Proof (Adhar Card, Passport, Voter ID, etc.)"
              name="attendant_image"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              maxSize={1024 * 1024 * 2}
              multiple={false}
              maxCount={2}
              // required={true}
              // error={errorsattendant_image}
              existingFiles={
                typeof values?.attendant_image === "string"
                  ? values?.attendant_image
                  : Array.isArray(values?.attendant_image) &&
                    values?.attendant_image.length > 0
                  ? values?.attendant_image
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

                setImage("attendant_image", file);
              }}
            />
          </View>
        ) : null}
      </View>
    </React.Fragment>
  );
};

export default SectionOne;
