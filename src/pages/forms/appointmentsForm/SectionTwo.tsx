import React from "react";
import View from "@/components/view";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import Input from "@/components/input";
import useForm from "@/utils/custom-hooks/use-form";
import { Appointment } from "@/interfaces/appointments";

const SectionTwo: React.FC = () => {
  const consultationDetailData = useSelector(
    (state: RootState) => state.consultation.consultationDetailData
  );

  const { values, handleChange } = useForm<Appointment | null>(
    consultationDetailData
  );

  return (
    <View className="mt-4">
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <View>
          <Input
            label="Referred By Phone No"
            className="w-full"
            onChange={handleChange}
            id="referred_by_phone_no"
            name="referred_by_phone_no"
            placeholder="Ex: 9876543210"
            // error={errorReferredByPhoneNo}
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
            // error={errorReferredByEmail}
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
            // error={errorReferredByHospitalName}
            value={values?.referred_by_hospital_name}
          />
        </View>
      </View>
    </View>
  );
};

export default SectionTwo;
