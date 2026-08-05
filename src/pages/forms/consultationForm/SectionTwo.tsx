import React, { useEffect } from "react";
import Input from "@/components/input";
import View from "@/components/view";
// import { Appointment } from "@/interfaces/appointments";
import useForm from "@/utils/custom-hooks/use-form";
// import Textarea from "@/components/Textarea";
// import SearchSelect from "@/components/SearchSelect";
// import { useOpd } from "@/actions/calls/opd";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
// import { useEffect } from "react";
// import dayjs from "dayjs";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { Consultation } from "@/interfaces/consultation";
import { useTest } from "@/actions/calls/test";
import MultiSelector from "@/components/MultiSelector";
import SingleSelector from "@/components/SingleSelector";
// import Text from "@/components/text";
// import Button from "@/components/button";

interface SectionTwoProps {
  errorsTemperature: string;
  errorsBp: string;
  errorsPulse: string;
  errorsCvs: string;
  errorsRs: string;
  errorsTest: string;
  mainOnSetHandler: (name: string, value: any) => void;
}

const SectionTwo: React.FC<SectionTwoProps> = ({
  errorsTemperature,
  errorsBp,
  errorsPulse,
  errorsCvs,
  errorsRs,
  errorsTest,
  mainOnSetHandler,
}) => {
  // const examinationDetails = useSelector(
  //   (state: RootState) => state.examinations.examinationDetails
  // );
  // const { values, handleChange } = useForm<Examination | null>(
  //   examinationDetails
  // );

  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData?.vitals,
  );
  const testData = useSelector(
    // (state: any) => state.consultation.consultationDetailData?.proctologyOrNonProctology?.test_id
    (state: any) =>
      state.consultation?.consultationDetailData?.consultations?.test_id,
  );

  const { testDropdownHandler } = useTest();
  const testDropdowndata = useSelector(
    (state: RootState) => state.test.testDropdownData,
  );

  useEffect(() => {
    testDropdownHandler(() => {});
  }, []);

  const testObj = testDropdowndata?.map((test: any) => ({
    id: test?.id,
    label: test?.test_name,
    value: test?.id,
  }));

  // const testIds = testData?.split(",")?.map((item: any) => item.trim());
  // const testLabelMap = testObj?.filter((item: any) =>
  //   testIds?.includes(item?.value?.toString())
  // )?.map((item: any) => {
  //   return {
  //     id: item?.value,
  //     label: item?.label,
  //     value: item?.value,
  //   };
  // });
  // const testLabelMap = testObj?.filter((item: any) =>
  //   testIds?.includes(item?.value?.toString())
  // )?.map((item: any) => item?.label)?.join(",");
  // console.log("testLabelMap", testLabelMap);

  const { values, handleChange, handleTipTapChange, onSetHandler } =
    useForm<Consultation | null>(consultationDetail);

  useEffect(() => {
    onSetHandler("test_id", testData);
    if (testData) {
      setSelectedTests(
        testData?.split(",")?.map((item: any) => Number(item.trim())),
      );
    }
  }, [testData]);

  const [selectedTests, setSelectedTests] = React.useState<string[]>([]);

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <View className="space-y-2" style={{ alignItems: "end" }}>
          <Input
            id="temperature"
            name="temperature"
            label="Temperature"
            onChange={handleChange}
            // error={errorsTemperature}
            value={
              values?.temperature
                ? (values?.temperature + "").split(" ")[0]
                : ""
            }
            placeholder="Ex: 36.5"
          />
          {/* <Select
            name="temperature_unit"
            value={
              values?.temperature ? values?.temperature?.split(" ")[1] : ""
            }
            onChange={handleChange}
            options={[
              { label: "Celsius (°C)", value: "\u00B0C" },
              { label: "Fahrenheit (°F)", value: "\u00B0F" },
            ]}
            error={errorsTemperature}
            className="min-w-[80px] "
          /> */}
          <SingleSelector
            name="temperature_unit"
            value={
              values?.temperature ? values?.temperature?.split(" ")[1] : ""
            }
            onChange={(value) => {
              onSetHandler("temperature_unit", value);
            }}
            options={[
              { label: "Celsius (°C)", value: "\u00B0C" },
              { label: "Fahrenheit (°F)", value: "\u00B0F" },
            ]}
            placeholder="Select Temperature Unit"
            error={errorsTemperature}
          />
        </View>
        <View>
          <Input
            id="bp"
            name="bp"
            label="Blood Pressure"
            onChange={handleChange}
            error={errorsBp}
            value={values?.bp ? values?.bp + "" : ""}
            placeholder="Ex: 120/80 mmHg"
          />
        </View>
        <View>
          <Input
            id="pulse"
            name="pulse"
            label="Pulse"
            onChange={handleChange}
            error={errorsPulse}
            value={values?.pulse ? values?.pulse + "" : ""}
            placeholder="Ex: 80 bpm"
          />
        </View>
      </View>
      <View className="grid grid-cols-1   gap-6">
        <View>
          <TipTapTextEditor
            name="cvs"
            value={values?.cvs}
            onChange={handleTipTapChange}
            label="Cardiovascular System"
            areaHeight="h-24"
            placeholder="Enter respiratory system details..."
            className={errorsCvs ? "!border-red-500" : ""}
            error={errorsCvs}
          />
        </View>
        <View>
          <TipTapTextEditor
            name="rs"
            value={values?.rs}
            onChange={handleTipTapChange}
            label="Respiratory System"
            areaHeight="h-24"
            placeholder="Enter a respiratory system details..."
            className={errorsRs ? "!border-red-500" : ""}
            error={errorsRs}
          />
        </View>
        <View>
          {/* <SearchSelect
            name="test_id"
            label="Test"
            selected={`${values?.test_id}` || ""}
            // value={values?.test_id || ""}
            // onChange={handleChange}
            onSelect={(e) => onSetHandler("test_id", e?.value)}
            options={testObj}
            placeholder="Select Test"
            error={errorsTest}
            showLabel={true}
          /> */}
          {/* <MultiSelectWithDropDown
            name="test_id"
            label="Test"
            // onChange={(value) => onSetHandler("test_id", value)}
            useObjectFormat={false}
            // onChange={(value) => onSetHandler("test_id", value)}
            placeholder="Select Test"
            value={testValuesObjects || []}
            options={testObj}
            onChange={(value) => onSetHandler("test_id", value)}
            error={errorsTest}
            defaultValue={testLabelMap || []}
            allowCustomValues={false}
            // defaultItems={testLabelMap || []}
            // defaultValue={testLabelMap || []}
          /> */}
          <MultiSelector
            name="test_id"
            label="Test"
            value={selectedTests.length > 0 ? selectedTests : []}
            // value={selectedTests || []}
            onChange={(value) => {
              setSelectedTests(value);
              mainOnSetHandler("test_id", value?.join(","));
            }}
            // displayCount={3}
            options={testObj}
            // allowCustomValues={true}
            // defaultValue={
            //   values?.test_id?.toString()?.split(",")?.map((item: any) => Number(item.trim())) || []}

            error={errorsTest}
            // defaultValue={testData?.split(",")?.map((item: any) => Number(item.trim())) || []}
          />
        </View>
        {/* <View>
          <Select
            name="test_id"
            label="Test"
            value={values?.test_id || ""}
            onChange={handleChange}
            options={testObj}
            placeholder="Select Test"
            error={errorsTest}
          />
        </View> */}
        {/* <View>
        <Input
          required={true}
          id="cvs"
          name="cvs"
          label="CVS"
          onChange={handleChange}
          // error={errorsEnrollFees}
          value={values?.cvs ? values?.cvs+"" : "" } 
          placeholder="Enter CVS"
        />
      </View> */}

        {/* <View>
        <Input
          type="date"
          required={true}
          id="appointment_date"
          name="appointment_date"
          onChange={handleChange}
          label="Appointment Date"
          error={errorsAppointmentDate}
          value={values?.appointment_date ? values?.appointment_date+"" : new Date().toISOString().split("T")[0]}
        />
      </View> */}

        {/* <View className="col-span-2">
        <Textarea
          id="complaint"
          required={true}
          name="complaint"
          label="Complaint"
          placeholder="Enter Complaints"
          error={errorsComplaint}
          onChange={handleChange}
          value={values?.complaint}
        />
      </View> */}
      </View>
    </React.Fragment>
  );
};
export default SectionTwo;
