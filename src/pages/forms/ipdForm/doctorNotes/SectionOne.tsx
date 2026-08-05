import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
import dayjs from "dayjs";
import { DoctorNotes } from "@/interfaces/ipd/doctorNotes";
import SingleSelector from "@/components/SingleSelector";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect } from "react";
import { useOpd } from "@/actions/calls/opd";

interface SectionOneProps {
  errorsDate: string;
  errorsTime: string;
  errorsDoctorId: string;
  errorsClinicalNotes: string;
  errorsDiagnosis: string;
  errorsGc: string;
  errorsPr: string;
  errorsBp: string;
}

const SectionOne: React.FC<SectionOneProps> = ({ errorsDate, errorsTime, errorsDoctorId, errorsClinicalNotes, errorsDiagnosis, errorsGc, errorsPr, errorsBp }) => {
  const doctors = useSelector((state: RootState) => state.opd.userList);

  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));

  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => { });
  }, []);
  const { values, handleChange, onSetHandler } =
    useForm<Partial<DoctorNotes> | null>({});

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
        <SingleSelector
          id="doctor_id"
          label="Attending Doctor"
          name="doctor_id"
          error={errorsDoctorId}
          value={values?.doctor_id || ""}
          placeholder="Select Attending Doctor"
          onChange={(value) => {
            onSetHandler("doctor_id", value);
          }}
          options={doctorsObj}
          // closeOnSelect={true}
          required={true}
        />
        <View>
          <Input
            id="date"
            name="date"
            type="date"
            label="Date"
            placeholder="Select Date"
            onChange={handleChange}
            error={errorsDate}
            value={
              values?.date
                ? values?.date + ""
                : new Date().toISOString().split("T")[0] || ""
            }
          />
        </View>

        <View>
          <Input
            id="time"
            name="time"
            type="time"
            label="Time"
            placeholder="Select Time"
            onChange={handleChange}
            error={errorsTime}
            value={values?.time ? values?.time : dayjs().format("HH:mm:ss") || ""}
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="gc"
            name="gc"
            label="GC"
            placeholder="Conscious / Oriented"
            onChange={handleChange}
            value={values?.gc}
            error={errorsGc}
          />
        </View>
        <View>
          <Input
            id="bp"
            name="bp"
            label="BP"
            placeholder="120/80 mmHg"
            onChange={handleChange}
            value={values?.bp}
            error={errorsBp}
          />
        </View>
        <View>
          <Input
            id="pr"
            name="pr"
            label="PR"
            placeholder="72 bpm"
            onChange={handleChange}
            value={values?.pr}
            error={errorsPr}
          />
        </View>
      </View>
      <View className="mb-4">
        <Textarea
          id="clinical_notes"
          name="clinical_notes"
          label="Clinical Notes"
          placeholder="Enter Notes"
          onChange={handleChange}
          value={values?.clinical_notes || ""}
          error={errorsClinicalNotes}
        />
      </View>
      <View>
        <Textarea
          id="diagnosis"
          name="diagnosis"
          label="Diagnosis"
          placeholder="Enter Diagnosis"
          onChange={handleChange}
          error={errorsDiagnosis}
          value={values?.diagnosis || ""}
        />
      </View>
    </>
  );
};
export default SectionOne;
