import React, { useEffect } from "react";
import View from "@/components/view";
import Select from "@/components/Select";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";

import { useOpd } from "@/actions/calls/opd";
import { PatientTest } from "@/interfaces/test";
import { useConsultation } from "@/actions/calls/consultation";

interface SectionTwoProps {
  // errorsAddress: string;
  // errorsPinCode: string;
  // errorsCity: string;
  // errorsState: string;
  // errorsCountry: string;
  // formType: "add" | "edit";
  // errorEnroleFees: string;
  // errorPaymentType: string;
  // errorAmountFor: string;
}

const SectionTwo: React.FC<SectionTwoProps> = (
  {
    // formType,
    // errorsCity,
    // errorsState,
    // errorsCountry,
    // errorsAddress,
    // errorsPinCode,
    // errorAmountFor,
    // errorEnroleFees,
    // errorPaymentType,
  }
) => {
  const patientDetail = useSelector(
    (state: RootState) => state?.patientTest?.patientTestDetailData
  );
  const consultationData = useSelector(
    (state: RootState) => state?.consultation?.consultationDropdownData
  );

  const { PuaListHandler } = useOpd();
  const { consultationDropdownHandler } = useConsultation();

  useEffect(() => {
    PuaListHandler(() => {});
    consultationDropdownHandler(() => {});
  }, []);

  const { values, handleChange } = useForm<PatientTest>(patientDetail);
  //   const consultationData = useSelector(
  //   (state: RootState) => state?.consultation?.consultationDetailData
  // );
  // console.log("consultationD ata", consultationData);

  const patients = useSelector((state: RootState) => state.opd.patientList);

  const doctors = useSelector((state: RootState) => state.opd.userList);
  const patientObj = patients?.map((patient: any) => ({
    id: patient?.id,
    label: patient?.patient_number,
    value: patient?.id,
  }));
  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor?.id,
    label: doctor?.name,
    value: doctor?.id,
  }));
  const consultationObj = consultationData?.map((consultation: any) => ({
    id: consultation?.id,
    label: consultation?.appointment_number,
    value: consultation?.id,
  }));

  // const consultationObj = consultationData?.map((consultation: any) => ({
  //   id: consultation?.id,
  //   label: consultation?.consultation_number,
  //   value: consultation?.id,
  // }));

  // const { values, handleChange, onSetHandler } =
  //   useForm<PatientInterface>(patientDetail);
  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <View>
          <Select
            label="Consulation"
            id="consultation_id"
            name="consultation_id"
            className={`w-full`}
            // error={errorFirstName}
            // onChange={handleChange}
            options={consultationObj}
            placeholder="Ex: Select Consulation"
            // value={values?.test_name}
          />
        </View>

        <View>
          <Select
            label="Patient"
            id="patient_id"
            name="patient_id"
            className={`w-full`}
            // error={errorLastName}
            onChange={handleChange}
            options={patientObj}
            placeholder="Ex: Select Patient"
            value={values?.patient_id}
            required={true}
          />
        </View>
        <View>
          <Select
            label="Doctor"
            id="doctor_id"
            name="doctor_id"
            className={`w-full`}
            // error={errorLastName}
            options={doctorsObj}
            onChange={handleChange}
            placeholder="Ex: Select Doctor"
            value={values?.doctor_id}
            required={true}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default SectionTwo;
