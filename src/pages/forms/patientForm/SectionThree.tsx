import React, { useEffect } from "react";
import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import useForm from "@/utils/custom-hooks/use-form";
import { bloodGroupOptions, foodTypeOptions } from "./patientFormOptions";
import { PatientInterface } from "@/interfaces/patients";
// import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import SingleSelector from "@/components/SingleSelector";

interface SectionThreeProps {
  // errorReferredTo: string;
  // errorRefferedBy: string;
  errorBloodGroup: string;
  errorInsuranceProvider: string;
  errorInsurancePolicyNo: string;
  // errorReferredByName: string;
  // errorReferredByPhoneNo: string;
  // errorReferredByEmail: string;
  // errorReferredByHospitalName: string;
  // errorRefferedByPhoneNo: string;
}

const SectionThree: React.FC<SectionThreeProps> = ({
  // errorReferredTo,
  // errorRefferedBy,
  errorBloodGroup,
  // errorRefferedByPhoneNo,
  errorInsuranceProvider,
  errorInsurancePolicyNo,
  // errorReferredByName,
  // errorReferredByPhoneNo,
  // errorReferredByEmail,
  // errorReferredByHospitalName,
}) => {
  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  const patientDetail = useSelector(
    (state: any) => state.patient.patientDetailData
  );
  const { values, handleChange, onSetHandler } =
    useForm<PatientInterface>(patientDetail);

  // const doctors = useSelector((state: RootState) => state.opd.userList);
  // const frontDeskUserList = useSelector(
  //   (state: RootState) => state.opd.frontDeskUserList
  // );

  // const frontDeskUserObj = frontDeskUserList?.map((frontDeskUser: any) => ({
  //   id: frontDeskUser.id,
  //   label: frontDeskUser.name,
  //   value: frontDeskUser.id,
  // }));
  // const doctorsObj = doctors?.map((doctor: any) => ({
  //   id: doctor.id,
  //   label: doctor.name,
  //   value: doctor.id,
  // }));
  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            type="text"
            label="Insurance Provider"
            className="w-full"
            id="insurance_provider"
            onChange={handleChange}
            name="insurance_provider"
            error={errorInsuranceProvider}
            placeholder="Insurance Provider"
            value={values?.insurance_provider}
          />
        </View>
        <View>
          <Input
            label="Insurance Policy No"
            type="text"
            className="w-full"
            onChange={handleChange}
            id="insurance_policy_no"
            name="insurance_policy_no"
            placeholder="Insurance Policy No"
            error={errorInsurancePolicyNo}
            value={values?.insurance_policy_no}
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          {/* <Select
            id="blood_group"
            label="Blood Group"
            variant="default"
            name="blood_group"
            className="w-full"
            error={errorBloodGroup}
            value={values?.blood_group}
            options={bloodGroupOptions}
            placeholder="Select blood group"
            onChange={(e) => onSetHandler("blood_group", e.target.value)}
          /> */}
          <SingleSelector
            id="blood_group"
            label="Blood Group"
            name="blood_group"
            error={errorBloodGroup}
            value={values?.blood_group || ""}
            placeholder="Select Blood Group"
            onChange={(value) => {
              onSetHandler("blood_group", value);
            }}
            options={bloodGroupOptions}
            closeOnSelect={true}
            // required={true}
          />
        </View>
        <View>
          {/* <Select
            id="dietary_preference"
            label="Dietary Preference"
            name="dietary_preference"
            className="w-full"
            // error={errorBloodGroup}
            value={values?.dietary_preference}
            options={foodTypeOptions}
            placeholder="Select Food Type"
            onChange={(e) => onSetHandler("dietary_preference", e.target.value)}
          /> */}
          <SingleSelector
            id="dietary_preference"
            label="Dietary Preference"
            name="dietary_preference"
            error={errorBloodGroup}
            value={values?.dietary_preference || ""}
            placeholder="Select Dietary Preference"
            onChange={(value) => {
              onSetHandler("dietary_preference", value);
            }}
            options={foodTypeOptions}
            closeOnSelect={true}
            // required={true}
          />
        </View>
      </View>

      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            label="Referred To"
            type="text"
            id="referred_to"
            name="referred_to"
            placeholder="Referred To"
            className="w-full"
            error={errorReferredTo}
            onChange={handleChange}
            value={values?.referred_to}
          />
        </View>
      </View> */}

      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            id="doctor_id"
            name="doctor_id"
            required={true}
            label="Referred To"
            placeholder="Select Doctor"
            options={doctorsObj}
            value={values?.referred_to}
            onChange={(e) => onSetHandler("doctor_id", e.target.value)}
            error={errorsDoctorId}
            disabled={formType === "edit"}
          />
        </View>
        <View>
          <Select
            id="front_desk_user_id"
            name="front_desk_user_id"
            required={true}
            label="Patient Created By"
            placeholder="Select Attender"
            options={frontDeskUserObj}
            value={values?.front_desk_user_id}
            onChange={(e) =>
              onSetHandler("front_desk_user_id", e.target.value || "")
            }
            error={errorsDoctorId}
            disabled={formType === "edit"}
          />
        </View>
      </View> */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            label="Referred By"
            id="referred_by_name"
            name="referred_by_name"
            placeholder="Ex: Dr. Vishnu"
            className="w-full"
            error={errorReferredByName}
            onChange={handleChange}
            value={values?.referred_by_name || ""}
          />
        </View>
        <View>
          <Input
            label="Referred By Phone No"
            className="w-full"
            onChange={handleChange}
            id="referred_by_phone_no"
            name="referred_by_phone_no"
            placeholder="Ex: 9876543210"
            error={errorReferredByPhoneNo}
            value={values?.referred_by_phone_no || ""}
          />
        </View>
        <View>
          <Input
            label="Referred By Email"
            className="w-full"
            onChange={handleChange}
            id="referred_by_email"
            name="referred_by_email"
            placeholder="Ex: drvishnu@gmail.com"
            error={errorReferredByEmail}
            value={values?.referred_by_email}
          />
        </View>
        <View>
          <Input
            label="Referred By Hospital Name"
            className="w-full"
            onChange={handleChange}
            id="referred_by_hospital_name"
            name="referred_by_hospital_name"
            placeholder="Ex: Acharya Sushrut Hospital"
            error={errorReferredByHospitalName}
            value={values?.referred_by_hospital_name}
          />
        </View>
      </View> */}
    </React.Fragment>
  );
};

export default SectionThree;
