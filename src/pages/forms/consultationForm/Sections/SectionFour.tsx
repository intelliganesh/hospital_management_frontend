import React, { useEffect } from "react";
import View from "@/components/view";
// import { Appointment } from "@/interfaces/appointments";
import useForm from "@/utils/custom-hooks/use-form";
// import Textarea from "@/components/Textarea";
// import SearchSelect from "@/components/SearchSelect";
// import { useOpd } from "@/actions/calls/opd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
// import { useEffect } from "react";
// import dayjs from "dayjs";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { Consultation } from "@/interfaces/consultation";
import TransferList from "@/components/TransferList";
// import { Card } from "@/components/ui/card";
// import Text from "@/components/text";
import { useMedicine } from "@/actions/calls/medicine";
import MedicinesSection from "@/components/MedicinesSection";
// import CombinationMedicineSection from "@/components/CombinationMedicineSection";
import { useDiet } from "@/actions/calls/diet";
import { setDietPlanModel, setTestModel } from "@/actions/slices/medicalStatus";
import { useYogaAsana } from "@/actions/calls/yogaAsana";
import { useFoodAdvice } from "@/actions/calls/foodAdvice";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import Text from "@/components/text";
import Checkbox from "@/components/CheckBox";
import { useTest } from "@/actions/calls/test";
import { TAB_COLORS } from "../consultationFormConfig";
import CombinationMedicineSection from "@/components/CombinationMedicineSection";
// import Text from "@/components/text";
// import Button from "@/components/button";

interface SectionFourProps {
  // errorsTemperature: string;
  // errorsBp: string;
  // errorsPulse: string;
  // errorsCvs: string;
  // errorsRs: string;
  // errorsTest: string;
  // postExaminationData: any;
  mainOnSetHandler: (name: string, value: any) => void;
  autoOpen: boolean;
  colorScheme?: any;
}

