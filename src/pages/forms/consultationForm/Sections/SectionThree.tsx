import React, { useEffect, useState } from "react";
import Input from "@/components/input";
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
import { Consultation } from "@/interfaces/consultation";
import { useTest } from "@/actions/calls/test";
import SingleSelector from "@/components/SingleSelector";
import TransferList from "@/components/TransferList";
import { useOnExamination } from "@/actions/calls/onExamination";
import { useDiagnosis } from "@/actions/calls/diagnosis";
// import Text from "@/components/text";
// import { setDiagnosisModel, setOnExaminationModel, setTestModel } from "@/actions/slices/medicalStatus";
import {
  setDreModel,
  // setDiagnosisModel,
  setOnExaminationModel,
  setProctoscopyModel,
  // setTestModel,
} from "@/actions/slices/medicalStatus";
import { useDoshaApi } from "@/actions/calls/doshaAnalysis/prakriti";
// import Checkbox from "@/components/CheckBox";
import { useDre } from "@/actions/calls/dre";
import { useProctoscopy } from "@/actions/calls/proctoscopy";
// import { GenericStatus } from "@/interfaces";
// import Button from "@/components/button";
// import { BadgePlus, X } from "lucide-react";
// import OpeningPosition from "./OpeningPosition";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import { TAB_COLORS } from "../consultationFormConfig";
import Text from "@/components/text";
import Textarea from "@/components/Textarea";
import {
  abscessOptions,
  previousScarOptions,
} from "../consultationFormOptions";
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
  autoOpen: boolean;
  colorScheme?: any;
}

