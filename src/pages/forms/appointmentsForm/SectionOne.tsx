import dayjs from "dayjs";
import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
// import Textarea from "@/components/Textarea";
import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import React, { useEffect, useState } from "react";
import useForm from "@/utils/custom-hooks/use-form";
import { usePatient } from "@/actions/calls/patient";
import { Appointment } from "@/interfaces/appointments";
import {
  statusOptions,
  appointmentTypeOptions,
  paymentStatusOptions,
  // paymentTypeOptions,
  // paymentStatusOptions,
} from "./appointmentFormOptions";
import { GenericStatus } from "@/interfaces";
import SingleSelector from "@/components/SingleSelector";
// import SearchSelect from "@/components/SearchSelect";

interface SectionOneProps {
  errorsType: string;
  formType: "add" | "edit";
  errorsPatientId: string;
  errorsDoctorId: string;
  // errorsComplaint: string;
  errorsAppointmentDate: string;
  errorsAppointmentTime: string;
  // errorsConsultationFees: string;
  errorsStatus: string;
  errorFrontDeskUserId: string;
  // errorAmountFor: string;
  prefilledPatientId?: string | null;
  // errorPaymentType: string;
}
const SectionOne: React.FC<SectionOneProps> = ({
  formType,
  errorsType,
  errorsStatus,
  errorsDoctorId,
  // errorsComplaint,
  // errorAmountFor,
  errorsPatientId,
  // errorPaymentType,
  // errorFrontDeskUserId,
  errorsAppointmentTime,
  errorsAppointmentDate,
  // errorsConsultationFees,
  prefilledPatientId,
}) => {
  const appointmentDetails = useSelector(
    (state: RootState) => state.appointment.appointmentDetailData
  );

  const userLoginDetails = useSelector(
    (state: any) => state.authentication.loginUserDetail
  );

  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);
  const [, setFrontDeskUSerAndDoctorInputStatus] = useState<boolean>(false);
  const patients = useSelector((state: RootState) => state.opd.patientList);
  const doctors = useSelector((state: RootState) => state.opd.userList);
  const patientObj = patients?.map((patient: any) => ({
    id: patient.id,
    label:
      patient.patient_number +
      "(" +
      patient.first_name +
      " " +
      patient.last_name +
      ")",
    value: patient.id,
  }));
  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));
  // const frontDeskUserList = useSelector(
  //   (state: RootState) => state.opd.frontDeskUserList
  // );

  // const frontDeskUserObj = frontDeskUserList?.map((frontDeskUser: any) => ({
  //   id: frontDeskUser.id,
  //   label: frontDeskUser.name,
  //   value: frontDeskUser.id,
  // }));

  const { patientDetailHandler } = usePatient();
  const patient = useSelector(
    (state: RootState) => state.patient.patientDetailData
  );
  const { values, handleChange, onSetHandler } = useForm<Appointment | null>(
    appointmentDetails
  );
  useEffect(() => {
    if (prefilledPatientId && formType === "add") {
      onSetHandler("patient_id", prefilledPatientId);
      // Also fetch patient details to prefill doctor and front desk user if available
      patientDetailHandler(prefilledPatientId, () => {});
    }
  }, [prefilledPatientId, formType]);

  useEffect(() => {
    if (formType == "edit") {
      setFrontDeskUSerAndDoctorInputStatus(true);
    }
    if (patient?.referred_to && patient?.front_desk_user_id) {
      setFrontDeskUSerAndDoctorInputStatus(true);
      onSetHandler("doctor_id", patient?.referred_to); // doctor_id (referred_to is variable in backend)
      onSetHandler("front_desk_user_id", patient?.front_desk_user_id);
    }
  }, [patient?.referred_to, patient?.front_desk_user_id, formType]);

  useEffect(() => {
    if (
      
      !values?.front_desk_user_id &&
      userLoginDetails?.id &&
      formType === "add"
    ) {
      onSetHandler("front_desk_user_id", userLoginDetails.id);
    }
  }, [userLoginDetails?.id, formType, values?.front_desk_user_id]);

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

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          {/* <Select
            id="type"
            name="type"
            required={true}
            error={errorsType}
            label="Appointment Type"
            placeholder="Select Appointment Type"
            options={appointmentTypeOptions}
            value={values?.type}
            onChange={(e) => {
              onSetHandler("type", e.target.value);
            }}
          /> */}
          <SingleSelector
            id="type"
            label="Appointment Type"
            name="type"
            error={errorsType}
            value={values?.type || ""}
            placeholder="Select Appointment Type"
            onChange={(value) => {
              onSetHandler("type", value);
            }}
            options={appointmentTypeOptions}
            // closeOnSelect={true}
            required={true}
          />
        </View>
        <View>
          {/* <Select
            id="patients"
            name="patient_id"
            required={true}
            label="Patient"
            placeholder="Select Patient"
            options={patientObj}
            value={values?.patient_id || prefilledPatientId || ""}
            onChange={(e) => {
              patientDetailHandler(e.target.value, () => {});
              onSetHandler("patient_id", e.target.value);
            }}
            error={errorsPatientId}
            disabled={!!prefilledPatientId && formType === "add"}
          /> */}
          <SingleSelector
            id="patient_id"
            label="Patient"
            name="patient_id"
            error={errorsPatientId}
            value={values?.patient_id || prefilledPatientId || ""}
            placeholder="Select Patient"
            onChange={(value) => {
              patientDetailHandler(value, () => {});
              onSetHandler("patient_id", value);
            }}
            options={patientObj}
            // closeOnSelect={true}
            disabled={formType === "edit" && !!prefilledPatientId}
            required={true}
          />
        </View>
      </View>
      {/* <View className="col-span-2">
        <Textarea
          id="complaint"
          // required={true}
          name="complaint"
          label="Complaint"
          placeholder="Enter Complaints"
          error={errorsComplaint}
          onChange={handleChange}
          value={values?.complaint ?? ""}
        />
      </View> */}
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            type="date"
            // required={true}
            id="appointment_date"
            name="appointment_date"
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            label="Appointment Date"
            error={errorsAppointmentDate}
            value={
              values?.appointment_date
                ? values?.appointment_date + ""
                : new Date().toISOString().split("T")[0]
            }
          />
        </View>
        <View>
          <Input
            type="time"
            // required={true}
            id="appointment_time"
            name="appointment_time"
            onChange={handleChange}
            label="Appointment Time"
            error={errorsAppointmentTime}
            value={
              values?.appointment_time
                ? values?.appointment_time
                : dayjs().format("HH:mm")
            }
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          {/* {frontDeskUSerAndDoctorInputStatus ? (
            <React.Fragment>
              <Text as="label">Doctor (Refered To)</Text>
              <View className="border rounded p-2">
                <Text as="h4">
                  {
                    doctorsObj?.find(
                      (doctor: any) => doctor?.id === values?.doctor_id
                      // (doctor: any) => doctor.id === values?.referred_to
                    )?.label
                  }
                </Text>
              </View>
              <Input
                type="text"
                hidden
                name="doctor_id"
                id="doctor_id"
                value={`${values?.doctor_id}` || ""}
                // value={`${values?.referred_to}` || ""}
              />
            </React.Fragment>
          ) : ( */}

          <SingleSelector
            id="doctor_id"
            label="Doctor"
            name="doctor_id"
            error={errorsDoctorId}
            value={values?.doctor_id || ""}
            placeholder="Select Doctor"
            onChange={(value) => {
              onSetHandler("doctor_id", value);
            }}
            options={doctorsObj}
            // closeOnSelect={true}
            required={true}
          />
          {/* )} */}
        </View>
        <View>
          {/* {frontDeskUSerAndDoctorInputStatus ? (
            <React.Fragment>
              <Text as="label">Front Desk User(Refered By)</Text>
              <View className="border rounded p-2">
                <Text as="h4">
                  {
                    frontDeskUserObj?.find(
                      (frontendDesl: any) =>
                        frontendDesl.id === values?.front_desk_user_id
                    )?.label
                  }
                </Text>
              </View>
              <Input
                type="text"
                hidden
                name="front_desk_user_id"
                id="front_desk_user_id"
                value={values?.front_desk_user_id || userLoginDetails?.id}
              />
            </React.Fragment>
          ) : ( */}

          <Input
            type="text"
            label="Appointment Created By"
            className="w-full"
            placeholder="Appointment Created By"
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
            id="front_desk"
            name="front_desk_user_id"
            label="Front Desk User"
            placeholder="Select Front Desk User"
            options={frontDeskUserObjWithCurrentUser} 
            value={values?.front_desk_user_id || userLoginDetails?.id || ""}
            onChange={(value) => {
              onSetHandler("front_desk_user_id", value);
            }}
            error={errorFrontDeskUserId}
          /> */}
        </View>
      </View>
      {/* <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <View>
          <Input
            // required={true}
            id="amount"
            name="amount"
            label="Consultation Fees"
            onChange={handleChange}
            error={errorsConsultationFees}
            value={values?.amount ? values?.amount + "" : ""}
            placeholder="Enter Enroll Fees"
            // disabled={formType === "edit" ? true : false}
            readOnly={formType === "edit" ? true : false}
          />
        </View>
        <View> */}
      {/* <Select
            id="amount_for"
            // required={true}
            name="amount_for"
            label="Amount For"
            error={errorAmountFor}
            options={amountOptions}
            placeholder="Select Amount For"
            value={values?.amount_for}
            onChange={(e) => {
              onSetHandler("amount_for", e.target.value);
            }}
          /> */}
      {/* <SingleSelector
            id="amount_for"
            label="Amount For"
            name="amount_for"
            error={errorAmountFor}
            value={values?.amount_for || ""}
            placeholder="Select Amount For"
            onChange={(value) => {
              onSetHandler("amount_for", value);
            }}
            options={amountOptions}
            // closeOnSelect={true}
            // required={true}
          />
        </View>
      </View> */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <View className="mt-4">
        <Select
          id="payment_type"
          name="payment_type"
          required={true}
          error={errorPaymentType}
          label="Payment Type"
          placeholder="Select Payment Type"
          options={paymentTypeOptions}
          value={values?.payment_type}
          onChange={(e) => {
            onSetHandler("payment_type", e.target.value);
          }}
        />
      </View>
      </View> */}
      <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* <View>
          {frontDeskUSerAndDoctorInputStatus ? (
            <React.Fragment>
              <Text as="label">Front Desk User(Refered By)</Text>
              <View className="border rounded p-2">
                <Text as="h4">
                  {
                    frontDeskUserObj?.find(
                      (frontendDesl: any) =>
                        frontendDesl.id === values?.front_desk_user_id
                    )?.label
                  }
                </Text>
              </View>
              <Input
                type="text"
                hidden
                name="front_desk_user_id"
                id="front_desk_user_id"
                value={values?.front_desk_user_id || ""}
              />
            </React.Fragment>
          ) : (
            // <Select
            //   id="front_desk"
            //   name="front_desk_user_id"
            //   // required={true}
            //   label="Front Desk User"
            //   placeholder="Select Front Desk User"
            //   options={frontDeskUserObj}
            //   value={values?.front_desk_user_id || ""}
            //   onChange={(e) =>
            //     onSetHandler("front_desk_user_id", e.target.value)
            //   }
            //   error={errorFrontDeskUserId}
            // />
            <SingleSelector
              id="front_desk_user_id"
              label="Front Desk User"
              name="front_desk_user_id"
              error={errorFrontDeskUserId}
              value={values?.front_desk_user_id || ""}
              placeholder="Select Front Desk User"
              onChange={(value) => {
                onSetHandler("front_desk_user_id", value);
              }}
              options={frontDeskUserObj}
              // closeOnSelect={true}
              // required={true}
            />
          )}
        </View> */}
        <View>
          {/* <Select
            id="payment_status"
            name="payment_status"
            // required={true}
            // error={errorPaymentType}
            label="Payment Status"
            placeholder="Select Payment Status"
            options={paymentStatusOptions}
            value={values?.payment_status || GenericStatus.PENDING}
            onChange={(e) => {
              onSetHandler("payment_status", e.target.value);
            }}
          /> */}
          <SingleSelector
            id="payment_status"
            label="Payment Status"
            name="payment_status"
            // error={errorPaymentStatus}
            value={values?.payment_status || GenericStatus.PENDING}
            placeholder="Select Payment Status"
            onChange={(value) => {
              onSetHandler("payment_status", value);
            }}
            options={paymentStatusOptions}
            // closeOnSelect={true}
            // required={true}
          />
        </View>
        {values?.type === GenericStatus.FIRST_VISIT && (
          <View>
            <Input
              label="Referred By"
              id="referred_by_name"
              name="referred_by_name"
              placeholder="Ex: Dr. Vishnu"
              className="w-full"
              // error={errorReferredByName}
              onChange={handleChange}
              value={values?.referred_by_name || ""}
            />
          </View>
        )}
        {/* <View className="">
          <Select
            id="status"
            name="status"
            label="Status"
            placeholder="Select Status"
            // required={true}
            error={errorsStatus}
            value={values?.status || GenericStatus.PENDING}
            options={statusOptions}
            onChange={handleChange}
          />
        </View> */}
        <View>
          <SingleSelector
            id="status"
            label="Appointment Status"
            name="status"
            error={errorsStatus}
            value={values?.status || GenericStatus.PENDING}
            placeholder="Select Appointment Status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            options={statusOptions}
            // closeOnSelect={true}
            // required={true}
          />
        </View>
      </View>
      {/* <input type="text" hidden name="consultation_type" value={"Proctology"} /> */}
    </React.Fragment>
  );
};
export default SectionOne;
