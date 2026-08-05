import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import View from "@/components/view";

import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
import MedicinesSection from "@/components/MedicinesSection";
import { useOptions } from "@/utils/custom-hooks/use-options";
import ProcNonProcCommonFields from "../procNonProcCommonFields";
import { useDoshaApi } from "@/actions/calls/doshaAnalysis/prakriti";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useMedicine } from "@/actions/calls/medicine";
import { useYogaAsana } from "@/actions/calls/yogaAsana";
import SingleSelector from "@/components/SingleSelector";

interface ProctologyExaminationSectionProps {
  errorsPreliminaryDiagnostic: string;
  errorsFindings: string;
  errorsExaminationOverview: string;
  errorsDocUpload: string;
  errorsDiagnosisSummary: string;
  errorsAdviceField: string;
  nonProctologyData: any;
  errorsMedicines: string;
  errorsDosage: string;
  errorsTiming: string;
}
const NonProctologyExaminationSection: React.FC<
  ProctologyExaminationSectionProps
> = ({
  errorsPreliminaryDiagnostic,
  errorsFindings,
  errorsExaminationOverview,

  errorsMedicines,
  errorsDosage,
  errorsTiming,
  nonProctologyData,
}) => {
  // const [findings, setFindings] = useState([""]);
  // const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // const [admissionAdvice, setAdmissionAdvice] = useState(false);
  // const [fees, setFees] = useState("");
  // const [finding, setFinding] = useState("");
  const findingDropdownData = useOptions("findings|findingDropdownData");
  const yogaAsanaDropdownData = useSelector(
    (state: RootState) => state.yogaAsana.yogaAsanaDropdownData
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.asana_name,
    value: item?.id,
  }));

  const { values, handleChange, handleTipTapChange, onSetHandler } =
    useForm<Consultation | null>(nonProctologyData);

  const { medicineDropdownHandler } = useMedicine();
  const { yogaAsanaDropdownHandler } = useYogaAsana();

  const medicineDropdownData = useSelector(
    (state: RootState) => state.medicines.medicineDropdownData
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.medicine_name,
    value: item?.medicine_name,
  }));

  const [prakritiData, setPrakritiData] = useState([]);
  const [vrikutiData, setVikrutiData] = useState([]);
  const [agniData, setAgniData] = useState([]);
  const [koshtaData, setKoshtaData] = useState([]);
  const [avasthaData, setAvasthaData] = useState([]);
  const consultationData = useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  );
  const { OptionsListHandler } = useDoshaApi("/prakriti");
  const { OptionsListHandler: VikrutiOptionsListHandler } =
    useDoshaApi("/vikruti");
  const { OptionsListHandler: AgniOptionsListHandler } = useDoshaApi("/agni");
  const { OptionsListHandler: KoshtaOptionsListHandler } =
    useDoshaApi("/koshta");
  const { OptionsListHandler: AvasthaOptionsListHandler } =
    useDoshaApi("/avastha");

  useEffect(() => {
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
    medicineDropdownHandler(() => {});
    yogaAsanaDropdownHandler(() => {});
  }, []);

  return (
    <View className="space-y-6">
      {/* Section 1 - Examination */}
      <Card className="mt-2 shadow-none border-none">
        <CardHeader
          style={{
            padding: "20px 0px",
          }}
        >
          <CardTitle>Non-proptology Examination</CardTitle>
        </CardHeader>
        <CardContent
          className="space-y-4"
          style={{
            padding: "10px 0px",
          }}
        >
          <ProcNonProcCommonFields
            handleChange={handleChange}
            // nonProctologyData={values?.preliminary_diagnosis ?? ""}
            nonProctologyData={
              consultationData?.proctologyOrNonProctology ?? ""
            }
            errorsPreliminaryDiagnostic={errorsPreliminaryDiagnostic}
            examinationOverviewValue={values?.examination_overview ?? ""}
            // preliminaryDiagnosticValue={values?.preliminary_diagnosis ?? ""}
            preliminaryDiagnosticValue={values?.preliminary_diagnostic ?? ""}
            defaultValue={
              Array.isArray(values?.finding_fields)
                ? values.finding_fields.join(",")
                : values?.finding_fields ?? ""
            }
            defaultItems={
              Array.isArray(values?.finding_fields)
                ? values.finding_fields.join(",")
                : values?.finding_fields ?? ""
            }
            options={findingDropdownData}
            errorsFindings={errorsFindings}
            handleTipTapChange={handleTipTapChange}
            onSetHandler={onSetHandler}
            errorsExaminationOverview={errorsExaminationOverview}
          />

          <View className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <View>
              {/* <Select
                name="prakriti"
                label="Prakriti"
                value={values?.prakriti || ""}
                onChange={handleChange}
                placeholder="Select Prakriti"
                options={prakritiData || []}
                // error={errorsStatus}
              /> */}
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
              {/* <Select
                name="vikruti"
                label="Vikruti"
                value={values?.vikruti || ""}
                placeholder="Select Vikruti"
                onChange={handleChange}
                options={vrikutiData || []}
                // error={errorsStatus}
              /> */}
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
              {/* <Select
                name="agni"
                label="Agni"
                value={values?.agni || ""}
                onChange={handleChange}
                placeholder="Select Agni"
                options={agniData || []}
                // error={errorsStatus}
              /> */}
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
              {/* <Select
                name="koshta"
                label="Koshta"
                value={values?.koshta || ""}
                placeholder="Select Koshta"
                onChange={handleChange}
                options={koshtaData || []}
                // error={errorsStatus}
              /> */}
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
              {/* <Select
                name="avastha"
                label="Avastha"
                value={values?.avastha || ""}
                placeholder="Select Avastha"
                onChange={handleChange}
                options={avasthaData || []}
                // error={errorsStatus}
              /> */}
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

          <View>
            <MedicinesSection
              errorsDosage={errorsDosage}
              errorsTiming={errorsTiming}
              medicineData={nonProctologyData}
              errorsMedicines={errorsMedicines}
              medicinesList={medicineDropdownData}
              onSetHandler={onSetHandler}
            />
          </View>

          <View>
            <CardTitle>Food and Yoga Prescription</CardTitle>

            <View className="mt-4">
              <Textarea
                id="general_advice"
                name="general_advice"
                label="General Advice"
                required={true}
                placeholder="Ex: Avoid spicy and oily food."
                // error={errorsPreliminaryDiagnosis}
                value={values?.general_advice || ""}
                onChange={handleChange}
              />
            </View>
            <View className="mt-4">
              <Textarea
                id="breakfast"
                name="breakfast"
                label="Breakfast"
                required={true}
                placeholder="Ex: Avoid spicy and oily food."
                // error={errorsPreliminaryDiagnosis}
                value={values?.breakfast ?? ""}
                onChange={handleChange}
              />
            </View>
            <View className="mt-4">
              <Textarea
                id="lunch"
                name="lunch"
                label="Lunch"
                required={true}
                placeholder="Ex: Avoid spicy and oily food."
                // error={errorsPreliminaryDiagnosis}
                value={values?.lunch ?? ""}
                onChange={handleChange}
              />
            </View>
            <View className="mt-4">
              <Textarea
                id="dinner"
                name="dinner"
                label="Dinner"
                required={true}
                placeholder="Ex: Avoid spicy and oily food."
                // error={errorsPreliminaryDiagnosis}
                value={values?.dinner ?? ""}
                onChange={handleChange}
              />
            </View>

            {/* <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <View> 
            <Select
              name="breakfast"
              label="Breakfast"
              // value={values?.breakfast || ""}
              onChange={handleChange}
              placeholder="Select Breakfast"
              options={[]}
              // error={errorsStatus}
            />
          </View>
          <View> 
            <Select
              name="lunch"
              label="Lunch"
              // value={values?.lunch || ""}
              onChange={handleChange}
              placeholder="Select Lunch"
              options={[]}
              // error={errorsStatus}
            />
          </View>
          <View> 
            <Select
              name="dinner"
              label="Dinner"
              // value={values?.dinner || ""}
              onChange={handleChange}
              placeholder="Select Dinner"
              options={[]}
              // error={errorsStatus}
            />
          </View>
          </View> */}

            <View className="mt-4">
              {/* <Select
                name="yoga_asana"
                label="Yoga Asana"
                value={values?.yoga_asana || ""}
                onChange={handleChange}
                placeholder="Select Yoga Asana"
                options={yogaAsanaDropdownData || []}
                // error={errorsStatus}
              /> */}
              <SingleSelector
                id="yoga_asana"
                label="Yoga Asana"
                name="yoga_asana"
                // error={errorsStatus}
                value={values?.yoga_asana || ""}
                placeholder="Select Yoga Asana"
                onChange={(value) => {
                  onSetHandler("yoga_asana", value);
                }}
                options={yogaAsanaDropdownData || []}
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default NonProctologyExaminationSection;