// eslint-disable-next-line no-empty-pattern
const SectionFour: React.FC<SectionFourProps> = ({ autoOpen, colorScheme }) => {
  // const examinationDetails = useSelector(
  //   (state: RootState) => state.examinations.examinationDetails
  // );
  // const { values, handleChange } = useForm<Examination | null>(
  //   examinationDetails
  // );
  const { medicineDropdownHandler } = useMedicine();
  const { dietDropdownHandler } = useDiet();
  const { yogaAsanaDropdownHandler } = useYogaAsana();
  const { foodAdviceDropdownHandler } = useFoodAdvice();

  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData,
  );

  const { testDropdownHandler } = useTest();
  const testDropdowndata = useSelector(
    (state: RootState) => state.test.testDropdownData,
  );

  const testObj = testDropdowndata?.map((test: any) => {
    const cleanedDesc = test?.test_description
      ? test.test_description.replace(/<[^>]+>/g, "").trim()
      : "";

    return {
      id: test?.id,
      label: test?.test_name,
      value: cleanedDesc ? `${test?.id} (${cleanedDesc})` : test?.id,
      ...(cleanedDesc ? { description: cleanedDesc } : {}),
    };
  });

  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
  };

  const dietDropdownData = useSelector(
    (state: RootState) => state.diet.dietDropdownData,
  );

  const medicineDropdownData = useSelector(
    (state: RootState) => state.medicines.medicineDropdownData,
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.medicine_name,
    value: item?.medicine_name,
  }));

  const dietDropdownObj = dietDropdownData?.map((item: any) => ({
    id: item?.id,
    label: item?.description
      ? `${item?.diet_name} (${item?.description})`
      : item?.diet_name,
    value: item?.id,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const yogaAsanaDropdownData = useSelector(
    (state: RootState) => state.yogaAsana.yogaAsanaDropdownData,
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.asana_name,
    value: item?.description ? `${item?.id} (${item?.description})` : item?.id,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const foodAdviceDropdownData = useSelector(
    (state: RootState) => state.foodAdvice.foodAdviceDropdownList,
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.advice_text,
    value: item?.description ? `${item?.id} (${item?.description})` : item?.id,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const consultationData = useSelector(
    (state: any) => state?.consultation?.consultationDetailData,
  );

  //consultationData?.consultations?.type

  // useEffect(() => {
  //   medicineDropdownHandler(() => {});
  //   dietDropdownHandler(() => {});
  // }, []);

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

  useEffect(() => {
    if (consultationData?.consultations?.type) {
      medicineDropdownHandler(
        () => {},
        ["id", "unit_price", "medicine_name"],
        // consultationData?.consultations?.type
      );
      dietDropdownHandler(() => {});
      testDropdownHandler(() => {});
      if (consultationData?.consultations?.type === "Non Proctology") {
        foodAdviceDropdownHandler(
          () => {},
          consultationData?.consultations?.type,
        );
        // yogaAsanaDropdownHandler(() => { },
        //   consultationData?.consultations?.type);
        yogaAsanaDropdownHandler(() => {});
      }
    }
  }, [consultationData?.consultations?.type]);

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

  const { values, handleTipTapChange, onSetHandler } =
    useForm<Consultation | null>(consultationDetailData);

  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <CollapsibleContainer
        title=" Test,Medicines & lifestyle"
        variant="custom"
        colorScheme={colorScheme}
        autoOpen={autoOpen}
        headerTitleClassName="!text-2xl"
      >
        {/* <View>
        <TipTapTextEditor
          name="treatment_plan"
          value={values?.treatment_plan || ""}
          onChange={handleTipTapChange}
          label="Treatment Plan"
          placeholder="Enter plan..."
        />
      </View>

      <Card className="mt-2 shadow-none border-none ">
        <Text className="text-lg font-bold pb-2 mb-2">Estimated Cost</Text>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-100 dark:bg-background rounded-lg p-4">
          <View>
            <Input
              id="amount"
              name="amount"
              label="Amount"
              onChange={handleChange}
              value={values?.amount ? values?.amount + "" : ""}
              placeholder="Enter Amount"
              className="bg-card"
            />
          </View>
          <View>
            <Input
              id="surgical_cost"
              name="surgical_cost"
              label="Surgical Cost"
              onChange={handleChange}
              value={values?.surgical_cost ? values?.surgical_cost + "" : ""}
              placeholder="Enter Surgical Cost"
              className="bg-card"
            />
          </View>
        </View>
      </Card> */}

        <View className=" rounded-lg">
          <MedicinesSection
            // errorsDosage={errorsDosage}
            // errorsTiming={errorsTiming}
            // errorsMedicines={errorsMedicines}
            medicinesList={medicineDropdownData}
            medicineData={consultationDetailData?.medicines}
            // medicineData={postExaminationData?.medicines}
            onSetHandler={onSetHandler}
          />
        </View>

        {consultationDetail?.consultations?.type === "Allopathy" ? (
          ""
        ) : (
          <View className="mt-4 rounded-lg">
            <CombinationMedicineSection
              medicinesList={medicineDropdownData}
              combinationMedicineData={
                consultationDetailData?.combination_medicines
              }
              onSetHandler={onSetHandler}
            />
          </View>
        )}

        <View className="mt-4">
          <TipTapTextEditor
            name="advice"
            value={values?.advice || ""}
            onChange={handleTipTapChange}
            label="Treatment Given"
            placeholder="Enter treatment given..."
          />
        </View>

        <View className="space-y-4 mt-12">
          <TransferList
            name="tests"
            label="Tests"
            labelClassName={TAB_COLORS.medicineLifestyle.textColor}
            sourceData={testObj}
            selectedItems={
              values?.tests
                ? Array.isArray(values?.tests)
                  ? values?.tests
                  : JSON.parse(values?.tests)
                : []
            }
            onSelectionChange={(value) => {
              onSetHandler("tests", value);
            }}
            placeholder="Search test..."
            sourceTitle=""
            selectedTitle="Selected"
            height="150px"
            searchable
            showCount={false}
            // allowSelectAll
            onAllowCustomValues={() => {
              dispatch(setTestModel(true));
            }}
            customValuePlaceholder="Add custom data"
            // allowCustomValues
            // customValuePlaceholder="Add custom test"
          />

          <View className="flex items-center space-x-2 ">
            <Checkbox
              checked={values?.test_in_same_hospital ? true : false}
              onChange={(e) => {
                onSetHandler("test_in_same_hospital", e.target.checked);
              }}
              name="test_in_same_hospital"
              id="test_in_same_hospital"
              className="rounded-md"
            />

            <Text as="label" className="text-sm font-medium">
              Tests are done in same hospital?
            </Text>
          </View>
        </View>

        {/* Diat plan  */}
        <View className="mt-12">
          <TransferList
            name="diet_plan"
            label="Diet Plan"
            labelClassName={TAB_COLORS.medicineLifestyle.textColor}
            sourceData={dietDropdownObj}
            selectedItems={
              values?.diet_plan
                ? Array.isArray(values?.diet_plan)
                  ? values?.diet_plan
                  : JSON.parse(values?.diet_plan)
                : []
            }
            onSelectionChange={(value) => {
              onSetHandler("diet_plan", value);
            }}
            onAllowCustomValues={() => {
              dispatch(setDietPlanModel(true));
            }}
            customValuePlaceholder="Add custom data"
            placeholder="Search diet plan..."
            sourceTitle=""
            selectedTitle="Selected"
            height="150px"
            searchable
            showCount={false}
            // allowSelectAll
            // allowCustomValues
            // customValuePlaceholder="Add custom diat plan"
          />
        </View>

        {consultationDetailData?.type === "Non Proctology" && (
          <>
            {/* Yoga advice  */}
            <View className="mt-12">
              <TransferList
                name="yoga_asana"
                label="Yoga Advice"
                labelClassName={TAB_COLORS.medicineLifestyle.textColor}
                sourceData={yogaAsanaDropdownData}
                selectedItems={
                  values?.yoga_asana
                    ? Array.isArray(values?.yoga_asana)
                      ? values?.yoga_asana
                      : JSON.parse(values?.yoga_asana)
                    : []
                }
                onSelectionChange={(value) => {
                  onSetHandler("yoga_asana", value);
                }}
                placeholder="Search yoga advice..."
                sourceTitle=""
                selectedTitle="Selected"
                height="150px"
                searchable
                showCount={false}
                // allowSelectAll
                // allowCustomValues
                // customValuePlaceholder="Add custom yoga advice"
              />
            </View>

            {/* food advice  */}
            <View className="mt-12">
              <TransferList
                name="food_advice"
                label="Food Advice"
                labelClassName={TAB_COLORS.medicineLifestyle.textColor}
                sourceData={foodAdviceDropdownData}
                selectedItems={
                  values?.food_advice
                    ? Array.isArray(values?.food_advice)
                      ? values?.food_advice
                      : JSON.parse(values?.food_advice)
                    : []
                }
                onSelectionChange={(value) => {
                  onSetHandler("food_advice", value);
                }}
                placeholder="Search food advice..."
                sourceTitle=""
                selectedTitle="Selected"
                height="150px"
                searchable
                showCount={false}
                // allowSelectAll
                // allowCustomValues
                // customValuePlaceholder="Add custom yoga advice"
              />
            </View>
          </>
        )}

        {/* Medicines  */}
      </CollapsibleContainer>
    </React.Fragment>
  );
};
export default SectionFour;
