import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import WebcamCapture from "@/components/Capture";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import { TAB_COLORS } from "../consultationFormConfig";
// import dayjs from "dayjs";
// import { useEffect } from "react";
// import View from "@/components/view";
// import Text from "@/components/text";
// import Text from "@/components/text";
// import Input from "@/components/input";
// import Button from "@/components/button";
// import Select from "@/components/Select";
// import { Card } from "@/components/ui/card";
// import Textarea from "@/components/Textarea";
// import { useOpd } from "@/actions/calls/opd";
// import { useTest } from "@/actions/calls/test";
// import WebcamCapture from "@/components/Capture";
// import SearchSelect from "@/components/SearchSelect";
// import SearchSelect from "@/components/SearchSelect";
// import TransferList from "@/components/TransferList";
// import { useMedicine } from "@/actions/calls/medicine";
// import MultiSelector from "@/components/MultiSelector";
// import { Appointment } from "@/interfaces/appointments";
// import SingleSelector from "@/components/SingleSelector";
// import { statusOptions } from "../consultationFormOptions";
// import TipTapTextEditor from "@/components/TipTapTexteditor";
// import MedicinesSection from "@/components/MedicinesSection";
// import DynamicFormSection from "@/components/DynamicFormSection";
// import MultiSelectWithDropDown from "@/components/MultiSelectWithDropDown";

interface SectionFourProps {
  // errorsTemperature: string;
  // errorsBp: string;
  // errorsPulse: string;
  // errorsCvs: string;
  // errorsRs: string;
  // errorsTest: string;
  // postExaminationData: any;
  mainOnSetHandler: (name: string, value: any) => void;
}

const SectionFive: React.FC<SectionFourProps> = ({
  // errorsTemperature,
  // errorsBp,
  // errorsPulse,
  // errorsCvs,
  // errorsRs,
  // errorsTest,
  // postExaminationData,
  mainOnSetHandler,
}) => {
  // const examinationDetails = useSelector(
  //   (state: RootState) => state.examinations.examinationDetails
  // );
  // const { values, handleChange } = useForm<Examination | null>(
  //   examinationDetails
  // );
  // const { medicineDropdownHandler } = useMedicine();

  const consultationDetail = useSelector(
    (state: RootState) =>
      state.consultation.consultationDetailData?.consultations
  );

  // const medicineDropdownData = useSelector(
  //     (state: RootState) => state.medicines.medicineDropdownData
  //   )?.map((item: any) => ({
  //     id: item?.id,
  //     label: item?.medicine_name,
  //     value: item?.medicine_name,
  //   }));

  //   useEffect(() => {
  //       medicineDropdownHandler(() => {});
  //     }, []);

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

  const { values, onSetHandler } = useForm<Consultation | null>(
    consultationDetail
  );

  

  return (
    <React.Fragment>
      <div className="border border-gray-300 dark:border-gray-600 dark:bg-background rounded-lg py-6 my-6">
        <h3 className={`text-lg font-semibold mb-4 px-6 ${TAB_COLORS.documents.textColor}`}>
          Documents
        </h3>
        <div className="border-b border-gray-300 dark:border-gray-600 mb-6" />
        <div className="px-6">
          <WebcamCapture
            name="patient_document"
            // onChange={(event: any) => {
            //   onSetHandler("patient_document", event?.target?.files[0]);
            // }}
            accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.mov,.mkv,.webm,.webp"
            multiple
            maxSize={1024 * 1024 * 15}
            existingFiles={
              Array.isArray(values?.patient_document)
                ? values.patient_document
                    .filter((f) => typeof f === "string")
                    .join(",")
                : typeof values?.patient_document === "string"
                ? values.patient_document
                : ""
            }
            label="Upload Documents & Files (Max 15MB)"
            onChange={(fileList: any) => {
              const finalList: any[] = [];

              fileList?.forEach((item: any) => {
                if (item.isExisting && item.url) {
                  // keep existing URL
                  finalList.push(item.url);
                } else if (item.file instanceof File) {
                  // add new File
                  finalList.push(item.file);
                }
              });

              // update local form
              onSetHandler("patient_document", finalList);

              // update main form (needed for submission)
              if (mainOnSetHandler) {
                mainOnSetHandler("patient_document", finalList);
              }
            }}

            // value={values?.consultation_image}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default SectionFive;
