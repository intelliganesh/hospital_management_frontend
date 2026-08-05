import Text from "@/components/text";
import View from "@/components/view";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import React, { useEffect, useState } from "react";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import MultiSelectWithDropDown from "@/components/MultiSelectWithDropDown";
// import Modal from "@/components/Modal";
// import MedicinesForm from "../medicinesForm/medicines";

interface SectionThreeProps {
  onSetMedicinePopup: (value: boolean) => void;
  errorsDescription: string;
  errorsExaminationOverview: string;
  errorsMedicines: string;
}

const SectionThree: React.FC<SectionThreeProps> = ({
  onSetMedicinePopup,
  errorsDescription,
  errorsExaminationOverview,
  errorsMedicines,
}) => {
  const [medicines, setMedicines] = useState<string>("");
  const examinationsDetail = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.examinations
  );
  const consultationDetailData = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData
  );
  const medicinesDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData?.medicines
  );

  const [medicinesList, setMedicinesList] = useState<string[]>([]);
  const { values, handleTipTapChange } = useForm<Consultation | null>(
    examinationsDetail
  );



  useEffect(() => {
    setMedicinesList(
      medicinesDetail?.map((item: any) => {
        return {
          id: item.id,
          value: item.id.toString(),
          label:
            item.medicine_name +
            " - " +
            item.dosage_form +
            " - " +
            item.strength +
            " - " +
            item.strength_unit,
        };
      }) || []
    );
  }, [medicinesDetail]);

  return (
    <React.Fragment>
      <View>
        <TipTapTextEditor
          name="description"
          value={values?.description}
          onChange={handleTipTapChange}
          label="Description"
          placeholder="Enter a description..."
          error={errorsDescription}
        />
      </View>
      <View>
        <TipTapTextEditor
          name="examination_overview"
          value={values?.examination_overview}
          onChange={handleTipTapChange}
          label="Examination Overview"
          placeholder="Enter examination overview..."
          error={errorsExaminationOverview}
        />
      </View>
      <View>
        <View className="w-full">
          <MultiSelectWithDropDown
            options={medicinesList || []}
            defaultValue={consultationDetailData?.consultations?.medical_id}
            // defaultItems={medicinesList
            //   ?.map((item: any) => item.label)
            //   .join(",")}
            defaultItems={
              medicinesList?.filter((item: any) =>
                consultationDetailData?.consultations?.medical_id?.includes(
                  item.value
                )
              )?.map((item: any) => item.label)?.join(",")
            }
            name="medical_id"
            label="Select Medicines"
            onChange={(val) => {
              setMedicines(val);
            }}
            buttonText="Select Medicines"
            onModel={() => {
              onSetMedicinePopup(true);
            }}
            error={errorsMedicines}
          />
        </View>
        <Text className="mt-2 text-sm text-gray-500">
          Medicine Selected: {medicines}
        </Text>
      </View>
    </React.Fragment>
  );
};

export default SectionThree;
