import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import View from "@/components/view";
// import Text from "@/components/text";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
// import SingleSelector from "@/components/SingleSelector";
import TransferList, { TransferListItem } from "@/components/TransferList";
import { useChiefComplaint } from "@/actions/calls/chiefComplaints";
import { useSurgicalHistory } from "@/actions/calls/surgicalHistory";
import { useComorbidity } from "@/actions/calls/comorbidities";
import Textarea from "@/components/Textarea";
import {
  setChiefComplaintModel,
  setComorbiditiesModel,
  setSurgicalHistoryModel,
} from "@/actions/slices/medicalStatus";
import CollapsibleContainer from "@/components/CollapsibleContainer";
import { TAB_COLORS } from "../consultationFormConfig";
// import Input from "@/components/input";

interface SectionTwoProps {
  mainOnSetHandler: (name: string, value: any) => void;
  autoOpen: boolean;
  colorScheme?: any;
}

// const SectionTwo: React.FC<SectionTwoProps> = ({ mainOnSetHandler }) => {
const SectionTwo: React.FC<SectionTwoProps> = ({ colorScheme }) => {
  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData
  );

  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
    // co_morbidities: consultationDetail?.consultationComorbidities?.map((item: any) => ({
    //   id: item?.comorbidities_id,
    //   label: item?.name,
    //   value: item?.name,
    // })),
    // co_morbidities_data: consultationDetail?.consultationComorbidities,
  };

  const dispatch = useDispatch();

  // if (!consultationDetail) {
  //   consultationDetail = {};
  // }

  // consultationDetail = {
  //   ...consultationDetail,
  //   complaint_name: JSON.parse(consultationDetail?.complaint_name) || [],
  //   surgical_history: JSON.parse(consultationDetail?.surgical_history) || [],
  //   // co_morbidities: consultationDetail?.co_morbidities || [],
  // };
  const { values, onSetHandler } = useForm<Consultation | null>(
    consultationDetailData
  );
  const { chiefComplaintDropdownHandler } = useChiefComplaint();
  const { surgicalHistoryDropdownHandler } = useSurgicalHistory();
  const { comorbidityDropdownHandler } = useComorbidity();

  const chiefComplaintData = useSelector(
    (state: RootState) => state.chiefComplaint.chiefComplaintDropdownData
  );

  const surgicalHistoryData = useSelector(
    (state: RootState) => state.surgicalHistory.surgicalHistoryDropdownData
  );

  const comorbidityData = useSelector(
    (state: RootState) => state.comorbidities.comorbidityDropdown
  );

  const chiefComplaintObj = chiefComplaintData?.map((item: any) => ({
    id: item?.id,
    label: item?.complaint_name,
    value: item?.description
      ? `${item?.complaint_name} (${item?.description})`
      : item?.complaint_name,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const surgicalHistoryObj = surgicalHistoryData?.map((item: any) => ({
    id: item?.id,
    label: item?.surgery_name,
    value: item?.description
      ? `${item?.surgery_name} (${item?.description})`
      : item?.surgery_name,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const comorbidityObj = comorbidityData
    ? comorbidityData?.map((item: any) => ({
        id: item?.id,
        label: item?.name,
        value: item?.description
          ? `${item?.name} (${item?.description})`
          : item?.name,
        ...(item?.description ? { description: item.description } : {}),
      }))
    : [];

  useEffect(() => {
    if (consultationDetailData?.type) {
      chiefComplaintDropdownHandler(() => {});
      surgicalHistoryDropdownHandler(() => {});
      comorbidityDropdownHandler(() => {});
    }
    // chiefComplaintDropdownHandler(() => {});
    // surgicalHistoryDropdownHandler(() => {});
    // comorbidityDropdownHandler(() => {});
  }, [consultationDetailData?.type]);

  return (
    <>
      <CollapsibleContainer
        title="Clinical History"
        variant="custom"
        colorScheme={colorScheme}
        defaultOpen={true}
        containerClassName="mt-16"
        headerTitleClassName="!text-2xl"
        // autoOpen={autoOpen}
      >
        <Card className="mt-2 shadow-none border-none ">
          {/* chief complaints */}
          <View>
            <TransferList
              name="chief_complaints"
              label="Chief Complaints"
              labelClassName={TAB_COLORS.patientDetails.textColor}
              sourceData={chiefComplaintObj}
              selectedItems={
                values?.chief_complaints
                  ? Array.isArray(values?.chief_complaints)
                    ? values?.chief_complaints
                    : JSON.parse(values?.chief_complaints)
                  : []
              }
              onSelectionChange={(value: TransferListItem[]) => {
                onSetHandler("chief_complaints", value);
              }}
              placeholder="Search complaints..."
              sourceTitle=""
              selectedTitle="Selected"
              height="150px"
              searchable
              showCount={false}
              // allowSelectAll
              // allowCustomValues
              onAllowCustomValues={() => {
                dispatch(setChiefComplaintModel(true));
              }}
              customValuePlaceholder="Add custom data"
            />
          </View>

          {/* surgical history  */}
          <View className="mt-12">
            <TransferList
              name="surgical_history"
              label="Surgical History"
              labelClassName={TAB_COLORS.patientDetails.textColor}
              sourceData={surgicalHistoryObj}
              selectedItems={
                values?.surgical_history
                  ? Array.isArray(values?.surgical_history)
                    ? values?.surgical_history
                    : JSON.parse(values?.surgical_history)
                  : []
              }
              onSelectionChange={(value) => {
                onSetHandler("surgical_history", value);
              }}
              placeholder="Search surgical history..."
              sourceTitle=""
              selectedTitle="Selected"
              height="150px"
              searchable
              showCount={false}
              // allowSelectAll
              onAllowCustomValues={() => {
                dispatch(setSurgicalHistoryModel(true));
              }}
              customValuePlaceholder="Add custom data"
            />
          </View>

          {/* Co-morbidities */}
          <View className="mt-12">
            <TransferList
              name="co_morbidities"
              label="Co-morbidities"
              labelClassName={TAB_COLORS.patientDetails.textColor}
              sourceData={comorbidityObj}
              selectedItems={
                values?.co_morbidities
                  ? Array.isArray(values?.co_morbidities)
                    ? values?.co_morbidities
                    : JSON.parse(values?.co_morbidities)
                  : []
              }
              onAllowCustomValues={() => {
                dispatch(setComorbiditiesModel(true));
              }}
              customValuePlaceholder="Add custom data"
              onSelectionChange={(value) => {
                onSetHandler("co_morbidities", value);
                // Initialize co_morbidities_data when co_morbidities changes
                // const newCoMorbiditiesData = value.map((item) => {
                //   // Check if this item already exists in co_morbidities_data
                //   const existingData = values?.co_morbidities_data?.find(
                //     (data: any) => data?.comorbidities_id === item.id
                //   );

                //   return (
                //     existingData || {
                //       name: item.label, // Use the label as name
                //       description: "",
                //       is_chronic: false,
                //       consultation_id: values?.id || "", // Assuming consultation ID is available
                //       comorbidities_id: item.id,
                //     }
                //   );
                // });

                // console.log("newCoMorbiditiesData", newCoMorbiditiesData);

                // onSetHandler("co_morbidities_data", newCoMorbiditiesData);
              }}
              placeholder="Search co-morbidities..."
              sourceTitle=""
              selectedTitle="Selected"
              height="150px"
              // maxSelections={6}
              searchable
              showCount={false}
              // allowSelectAll
              // allowCustomValues
              // customValuePlaceholder="Add custom co-morbidity"
            />
          </View>

          {/* <Input type="text" name="co_morbidities_data" hidden value={JSON.stringify(values?.co_morbidities_data)} /> */}

          {/* {
            values?.co_morbidities ? (
                <>
                  {values?.co_morbidities.map((item: any) => (
                    <View key={item?.id}>
                      <Card className="mt-2 !bg-background p-4">
                         <View>
                            <Text as="h3" weight="font-bold" className=" pb-2 mb-2">
                              {item?.label}
                            </Text>
                            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <View>
                              <SingleSelector 
                              id={item?.id}
                              name={item?.id}
                              label="Is Chronic"
                              value={isChronic || false}
                              placeholder="Select Is Chronic"
                              onChange={(value) => {
                                onSetHandler("is_chronic", value);
                              }}
                              options={[
                                { label: "Yes", value: true },
                                { label: "No", value: false },
                              ]}
                            />
                            </View>
                            <View className="col-span-2">
                                <Textarea
                                id={item?.id}
                                // name={item?.id}
                                label="Description"
                                onChange={handleChange}
                                value={description || ""}
                                placeholder="Enter Description"
                              />
                            </View>
                            </View>
                         </View>
                      </Card>
                    </View>
                  ))}
                </>
            ) : null
          } */}

          {/* Co-morbidities Data Input Fields */}
          {values?.co_morbidities && (
            <>
              {/* <Card className="mt-2 !bg-background p-4"> */}
              <View className="mt-6">
                <Textarea
                  id={`co_morbidities_description`}
                  name={`co_morbidities_description`}
                  label="Co-morbidities Description"
                  onChange={(e) =>
                    onSetHandler("co_morbidities_description", e.target.value)
                  }
                  value={values?.co_morbidities_description || ""}
                  placeholder="Enter Description"
                />
              </View>
              {/* </Card> */}
            </>
          )}
          {/* {values?.co_morbidities && (Array.isArray(values?.co_morbidities) ? values?.co_morbidities : JSON.parse(values?.co_morbidities))?.map((item: any) => {
  const comorbidityData:any = values?.co_morbidities_data?.find(
    (data: any) => data.comorbidities_id === item.id
  );

  
  return (
    <View key={item?.id}>
      <Card className="mt-2 !bg-background p-4">
        <View>
          <Text as="h3" weight="font-bold" className="pb-2 mb-2">
            {item?.label}
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <View>
              <SingleSelector 
                id={`is_chronic_${item?.id}`}
                // name={`is_chronic_${item?.id}`}
                label="Is Chronic"
                value={ comorbidityData?.is_chronic === 1 ? "Yes" :  "No" }
                placeholder="Select Is Chronic"
                onChange={(value) => {
                  // Update the specific co-morbidity data
                  const updatedData: any[] = [...(values?.co_morbidities_data || [])];
                  const dataIndex = updatedData.findIndex(
                    (data: any) => data.comorbidities_id === item.id
                  );
                  
                  if (dataIndex !== -1) {
                    updatedData[dataIndex] = {
                      ...updatedData[dataIndex],
                      is_chronic: value
                    };
                    // handleDynamicFieldSections(updatedData);
                    mainOnSetHandler("co_morbidities_data", updatedData);
                    onSetHandler("co_morbidities_data", updatedData);
                  }
                }}
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
              />
            </View>
            <View className="col-span-2">
              <Textarea
                id={`description_${item?.id}`}
                name={`description_${item?.id}`}
                label="Description"
                onChange={(e) => {
                  // Update the specific co-morbidity data
                  const updatedData: any [] = [...(values?.co_morbidities_data || [])];
                  const dataIndex = updatedData.findIndex(
                    (data: any) => data.comorbidities_id === item.id
                  );
                  
                  if (dataIndex !== -1) {
                    updatedData[dataIndex] = {
                      ...updatedData[dataIndex],
                      description: e.target.value
                    };
                    mainOnSetHandler("co_morbidities_data", updatedData);
                   onSetHandler("co_morbidities_data", updatedData);
                  }
                }}
                value={comorbidityData?.description || ""}
                placeholder="Enter Description"
              />
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
})} */}
        </Card>
      </CollapsibleContainer>
    </>
  );
};

export default SectionTwo;
