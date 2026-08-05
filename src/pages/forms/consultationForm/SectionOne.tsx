import { useOpd } from "@/actions/calls/opd";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface SectionOneProps {
  errorsAppointmentId: string;
  errorsPatientId: string;
  errorsDoctorId: string;
  errorsComplaint: string;
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsAppointmentId,
  errorsPatientId,
  errorsDoctorId,
  errorsComplaint,
}) => {
  const { PuaListHandler } = useOpd();
  const patientData = useSelector(
    (state: RootState) => state?.opd?.patientList
  );
  const appointmentData = useSelector(
    (state: RootState) => state?.opd?.appointmentList
  );
  const doctorData = useSelector((state: RootState) => state?.opd?.userList);
  const consultationDetail = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.consultations
  );
  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetail
  );
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <View>
          {/* <Select
            required={true}
            id="appointment_id"
            name="appointment_id"
            label="Appointment ID"
            error={errorsAppointmentId}
            value={values?.appointment_id}
            placeholder="Select Appointment ID"
            onChange={(e) => onSetHandler("appointment_id", e.target.value)}
            options={appointmentData?.map((item: any) => ({
              value: item.id,
              label: item.appointment_number,
            }))}
          /> */}
          <SingleSelector
            id="appointment_id"
            label="Appointment ID"
            name="appointment_id"
            error={errorsAppointmentId}
            value={values?.appointment_id || ""}
            placeholder="Select Appointment ID"
            onChange={(value) => {
              onSetHandler("appointment_id", value);
            }}
            options={appointmentData?.map((item: any) => ({
              value: item.id,
              label: item.appointment_number,
            }))}
            required={true}
          />
        </View>
        <View>
          {/* <Select
            required={true}
            id="patient_id"
            name="patient_id"
            label="Patient ID"
            error={errorsPatientId}
            value={values?.patient_id}
            placeholder="Select Patient ID"
            onChange={(e) => onSetHandler("patient_id", e.target.value)}
            options={patientData?.map((item: any) => ({
              value: item.id,
              label: item.patient_number,
            }))}
          /> */}
          <SingleSelector
            id="patient_id"
            label="Patient ID"
            name="patient_id"
            error={errorsPatientId}
            value={values?.patient_id || ""}
            placeholder="Select Patient ID"
            onChange={(value) => {
              onSetHandler("patient_id", value);
            }}
            options={patientData?.map((item: any) => ({
              value: item.id,
              label: item.patient_number,
            }))}
            required={true}
          />

        </View>
        <View>
          {/* <Select
            required={true}
            id="doctor_id"
            name="doctor_id"
            label="Doctor"
            error={errorsDoctorId}
            value={values?.doctor_id}
            placeholder="Select Doctor ID"
            onChange={(e) => onSetHandler("doctor_id", e.target.value)}
            options={doctorData?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
          /> */}
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
            options={doctorData?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"></View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View className="col-span-2">
          <Textarea
            id="complaint"
            required={true}
            name="complaint"
            label="Complaint"
            placeholder="Complaint"
            error={errorsComplaint}
            onChange={handleChange}
            value={values?.complaint ?? ""}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
