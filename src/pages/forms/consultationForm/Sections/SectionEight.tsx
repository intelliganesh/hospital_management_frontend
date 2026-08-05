import React, { useEffect } from "react";
import View from "@/components/view";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import Input from "@/components/input";
import TransferList from "@/components/TransferList";
import { useManagement } from "@/actions/calls/management";
import { setManagementModel } from "@/actions/slices/medicalStatus";
import Textarea from "@/components/Textarea";
import { TAB_COLORS } from "../consultationFormConfig";

interface SectionEightProps {}

const SectionEight: React.FC<SectionEightProps> = ({}) => {
  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData
  );
  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
  };

  const managementDropdownList = useSelector(
    (state: RootState) => state.management.managementDropdownList
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.management_name,
    value: item?.description
      ? `${item?.management_name} (${item?.description})`
      : item?.management_name,
    ...(item?.description ? { description: item.description } : {}),
  }));

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetailData
  );
  const dispatch = useDispatch();
  const { managementDropdown } = useManagement();

  useEffect(() => {
    managementDropdown((_: boolean) => {}, consultationDetailData?.type);
  }, []);

  return (
    <React.Fragment>
      <View className="mt-4">
        <TransferList
          name="managements"
          label="Management"
          labelClassName={TAB_COLORS.management.textColor}
          sourceData={managementDropdownList}
          // sourceData={[
          //   { id: 1, label: "Management 1", value: "management_1" },
          //   { id: 2, label: "Management 2", value: "management_2" },
          //   { id: 3, label: "Management 3", value: "management_3" },
          //   { id: 4, label: "Management 4", value: "management_4" },
          // ]}
          selectedItems={
            values?.managements
              ? Array.isArray(values?.managements)
                ? values?.managements
                : JSON.parse(values?.managements)
              : []
          }
          onAllowCustomValues={() => {
            dispatch(setManagementModel(true));
          }}
          customValuePlaceholder="Add custom data"
          onSelectionChange={(value) => {
            onSetHandler("managements", value);
          }}
          placeholder="Search managements..."
          sourceTitle=""
          selectedTitle="Selected"
          height="150px"
          searchable
          showCount={false}
          // allowSelectAll
          // allowCustomValues
        />
      </View>
      <View className="mt-6 grid grid-cols-1 md:grid-cols-2">
        <Input
          type="date"
          id="managements_date"
          name="managements_date"
          label="Managements Date"
          value={`${values?.managements_date}` || ""}
          onChange={handleChange}
          placeholder="Enter Managements Date"
        />
      </View>

      <View className="mt-6">
        <Textarea
          id="fistula_remark"
          name="fistula_remark"
          label="Management Remarks"
          value={values?.fistula_remark || ""}
          onChange={handleChange}
          placeholder="Enter Management Remarks"
        />
      </View>

    </React.Fragment>
  );
};
export default SectionEight;
