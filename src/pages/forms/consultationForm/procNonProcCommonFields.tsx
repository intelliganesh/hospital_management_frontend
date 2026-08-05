import { useFindings } from "@/actions/calls/findings";
import MultiSelectWithDropDown from "@/components/MultiSelectWithDropDown";
import Textarea from "@/components/Textarea";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import View from "@/components/view";
import React, { useEffect } from "react";

const ProcNonProcCommonFields: React.FC<{
  nonProctologyData: any;
  handleChange: (e: any) => void;
  errorsPreliminaryDiagnostic: string;
  preliminaryDiagnosticValue: string;
  defaultValue: string;
  onSetHandler: (name: string, value: any) => void;
  defaultItems: string;
  options: any[];
  errorsFindings: string;
  handleTipTapChange: (value: string, name: string) => void;
  errorsExaminationOverview: string;
  examinationOverviewValue: string;
}> = ({
  nonProctologyData,
  handleChange,
  errorsPreliminaryDiagnostic,
  defaultValue,
  onSetHandler,
  options,
  errorsFindings,
  handleTipTapChange,
  preliminaryDiagnosticValue,
  errorsExaminationOverview,
}) => {
  const { findingDropdownHandler } = useFindings();
  // const [findingValuesObjects, setFindingValuesObjects] = React.useState<any[]>([]);

  useEffect(() => {
    findingDropdownHandler(() => {});

  }, []);
  // useEffect(() => {
  //   findingDropdownHandler(() => {});
    
  //   if (nonProctologyData?.finding_fields) {
  //     console.log("hi");
      
  //     setFindingValuesObjects(nonProctologyData?.finding_fields?.split(",") || []);
  //   }
  // }, [nonProctologyData?.finding_fields]);
  return (
    <React.Fragment>
      <View>
        <View className="col-span-2">
          <Textarea
            required={true}
            onChange={handleChange}
            id="preliminary_diagnostic"
            name="preliminary_diagnostic"
            label="Preliminary Diagnostic"
            error={errorsPreliminaryDiagnostic}
            placeholder="Preliminary Diagnostic"
            value={preliminaryDiagnosticValue}
            // value={nonProctologyData?.preliminary_diagnostic ?? ""}
          />
        </View>
      </View>

      <View>
        <MultiSelectWithDropDown
          name="finding_fields"
          label="Findings"
          defaultValue={defaultValue}
          // defaultItems={defaultItems}
          defaultItems={nonProctologyData?.finding_fields}
          // value={nonProctologyData?.finding_fields}
          onChange={(value) => {
            // console.log("value", value); 
            onSetHandler("finding_fields", value);
          }}
          placeholder="Select Findings"
          options={options}
          error={errorsFindings}
        />
        {/* <MultiSelector
          name="finding_fields"
          label="Findings"
          value={findingValuesObjects.length > 0 ? findingValuesObjects : nonProctologyData?.finding_fields ? nonProctologyData?.finding_fields?.toString()?.split(",")?.map((item: any) => item.trim()) : []}
          onChange={(value: any[]) => {
            // console.log("value", value);
            setFindingValuesObjects(value);
            onSetHandler("finding_fields", value);
          }}
          allowCustomValues={true}
          options={options}
          error={errorsFindings}
        /> */}
        {/* <MultiSelector
  name="finding_fields"
  label="Findings"
  value={
    findingValuesObjects.map(obj => typeof obj === "string" ? obj : obj.value)
  }
  onChange={(value: any[]) => {
    setFindingValuesObjects(value);
    onSetHandler("finding_fields", value);
  }}
  allowCustomValues={true}
  options={options}
  error={errorsFindings}
/> */}

      </View>

      <View>
        <View>
          <TipTapTextEditor
            name="examination_overview"
            // value={examinationOverviewValue}
            value={nonProctologyData?.examination_overview}
            onChange={handleTipTapChange}
            label="Examination Overview"
            placeholder="Enter examination overview..."
            error={errorsExaminationOverview}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

export default ProcNonProcCommonFields;