const SectionThree: React.FC<SectionTwoProps> = ({
  errorsTemperature,
  errorsBp,
  errorsPulse,
  // errorsCvs,
  // errorsRs,
  // errorsTest,
  // mainOnSetHandler,
  autoOpen,
  colorScheme,
}) => {
  // const examinationDetails = useSelector(
  //   (state: RootState) => state.examinations.examinationDetails
  // );
  // const { values, handleChange } = useForm<Examination | null>(
  //   examinationDetails
  // );

  // const consultationVitalDetails = useSelector(
  //   (state: RootState) =>
  //     state.consultation.consultationDetailData?.vitals
  // );
  const [prakritiData, setPrakritiData] = useState([]);
  const [vrikutiData, setVikrutiData] = useState([]);
  const [agniData, setAgniData] = useState([]);
  const [koshtaData, setKoshtaData] = useState([]);
  const [avasthaData, setAvasthaData] = useState([]);

  // const [secondaryOpeningPosition, setSecondaryOpeningPosition] = useState([
  //   "",
  // ]);

  const { OptionsListHandler } = useDoshaApi("/prakriti");
  const { OptionsListHandler: VikrutiOptionsListHandler } =
    useDoshaApi("/vikruti");
  const { OptionsListHandler: AgniOptionsListHandler } = useDoshaApi("/agni");
  const { OptionsListHandler: KoshtaOptionsListHandler } =
    useDoshaApi("/koshta");
  const { OptionsListHandler: AvasthaOptionsListHandler } =
    useDoshaApi("/avastha");
  const consultationDetailData = useSelector(
    (state: RootState) => state.consultation.consultationDetailData,
  );
  const testData = useSelector(
    // (state: any) => state.consultation.consultationDetailData?.proctologyOrNonProctology?.test_id
    (state: any) =>
      state.consultation?.consultationDetailData?.consultations?.test_id,
  );

  const { testDropdownHandler } = useTest();
  // const testDropdowndata = useSelector(
  //   (state: RootState) => state.test.testDropdownData
  // );

  // console.log("testDropdowndata", testDropdowndata);

  useEffect(() => {
    if (consultationDetailData?.consultations?.type === "Non Proctology") {
      OptionsListHandler((data: any) => {
        setPrakritiData(data);
      });
      VikrutiOptionsListHandler((data: any) => {
        setVikrutiData(data);
      });
      AgniOptionsListHandler((data: any) => {
        setAgniData(data);
      });
      KoshtaOptionsListHandler((data: any) => {
        setKoshtaData(data);
      });
      AvasthaOptionsListHandler((data: any) => {
        setAvasthaData(data);
      });
    }
    testDropdownHandler(() => {});
  }, [consultationDetailData?.consultations?.type]);

  // const testObj = testDropdowndata?.map((test: any) => ({
  //   id: test?.id,
  //   label: test?.test_name,
  //   value: test?.id + " ( " + test?.test_description + " )",
  //   // description: test?.test_description?.replace(/<[^>]+>/g, "") || "",
  // }));

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

  const consultationDetail = {
    ...consultationDetailData?.proctologyOrNonProctology,
    ...consultationDetailData?.vitals,
    ...consultationDetailData?.consultations,
  };

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetail,
  );
  const { onExaminationDropdownHandler } = useOnExamination();
  const { diagnosisDropdownHandler } = useDiagnosis();
  const { dreDropdownHandler } = useDre();
  const { proctoscopyDropdownHandler } = useProctoscopy();
  const dispatch = useDispatch();
  const onExaminationDropdownData = useSelector(
    (state: RootState) => state.onExamination.onExaminationDropdownData,
  );

  // const diagnosisDropdownData = useSelector(
  //   (state: RootState) => state.diagnosis.diagnosisDropdownList
  // );

  const dreDropdownData = useSelector(
    (state: RootState) => state.dre.dreDropdownData,
  );
  const proctoscopysDropdownData = useSelector(
    (state: RootState) => state.proctoscopy.proctoscopyDropdownData,
  );

  const onExaminationObj = onExaminationDropdownData?.map((item: any) => ({
    id: item?.id,
    label: item?.finding,
    value: item?.id,
  }));

  // const diagnosisObj = diagnosisDropdownData?.map((item: any) => ({
  //   id: item?.id,
  //   label: item?.diagnosis_name,
  //   value: item?.id + " ( " + item?.description + " )",
  //   description: item?.description || "",
  // }));

  const dreObj = dreDropdownData?.map((item: any) => ({
    id: item?.id,
    label: item?.dre_name,
    value: item?.description
      ? `${item?.dre_name} (${item?.description})`
      : item?.dre_name,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const proctoscopysObj = proctoscopysDropdownData?.map((item: any) => ({
    id: item?.id,
    label: item?.proctoscopys_name,
    value: item?.proctoscopys_name,
  }));

  useEffect(() => {
    if (consultationDetail?.type) {
      onExaminationDropdownHandler(() => {});
      diagnosisDropdownHandler(() => {}, consultationDetail?.type);
    }
    if (
      consultationDetail?.type === "Proctology" ||
      consultationDetail?.type === "Allopathy"
    ) {
      dreDropdownHandler(() => {}, consultationDetail?.type);
      proctoscopyDropdownHandler(() => {}, consultationDetail?.type);
    }
    // onExaminationDropdownHandler(() => {});
    // diagnosisDropdownHandler(() => {});
    onSetHandler("test_id", testData);
    if (testData) {
      setSelectedTests(
        testData?.split(",")?.map((item: any) => Number(item.trim())),
      );
    }
  }, [testData, consultationDetail?.type]);

  const [, setSelectedTests] = React.useState<string[]>([]);

  return (
    <React.Fragment>
      <CollapsibleContainer
        title="Examination & Diagnosis"
        variant="custom"
        colorScheme={colorScheme}
        autoOpen={autoOpen}
        headerTitleClassName="!text-2xl"
      >
        <View className="mt-4">
          <View>
            <Text
              as="h3"
              weight="font-bold"
              className={`${TAB_COLORS.examination.textColor}`}
            >
              General Examination
            </Text>
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <View style={{ alignItems: "end" }}>
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
              </View>
              <View>
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
                  label="Temperature Unit"
                  value={
                    values?.temperature
                      ? values?.temperature?.split(" ")[1]
                      : "\u00B0C"
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
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
        </View>

        {/* Prakriti, Vikruti, Agni, Koshta, Avastha */}
        {consultationDetailData &&
          consultationDetailData?.consultations?.type === "Non Proctology" && (
            <View className="mt-12">
              <View>
                <Text
                  as="h3"
                  weight="font-bold"
                  className={`${TAB_COLORS.examination.textColor}`}
                >
                  Ayurvedic Clinical Assessment
                </Text>
              </View>
              <View className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-4">
                <View>
                  <SingleSelector
                    id="prakriti"
                    label="Prakriti"
                    name="prakriti"
                    // error={errorsStatus}
                    value={values?.prakriti || ""}
                    placeholder="Select Prakriti"
                    onChange={(value) => {
                      onSetHandler("prakriti", value);
                    }}
                    options={prakritiData || []}
                  />
                </View>
                <View>
                  <SingleSelector
                    id="vikruti"
                    label="Vikruti"
                    name="vikruti"
                    // error={errorsStatus}
                    value={values?.vikruti || ""}
                    placeholder="Select Vikruti"
                    onChange={(value) => {
                      onSetHandler("vikruti", value);
                    }}
                    options={vrikutiData || []}
                  />
                </View>
                <View>
                  <SingleSelector
                    id="agni"
                    label="Agni"
                    name="agni"
                    // error={errorsStatus}
                    value={values?.agni || ""}
                    placeholder="Select Agni"
                    onChange={(value) => {
                      onSetHandler("agni", value);
                    }}
                    options={agniData || []}
                  />
                </View>
                <View>
                  <SingleSelector
                    id="koshta"
                    label="Koshta"
                    name="koshta"
                    // error={errorsStatus}
                    value={values?.koshta || ""}
                    placeholder="Select Koshta"
                    onChange={(value) => {
                      onSetHandler("koshta", value);
                    }}
                    options={koshtaData || []}
                  />
                </View>
                <View>
                  <SingleSelector
                    id="avastha"
                    label="Avastha"
                    name="avastha"
                    // error={errorsStatus}
                    value={values?.avastha || ""}
                    placeholder="Select Avastha"
                    onChange={(value) => {
                      onSetHandler("avastha", value);
                    }}
                    options={avasthaData || []}
                  />
                </View>
              </View>
            </View>
          )}

        {/* On Examination transfer list */}
        <View className="mt-12">
          <TransferList
            name="on_examination"
            label="Local Examination"
            labelClassName={TAB_COLORS.examination.textColor}
            sourceData={onExaminationObj}
            selectedItems={
              values?.on_examination
                ? Array.isArray(values?.on_examination)
                  ? values?.on_examination
                  : JSON.parse(values?.on_examination)
                : []
            }
            onAllowCustomValues={() => {
              dispatch(setOnExaminationModel(true));
            }}
            customValuePlaceholder="Add custom data"
            onSelectionChange={(value) => {
              onSetHandler("on_examination", value);
            }}
            placeholder="Search on examination..."
            sourceTitle=""
            selectedTitle="Selected"
            height="150px"
            searchable
            showCount={false}
            // allowSelectAll
            // allowCustomValues
            // customValuePlaceholder="Add custom on examination"
          />

          {/* {consultationDetailData &&
            consultationDetailData?.consultations?.type === "Proctology" && (
              <View className="mt-6">
                <View
                  className={`grid ${
                    values?.previous_scar === "Yes"
                      ? " grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  } gap-4 mb-2`}
                >
                  <View>
                    <SingleSelector
                      id="previous_scar"
                      label="Previous Scar?"
                      name="previous_scar"
                      value={values?.previous_scar || ""}
                      placeholder="Select Previous Scar"
                      onChange={(value) => {
                        onSetHandler("previous_scar", value);
                      }}
                      options={previousScarOptions}
                    />
                  </View>
                  <View>
                    {values?.previous_scar === "Yes" && (
                      <Input
                        id="previous_scar_position"
                        name="previous_scar_position"
                        label="Previous Scar Position"
                        onChange={handleChange}
                        value={values?.previous_scar_position || ""}
                        placeholder="Enter Previous Scar Position"
                      />
                    )}
                  </View>
                </View>
                <View
                  className={`grid ${
                    values?.abscess === "Yes"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  } gap-4`}
                >
                  <View>
                    <SingleSelector
                      id="abscess"
                      label="Abscess?"
                      name="abscess"
                      value={values?.abscess || ""}
                      placeholder="Select Abscess"
                      onChange={(value) => {
                        onSetHandler("abscess", value);
                      }}
                      options={abscessOptions}
                    />
                  </View>
                  <View>
                    {values?.abscess === "Yes" && (
                      <Input
                        id="abscess_position"
                        name="abscess_position"
                        label="Abscess Position"
                        onChange={handleChange}
                        value={values?.abscess_position || ""}
                        placeholder="Enter Abscess Position"
                      />
                    )}
                  </View>
                </View>
              </View>
            )} */}
          {/* Opening Position */}
          {/* {consultationDetailData &&
            consultationDetailData?.consultations?.type === "Proctology" && (
              <OpeningPosition position={position} />
            )} */}

          {/* {secondaryOpeningPosition.map((_, index) => (
          <View className="mt-4 border p-2 rounded" key={index}>
            <View className="flex justify-end items-center gap-8">
              <Button type="button">
                <X size={16} />
              </Button>
              <Button
                type="button"
                onPress={() => {
                  setSecondaryOpeningPosition((prev: any) => {
                    return [
                      ...prev,
                      {
                        secondary_anal_valve: "",
                        secondary_opening_position: "",
                      },
                    ];
                  });
                }}
              >
                <BadgePlus size={16} />
              </Button>
            </View>
            <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <View className="flex flex-col gap-4">
                <Input
                  name="secondary_opening_position"
                  label="Secondary Opening Position"
                  value={
                    values?.secondary_opening_position
                      ? values?.secondary_opening_position?.split(" ")[0]
                      : ""
                  }
                  onChange={(value: any) => {
                    onSetHandler(
                      "secondary_opening_position",
                      value.target.value
                    );
                  }}
                  placeholder="Ex: 6"
                />
                <Input
                  //  name = 'position'
                  // label="Position suffixed with"
                  value={position}
                  readOnly={true}
                />
              </View>
              <View>
                <Input
                  name="secondary_anal_valve"
                  label="Secondary Anal Valve"
                  value={
                    values?.secondary_anal_valve
                      ? values?.secondary_anal_valve?.split(" ")[0]
                      : ""
                  }
                  onChange={(value: any) => {
                    onSetHandler("secondary_anal_valve", value.target.value);
                  }}
                  placeholder="Ex: 6"
                />
              </View>
            </View>
          </View>
        ))} */}
        </View>

        <View className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <View
            className={`grid ${
              values?.previous_scar === "Yes"
                ? " grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            } gap-4 mb-2`}
          >
            <View>
              <SingleSelector
                id="previous_scar"
                label="Previous Scar?"
                name="previous_scar"
                value={values?.previous_scar || ""}
                placeholder="Select Previous Scar"
                onChange={(value) => {
                  onSetHandler("previous_scar", value);
                }}
                options={previousScarOptions}
              />
            </View>
            {values?.previous_scar === "Yes" && (
              <View className="flex flex-col gap-2">
                <label
                  htmlFor="previous_scar_position"
                  className="text-sm font-medium"
                >
                  Previous Scar Position
                </label>
                <View className="flex items-center border rounded-md">
                  <Input
                    id="previous_scar_position"
                    name="previous_scar_position"
                    onChange={(e) => {
                      onSetHandler("previous_scar_position", e.target.value);
                    }}
                    value={
                      values?.previous_scar_position
                        ? values?.previous_scar_position?.split(" ")[0]
                        : ""
                    }
                    placeholder="Enter Previous Scar Position"
                    className="flex-1 px-3 py-2 outline-none border-none"
                  />
                  <span className="px-3 py-2 bg-gray-100 border-l">
                    o'clock
                  </span>
                </View>
              </View>
            )}
          </View>
          <View
            className={`grid ${
              values?.abscess === "Yes"
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            } gap-4`}
          >
            <View>
              <SingleSelector
                id="abscess"
                label="Abscess?"
                name="abscess"
                value={values?.abscess || ""}
                placeholder="Select Abscess"
                onChange={(value) => {
                  onSetHandler("abscess", value);
                }}
                options={abscessOptions}
              />
            </View>
            {values?.abscess === "Yes" && (
              <View className="flex flex-col gap-2">
                <label
                  htmlFor="posterior_fistulous_angle"
                  className="text-sm font-medium"
                >
                  Abscess Position
                </label>
                <View className="flex items-center border rounded-md">
                  <Input
                    id="abscess_position"
                    name="abscess_position"
                    // label="Abscess Position"
                    onChange={(e) => {
                      onSetHandler("abscess_position", e.target.value);
                    }}
                    value={
                      values?.abscess_position
                        ? values?.abscess_position?.split(" ")[0]
                        : ""
                    }
                    placeholder="Enter Abscess Position"
                    className="flex-1 px-3 py-2 outline-none border-none"
                  />
                  <span className="px-3 py-2 bg-gray-100 border-l">
                    o'clock
                  </span>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* DRE  */}
        {consultationDetailData &&
          (consultationDetailData?.consultations?.type === "Proctology" ) && (
            <>
              <View className="mt-12">
                <TransferList
                  name="dre"
                  label="DRE"
                  labelClassName={TAB_COLORS.examination.textColor}
                  sourceData={dreObj}
                  selectedItems={
                    values?.dre
                      ? Array.isArray(values?.dre)
                        ? values?.dre
                        : JSON.parse(values?.dre)
                      : []
                  }
                  onAllowCustomValues={() => {
                    dispatch(setDreModel(true));
                  }}
                  customValuePlaceholder="Add custom data"
                  onSelectionChange={(value) => {
                    onSetHandler("dre", value);
                  }}
                  placeholder="Search DRE..."
                  sourceTitle=""
                  selectedTitle="Selected"
                  height="150px"
                  searchable
                  showCount={false}
                  // allowSelectAll
                  // allowCustomValues
                  // customValuePlaceholder="Add custom dre"
                />

                {/* <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"> */}

                {/* Induration at field  */}
                <View className="mt-4">
                  {/* <TransferList
                  name="dre_induration_at"
                  label="DRE Induration at"
                  sourceData={[
                    { id: 1, label: "3 o'clock", value: "3 o'clock" },
                    { id: 2, label: "7 o'clock", value: "7 o'clock" },
                    { id: 3, label: "11 o'clock", value: "11 o'clock" },
                    {
                      id: 4,
                      label: "Secondary positions",
                      value: "secondary positions",
                    },
                  ]}
                  selectedItems={
                    values?.dre_induration_at
                      ? Array.isArray(values?.dre_induration_at)
                        ? values?.dre_induration_at || []
                        : JSON.parse(values?.dre_induration_at)
                      : []
                  }
                  onSelectionChange={(value) => {
                    onSetHandler("dre_induration_at", value);
                  }}
                  placeholder="Search Induration at..."
                  sourceTitle="Available Induration at"
                  selectedTitle="Selected Induration at"
                  height="150px"
                  searchable
                  showCount
                  allowSelectAll
                  
                /> */}

                  {/* </View> */}

                  <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <View className="flex flex-col gap-2">
                      <label
                        htmlFor="dre_induration_at"
                        className="text-sm font-medium"
                      >
                        DRE Induration at
                      </label>
                      <View className="flex items-center border rounded-md">
                        <Input
                          name="dre_induration_at"
                          // label="DRE Induration at"
                          value={
                            values?.dre_induration_at
                              ? values?.dre_induration_at?.split(" ")[0]
                              : ""
                          }
                          onChange={(value: any) => {
                            onSetHandler(
                              "dre_induration_at",
                              value.target.value,
                            );
                          }}
                          placeholder="Ex: 3"
                          className="flex-1 px-3 py-2 outline-none border-none"
                        />
                        <span className="px-3 py-2 bg-gray-100 border-l">
                          o'clock
                        </span>
                      </View>
                    </View>
                    {/* <View>
                      <Input
                        //  name = 'position'
                        label="Position suffixed with"
                        value={position}
                        readOnly={true}
                      />
                    </View> */}
                  </View>
                </View>
              </View>

              {/* proctoscopy */}
              <View className="mt-12">
                <TransferList
                  name="proctoscopy"
                  label="Proctoscopy"
                  labelClassName={TAB_COLORS.examination.textColor}
                  sourceData={proctoscopysObj}
                  selectedItems={
                    values?.proctoscopy
                      ? Array.isArray(values?.proctoscopy)
                        ? values?.proctoscopy
                        : JSON.parse(values?.proctoscopy)
                      : []
                  }
                  onAllowCustomValues={() => {
                    dispatch(setProctoscopyModel(true));
                  }}
                  customValuePlaceholder="Add custom data"
                  onSelectionChange={(value) => {
                    onSetHandler("proctoscopy", value);
                  }}
                  placeholder="Search proctoscopy..."
                  sourceTitle=""
                  selectedTitle="Selected"
                  height="150px"
                  searchable
                  showCount={false}
                  // allowSelectAll
                  // allowCustomValues
                  // customValuePlaceholder="Add custom proctoscopy"
                />

                <View className="mt-4">
                  {/* secondary position  */}
                  <View className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <View className="flex flex-col gap-2">
                      <label
                        htmlFor="proctoscopy_secondary_position"
                        className="text-sm font-medium"
                      >
                        Proctoscopy Secondary Position
                      </label>
                      <View className="flex items-center border rounded-md">
                        <Input
                          name="proctoscopy_secondary_position"
                          // label="Proctoscopy Secondary Position"
                          value={
                            values?.proctoscopy_secondary_position
                              ? values?.proctoscopy_secondary_position?.split(
                                  " ",
                                )[0]
                              : ""
                          }
                          onChange={(value: any) => {
                            onSetHandler(
                              "proctoscopy_secondary_position",
                              value.target.value,
                            );
                          }}
                          placeholder="Ex: 6"
                          className="flex-1 px-3 py-2 outline-none border-none"
                        />
                        <span className="px-3 py-2 bg-gray-100 border-l">
                          o'clock
                        </span>
                      </View>
                    </View> */}
                    {/* <View>
                      <Input
                        //  name = 'position'
                        label="Position suffixed with"
                        value={position}
                        readOnly={true}
                      />
                    </View> */}

                    <View className="flex flex-col gap-2">
                      <label
                        htmlFor="proctoscopy_anal_polyp_at"
                        className="text-sm font-medium"
                      >
                        Anal Polyp at
                      </label>
                      <View className="flex items-center border rounded-md">
                        <Input
                          name="proctoscopy_anal_polyp_at"
                          // label="Anal Polyp at"
                          value={
                            values?.proctoscopy_anal_polyp_at
                              ? values?.proctoscopy_anal_polyp_at?.split(" ")[0]
                              : ""
                          }
                          onChange={(value: any) => {
                            onSetHandler(
                              "proctoscopy_anal_polyp_at",
                              value.target.value,
                            );
                          }}
                          placeholder="Ex: 9"
                          className="flex-1 px-3 py-2 outline-none border-none"
                        />
                        <span className="px-3 py-2 bg-gray-100 border-l">
                          o'clock
                        </span>
                      </View>
                    </View>
                    {/* <View>
                      <Input
                        //  name = 'position'
                        label="Position suffixed with"
                        value={position}
                        readOnly={true}
                      />
                    </View> */}
                  </View>
                </View>
              </View>

              <View></View>
            </>
          )}

        <View className="mt-12">
          <Text
            as="h3"
            weight="font-bold"
            className={TAB_COLORS.examination.textColor + " mb-2"}
            // label="Diagnosis"
            // labelClassName={TAB_COLORS.examination.textColor}
          >
            Diagnosis
          </Text>
          <Textarea
            name="diagnosis_summary"
            labelClassName={TAB_COLORS.examination.textColor}
            value={values?.diagnosis_summary ? values?.diagnosis_summary : ""}
            onChange={(value: any) => {
              onSetHandler("diagnosis_summary", value.target.value);
            }}
            placeholder="Enter diagnosis here"
          />
        </View>
        {/* Diagnosis  */}
        {/* <View>
        <TransferList
          name="preliminary_diagnosis"
          label="Preliminary Diagnosis"
          sourceData={diagnosisObj}
          selectedItems={
           values?.preliminary_diagnosis ? Array.isArray(values?.preliminary_diagnosis)
                ? values?.preliminary_diagnosis
                : JSON.parse(values?.preliminary_diagnosis)
              : []
          }
          onSelectionChange={(value) => {
            onSetHandler("preliminary_diagnosis", value);
          }}
          onAllowCustomValues={() => {
            dispatch(setDiagnosisModel(true));
          }}
          customValuePlaceholder="Add custom data"
          placeholder="Search diagnosis..."
          sourceTitle="Available Diagnosis"
          selectedTitle="Selected Diagnosis"
          height="150px"
          searchable
          showCount
          // allowSelectAll
          // allowCustomValues
          // customValuePlaceholder="Add custom diagnosis"
        />

        
        
      </View> */}

        {/* <View className="space-y-4 mt-4">
          <TransferList
            name="tests"
            label="tests"
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
            sourceTitle="Available Test"
            selectedTitle="Selected Test"
            height="150px"
            searchable
            showCount
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
        </View> */}
        {/* </View> */}

        {/* Test  */}

        {/* <View className="grid grid-cols-1   gap-6">
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
          <MultiSelector
            name="test_id"
            label="Test"
            value={selectedTests.length > 0 ? selectedTests :  []}
            onChange={(value) => {
              setSelectedTests(value);
              mainOnSetHandler("test_id", value?.join(","));
            }} 
            multiSelect={true}
            showSelectAll={true}
            options={testObj}
            error={errorsTest}
          />

        </View>
        
      </View> */}
      </CollapsibleContainer>
    </React.Fragment>
  );
};
export default SectionThree;
