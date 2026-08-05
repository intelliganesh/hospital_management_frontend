import React from "react";
import Input from "@/components/input";
import View from "@/components/view";
// import { Examination } from "@/interfaces/appointments";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
// import SearchSelect from "@/components/SearchSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Examination } from "@/interfaces/examination";
import dayjs from "dayjs";

// interface SectionOneProps {
//   errorsType: string;
//   errorsPatientId: string;
//   errorsDoctorId: string;
//   errorsComplaint: string;
//   errorsAppointmentDate: string;
//   errorsAppointmentTime: string;
//   errorsEnrollFees: string;
//   errorsStatus: string;
// }
const SectionThree: React.FC = (
  {
    // errorsType,
    // errorsPatientId,
    // errorsDoctorId,
    // errorsComplaint,
    // errorsAppointmentDate,
    // errorsAppointmentTime,
    // errorsEnrollFees,
    // errorsStatus
  }
) => {
  const examinationDetails = useSelector(
    (state: RootState) => state.examinations.examinationDetails
  );

  const { values, handleChange } = useForm<Examination | null>(
    examinationDetails
  );

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 gap-6">
        <View>
          <Textarea
            id="complaint"
            name="complaint"
            label="Complaints"
            placeholder="Enter Complaints"
            onChange={handleChange}
            value={values?.complaint}
          />
        </View>
        <View>
          <Textarea
            id="advice"
            name="advice"
            label="Advice"
            placeholder="Enter Advice"
            onChange={handleChange}
            value={values?.advice}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2  gap-6">
        <View>
          <Input
            id="preliminary_diagnosis"
            name="preliminary_diagnosis"
            label="Preliminary Diagnosis"
            onChange={handleChange}
            // error={errorsEnrollFees}
            value={
              values?.preliminary_diagnosis
                ? values?.preliminary_diagnosis + ""
                : ""
            }
            placeholder="Enter Preliminary Diagnosis"
          />
        </View>

        <View>
          <Input
            type="date"
            required={true}
            id="next_visit_date"
            name="next_visit_date"
            onChange={handleChange}
            label="Next Visit Date"
            // error={errorsAppointmentDate}
            value={dayjs(values?.next_visit_date).format("YYYY-MM-DD")}
          />
        </View>
      </View>
    </React.Fragment>
  );
};
export default SectionThree;
