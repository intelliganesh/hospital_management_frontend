import Input from "@/components/input";
import Select from "@/components/Select";
import View from "@/components/view";
import { statusOptions } from "./opdFormOptions";
import { OpdCase } from "@/interfaces/opdCases";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect } from "react";
import { useOpd } from "@/actions/calls/opd";
import dayjs from "dayjs";

interface SectionOneProps {
  errorsPatientId: string;
  errorsAppointmentId: string;
  errorsStatus: string;
  errorsVisitDate: string;
  errorsComplaint: string;
  errorsRefferedDoctorId: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsPatientId,
  errorsAppointmentId,
  errorsStatus,
  errorsVisitDate,
  errorsComplaint,
  errorsRefferedDoctorId,
}) => {
  const { PuaListHandler } = useOpd();
  const patientData = useSelector(
    (state: RootState) => state?.opd?.patientList
  );

  const appointmentData = useSelector(
    (state: RootState) => state?.opd?.appointmentList
  );

  const doctorData = useSelector((state: RootState) => state?.opd?.userList);

  const opdDetails = useSelector((state: RootState) => state.opd.opdDetailData);
  const { values, handleChange, onSetHandler } = useForm<OpdCase | null>(
    opdDetails
  );
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            id="patient_id"
            name="patient_id"
            label="Patient Name"
            required={true}
            options={patientData?.map((item: any) => ({
              value: item.id,
              label: item.patient_number,
            }))}
            placeholder="Patient Name"
            error={errorsPatientId}
            value={values?.patient_id}
            onChange={handleChange}
          />
        </View>
        <View>
          <Select
            id="appointment_id"
            name="appointment_id"
            required={true}
            options={appointmentData?.map((item: any) => ({
              value: item.id,
              label: item.appointment_number,
            }))}
            error={errorsAppointmentId}
            label="Appointment Id"
            onChange={handleChange}
            value={values?.appointment_id}
            placeholder="Appointment Id"
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            id="status"
            name="status"
            label="Status"
            required={true}
            variant="default"
            className="w-full"
            error={errorsStatus}
            placeholder="Status"
            value={values?.status}
            options={statusOptions}
            onChange={(e) => onSetHandler("status", e.target.value)}
          />
        </View>
        <View>
          <Input
            type="datetime-local"
            id="visit_date"
            required={true}
            name="visit_date"
            label="Visit Date"
            error={errorsVisitDate}
            onChange={handleChange}
            placeholder="Visit Date"
            value={dayjs(values?.visit_date).format("YYYY-MM-DD HH:mm:ss")}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View className="col-span-2">
          <Textarea
            id="complaint"
            name="complaint"
            label="Complaint"
            placeholder="Complaint"
            error={errorsComplaint}
            onChange={handleChange}
            value={values?.complaint}
            required={true}
          />
        </View>
        <View>
          <Select
            options={doctorData?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            required={true}
            label="Referred To Doctor"
            id="referred_to_doctor_id"
            name="referred_to_doctor_id"
            error={errorsRefferedDoctorId}
            placeholder="Select a doctor"
            value={values?.referred_to_doctor_id}
            onChange={(e) =>
              onSetHandler("referred_to_doctor_id", e.target.value)
            }
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
