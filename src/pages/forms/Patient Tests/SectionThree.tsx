import React, { useEffect } from "react";
import View from "@/components/view";
import Select from "@/components/Select";
import { useSelector } from "react-redux";
import useForm from "@/utils/custom-hooks/use-form";
import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import { PatientTest } from "@/interfaces/test";
import { resultStatusOptions } from "./patientTestFormOptions";

interface SectionThreeProps {}

const SectionThree: React.FC<SectionThreeProps> = ({}) => {
  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  const patientDetail = useSelector(
    (state: any) => state?.pstientTest?.patientTestDetailData
  );
  const { values, handleChange } = useForm<PatientTest>(patientDetail);

  const users = useSelector((state: RootState) => state?.opd?.userList);

  const usersObj = users?.map((userList: any) => ({
    id: userList?.id,
    label: userList?.name,
    value: userList?.id,
  }));
  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Select
            label="Test Status"
            className="w-full"
            id="result_status"
            name="result_status"
            options={resultStatusOptions}
            onChange={handleChange}
            // error={errorInsuranceProvider}
            placeholder="Select Test Status"
            value={values?.result_status}
            required={true}
          />
        </View>
        <View>
          <Select
            label="Result Uploaded By"
            className="w-full"
            onChange={handleChange}
            options={usersObj}
            id="result_uploaded_by"
            name="result_uploaded_by"
            placeholder="Select Result Uploaded By"
            // error={errorInsurancePolicyNo}
            value={values?.result_uploaded_by}
            required={true}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default SectionThree;
