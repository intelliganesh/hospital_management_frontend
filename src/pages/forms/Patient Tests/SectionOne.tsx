import View from "@/components/view";
import Input from "@/components/input";
// import Select from "@/components/Select";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useForm from "@/utils/custom-hooks/use-form";
// import { genderOptions, maritalStatusOptions } from "./patientFormOptions";
// import { PatientInterface } from "@/interfaces/patients";
import { PatientTest } from "@/interfaces/test";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { useTest } from "@/actions/calls/test";
import Select from "@/components/Select";

interface SectionOneProps {
  // errorDOB: string;
  // errorEmail: string;
  // errorPhoneNo: string;
  // errorsGender: string;
  // errorLastName: string;
  // errorFirstName: string;
  // errorAttendantWithPatientName: string;
  // errorAttendantWithPatientPhoneNo: string;
}

const SectionOne: React.FC<SectionOneProps> = (
  {
    // errorDOB,
    // errorEmail,
    // errorsGender,
    // errorPhoneNo,
    // errorLastName,
    // errorFirstName,
    // errorAttendantWithPatientName,
    // errorAttendantWithPatientPhoneNo,
  }
) => {
  const patientTestDetails = useSelector(
    (state: any) => state.patientTest.patientTestDetailData
  );
  const { testDropdownHandler } = useTest();

  useEffect(() => {
    testDropdownHandler(() => {});
  }, []);
  const testDropdownData = useSelector(
    (state: any) => state.test.testDropdownData
  );

  const testObj = testDropdownData?.map((test: any) => ({
    id: test?.id,
    label: test?.test_name,
    value: test?.id,
  }));

  const { values, handleChange, handleTipTapChange } =
    useForm<PatientTest>(patientTestDetails);

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* <View>
          <Input
            label="Test ID"
            id="test_id"
            name="test_id"
            className={`w-full`}
            // error={errorFirstName}
            onChange={handleChange}
            placeholder="Ex: 1"
            value={`${values?.test_id ? values?.test_id + "" : ""}`}
            required={true}
          />
        </View> */}
        <View>
          <Select
            label="Test"
            id="test_id"
            name="test_id"
            className={`w-full`}
            // error={errorFirstName}
            onChange={handleChange}
            options={testObj}
            placeholder="Select Test"
            value={values?.test_id || ""}
            required={true}
          />
        </View>
        <View>
          <Input
            label="Test Name"
            id="test_name"
            name="test_name"
            className={`w-full`}
            // error={errorFirstName}
            onChange={handleChange}
            placeholder="Ex: Blood Test"
            value={values?.test_name}
            required={true}
          />
        </View>

        <View>
          <Input
            label="Test Place"
            id="test_place"
            name="test_place"
            className={`w-full`}
            // error={errorLastName}
            onChange={handleChange}
            placeholder="Ex: In Hospital"
            value={values?.test_place}
            required={true}
          />
        </View>
        <View>
          <Input
            label="Billing Amount"
            id="billing_amount"
            name="billing_amount"
            className={`w-full`}
            // error={errorLastName}
            onChange={handleChange}
            placeholder="Ex: 1000"
            value={values?.billing_amount ? values?.billing_amount + "" : ""}
          />
        </View>
      </View>

      <View className="grid grid-cols-1 gap-4 mb-4">
        <View>
          <TipTapTextEditor
            name="test_description"
            label="Test Description"
            onChange={handleTipTapChange}
            areaHeight="h-24"
            // error={errors?.test_description}
            value={values?.test_description}
            placeholder="Ex: This is a test description"
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default SectionOne;
