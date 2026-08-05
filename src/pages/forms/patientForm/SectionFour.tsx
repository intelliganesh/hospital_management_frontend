import React from "react";
import View from "@/components/view";
import { useSelector } from "react-redux";
import useForm from "@/utils/custom-hooks/use-form";
import { PatientInterface } from "@/interfaces/patients";
import {
  // surgeryStatusOptions,
  // emergencyStatusOptions,
  // treatmentStatusOptions,
  // admissionStatusOptions,
  administrativeStatusOptions,
} from "./patientFormOptions";
// import { RootState } from "@/actions/store";
import { GenericStatus } from "@/interfaces";
import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";

interface SectionFourProps {
  errorStatus: string;
  // errorSurgeryStatus: string;
  // errorPaymentStatus: string;
  errorReferralStatus: string;
  //   errorAdmissionStatus: string;
  //   errorTreatmentStatus: string;
  //   errorEmergencyStatus: string;
}

const SectionFour: React.FC<SectionFourProps> = ({
  errorStatus,
  // errorSurgeryStatus,
  // errorPaymentStatus,
  // errorReferralStatus,
  // errorAdmissionStatus,
  // errorTreatmentStatus,
  // errorEmergencyStatus,
}) => {
  const patientDetail = useSelector(
    (state: any) => state.patient.patientDetailData
  );
  // const frontDeskUserList = useSelector(
  //   (state: RootState) => state.opd.frontDeskUserList
  // );
  const userLoginDetails = useSelector(
    (state: any) => state.authentication.loginUserDetail
  );
  // const frontDeskUserObj = frontDeskUserList?.map((frontDeskUser: any) => ({
  //   id: frontDeskUser.id,
  //   label: frontDeskUser.name,
  //   value: frontDeskUser.id,
  // }));

  // const frontDeskUserObjWithCurrentUser = [
  //   ...(frontDeskUserObj || []), // Handle case when frontDeskUserObj is null/undefined
  //   // Add current user if not already in the list
  //   ...((frontDeskUserObj || [])?.find(
  //     (user: any) => user.id === userLoginDetails?.id
  //   )
  //     ? []
  //     : userLoginDetails?.id
  //     ? [
  //         {
  //           id: userLoginDetails?.id,
  //           label: userLoginDetails?.name,
  //           value: userLoginDetails?.id,
  //         },
  //       ]
  //     : []),
  // ].filter(Boolean);
  const { values, onSetHandler } = useForm<PatientInterface>(patientDetail);
  return (
    <React.Fragment>
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            label="Admission Status"
            variant="default"
            className="w-full"
            id="admission_status"
            name="admission_status"
            error={errorAdmissionStatus}
            placeholder="Admission Status"
            value={values?.admission_status}
            options={admissionStatusOptions}
            onChange={(e) => onSetHandler("admission_status", e.target.value)}
          />
        </View>

        <View>
          <Select
            label="Treatment"
            variant="default"
            className="w-full"
            id="treatment_status"
            name="treatment_status"
            error={errorTreatmentStatus}
            placeholder="Treatment Status"
            value={values?.treatment_status}
            options={treatmentStatusOptions}
            onChange={(e) => onSetHandler("treatment_status", e.target.value)}
          />
        </View>
      </View> */}

      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            label="Surgery"
            variant="default"
            className="w-full"
            id="surgery_status"
            name="surgery_status"
            error={errorSurgeryStatus}
            options={surgeryStatusOptions}
            value={values?.surgery_status}
            placeholder="Select surgery status"
            onChange={(e) => onSetHandler("surgery_status", e.target.value)}
          />
        </View>

        <View>
          <Select
            label="Emergency"
            variant="default"
            className="w-full"
            id="emergency_status"
            name="emergency_status"
            error={errorEmergencyStatus}
            placeholder="Emergency Status"
            value={values?.emergency_status}
            options={emergencyStatusOptions}
            onChange={(e) => onSetHandler("emergency_status", e.target.value)}
          />
        </View>
      </View> */}

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* <View> */}
        {/* <Select
            label="Referral"
            variant="default"
            className="w-full"
            id="referral_status"
            name="referral_status"
            error={errorReferralStatus}
            value={values?.referral_status}
            options={referralStatusOptions}
            placeholder="Select referral status"
            onChange={(e) => onSetHandler("referral_status", e.target.value)}
          /> */}
        {/* <SingleSelector
            id="referral_status"
            label="Referral Status"
            name="referral_status"
            error={errorReferralStatus}
            value={values?.referral_status || ""}
            placeholder="Select Referral Status"
            onChange={(value) => {
              onSetHandler("referral_status", value);
            }}
            options={referralStatusOptions}
            closeOnSelect={true}
            // required={true}
          />
        </View> */}
        <View>
          {/* <Select
            id="front_desk_user_id"
            name="front_desk_user_id"
            // required={true}
            label="Patient Created By"
            placeholder="Select Attender"
            options={frontDeskUserObj}
            value={values?.front_desk_user_id || userLoginDetails?.id}
            onChange={(e) =>
              onSetHandler("front_desk_user_id", e.target.value || "")
            }
            // error={errorsDoctorId}
            // disabled={formType === "edit"}
          /> */}
          <Input
            type="text"
            label="Patient Created By"
            className="w-full"
            placeholder="Patient Created By"
            value={userLoginDetails?.name}
            readOnly
          />
          <input
            type="hidden"
            id="front_desk_user_id"
            name="front_desk_user_id"
            value={userLoginDetails?.id}
          />
          {/* <SingleSelector
            id="front_desk_user_id"
            label="Patient Created By"
            name="front_desk_user_id"
            error={errorReferralStatus}
            value={values?.front_desk_user_id ?? userLoginDetails?.id}
            placeholder="Select Patient Created By"
            onChange={(value) => {
              onSetHandler("front_desk_user_id", value);
            }}
            options={frontDeskUserObjWithCurrentUser}
            closeOnSelect={true}
            // required={true}
          /> */}
        </View>
        {/* <View>
          <Select
            label="Payment"
            variant="default"
            className="w-full"
            id="payment_status"
            name="payment_status"
            error={errorPaymentStatus}
            placeholder="Payment Status"
            value={values?.payment_status}
            options={paymentStatusOptions}
            onChange={(e) => onSetHandler("payment_status", e.target.value)}
          />
        </View> */}
        <View>
          {/* <Select
            label="Status"
            id="status"
            name="status"
            variant="default"
            className="w-full"
            error={errorStatus}
            placeholder="Status"
            value={values?.status || GenericStatus.ACTIVE}
            options={administrativeStatusOptions}
            onChange={(e) => onSetHandler("status", e.target.value)}
          /> */}
          <SingleSelector
            id="status"
            label="Status"
            name="status"
            error={errorStatus}
            value={values?.status || GenericStatus.ACTIVE}
            placeholder="Select Status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            options={administrativeStatusOptions}
            closeOnSelect={true}
            // required={true}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default SectionFour;
