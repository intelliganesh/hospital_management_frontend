import Select from "@/components/Select";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
// import SearchSelect from "@/components/SearchSelect";
import { useOpd } from "@/actions/calls/opd";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect } from "react";
import { Examination } from "@/interfaces/examination";

interface SectionOneProps {
  errorsPatientId: string;
  errorsDoctorId: string;
  errorsAppointmentId: string;
  formType: "add" | "edit";
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsPatientId,
  errorsAppointmentId,
  errorsDoctorId,
  formType,
}) => {
  const examinationDetails = useSelector(
    (state: RootState) => state.examinations.examinationDetails
  );

  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  const patients = useSelector((state: RootState) => state.opd.patientList);
  const appointments = useSelector(
    (state: RootState) => state.opd.appointmentList
  );
  const doctors = useSelector((state: RootState) => state.opd.userList);
  const patientObj = patients?.map((patient: any) => ({
    id: patient.id,
    label: patient.patient_number,
    value: patient.id,
  }));
  const appointmentObj = appointments?.map((appointment: any) => ({
    id: appointment.id,
    label: appointment.appointment_number,
    value: appointment.id,
  }));
  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));

  const { values, onSetHandler } = useForm<Examination | null>(
    examinationDetails
  );
  return (
    <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* <View>
        <Select
          id="type"
          name="type"
          required={true}
          error={errorsType}
          label="Appointment Type"
          placeholder="Select Appointment Type"
          options={appointmentTypeOptions}
          value={values?.type}
          onChange={(e) => onSetHandler("type", e.target.value)}
        />
      </View> */}
      <View>
        <Select
          id="patients"
          name="patient_id"
          required={true}
          label="Patient"
          placeholder="Select Patient"
          options={patientObj}
          value={values?.patient_id}
          onChange={(e) => onSetHandler("patient_id", e.target.value)}
          error={errorsPatientId}
          disabled={formType === "edit"}
        />
      </View>
      <View>
        <Select
          id="appointments"
          name="appointment_id"
          required={true}
          label="Appointment"
          placeholder="Select Appointment"
          options={appointmentObj}
          value={values?.appointment_id}
          onChange={(e) => onSetHandler("appointment_id", e.target.value)}
          error={errorsAppointmentId}
          disabled={formType === "edit"}
        />
      </View>
      <View>
        <Select
          id="doctors"
          name="doctor_id"
          required={true}
          label="Doctor"
          placeholder="Select Doctor"
          options={doctorsObj}
          value={values?.doctor_id}
          onChange={(e) => onSetHandler("doctor_id", e.target.value)}
          error={errorsDoctorId}
          disabled={formType === "edit"}
        />
      </View>
    </View>
  );
};
export default SectionOne;
