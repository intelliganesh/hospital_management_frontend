import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import View from "@/components/view";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";
import { useFindings } from "@/actions/calls/findings";
import { useSelector } from "react-redux";
import { useOptions } from "@/utils/custom-hooks/use-options";
import ProcNonProcCommonFields from "../procNonProcCommonFields";

interface ProctologyExaminationSectionProps {
  errorsPreliminaryDiagnostic: string;
  errorsFindings: string;
  errorsExaminationOverview: string;
  errorsDocUpload: string;
  errorsDiagnosisSummary: string;
  errorsAdviceField: string;
  mainOnSetHandler?: (name: string, value: any) => void;
}

const ProctologyExaminationSection: React.FC<
  ProctologyExaminationSectionProps
> = ({
  errorsPreliminaryDiagnostic,
  errorsFindings,
  errorsExaminationOverview,
  errorsDocUpload,
  errorsDiagnosisSummary,
  errorsAdviceField,
  mainOnSetHandler,
}) => {
  const findingDropdownData = useOptions("findings|findingDropdownData");

  const consultationData = useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  );

  const { values, handleChange, handleTipTapChange, onSetHandler } =
    useForm<Consultation | null>(consultationData?.proctologyOrNonProctology);

  const { findingDropdownHandler } = useFindings();

  useEffect(() => {
    findingDropdownHandler(() => {});
  }, []);

  return (
    <View className="space-y-6">
      {/* Section 1 - Examination */}
      <Card className="mt-2 shadow-none border-none" style={{boxShadow: "none"}}>
        <CardHeader
          style={{
            padding: "20px 0px",
          }}
        >
          <CardTitle>Proctology Examination</CardTitle>
        </CardHeader>
        <CardContent
          className="space-y-4"
          style={{
            padding: "0px",
          }}
        >
          <ProcNonProcCommonFields
            onSetHandler={onSetHandler}
            handleChange={handleChange}
            options={findingDropdownData}
            errorsFindings={errorsFindings}
            handleTipTapChange={handleTipTapChange}
            errorsExaminationOverview={errorsExaminationOverview}
            errorsPreliminaryDiagnostic={errorsPreliminaryDiagnostic}
            examinationOverviewValue={values?.examination_overview ?? ""}
            nonProctologyData={consultationData?.proctologyOrNonProctology}
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
          />
          <View>
            <Upload
              label="Upload Documents & Files (Max 5)"
              name="doc_upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              maxSize={1024 * 1024 * 2}
              multiple
              maxCount={5}
              existingFiles={
                typeof values?.doc_upload === "string"
                  ? values?.doc_upload
                  : Array.isArray(values?.doc_upload) &&
                    values?.doc_upload.length > 0
                  ? values?.doc_upload
                      .filter((item) => typeof item === "string")
                      .join(",")
                  : ""
              }
              onChange={(fileList: any) => {
                // Separate existing URLs and new files
                const existingUrls: string[] = [];
                const newFiles: File[] = [];

                fileList?.forEach((item: any) => {
                  if (item.isExisting && item.url) {
                    existingUrls.push(item.url);
                  } else if (
                    !item.isExisting &&
                    item.file &&
                    item.file instanceof File
                  ) {
                    newFiles.push(item.file);
                  }
                });

                // Store URLs and Files separately to avoid serialization issues
                const urlsString = existingUrls.join(",");

                // Store in local form (for this component)
                onSetHandler("existing_file_urls", urlsString);
                onSetHandler("new_files_count", newFiles.length);

                // IMPORTANT: Store in main consultation form (for submission)
                if (mainOnSetHandler) {
                  mainOnSetHandler("existing_file_urls", urlsString);
                  mainOnSetHandler("new_files", newFiles);

                  // Also store combined for backward compatibility
                  const combinedFiles = [...existingUrls, ...newFiles];
                  mainOnSetHandler("doc_upload", combinedFiles);
                }
              }}
              error={errorsDocUpload}
            />
          </View>

          {/* <Label htmlFor="diagnosis_summary">Diagnosis Summary</Label> */}
          <View>
            <TipTapTextEditor
              name="diagnosis_summary"
              value={values?.diagnosis_summary}
              onChange={handleTipTapChange}
              label="Diagnosis Summary"
              placeholder="Enter diagnosis summary..."
              error={errorsDiagnosisSummary}
            />
          </View>

          {/* <Label htmlFor="advice">Advice</Label> */}
          <View className="col-span-2">
            <Textarea
              id="advice_field"
              name="advice_field"
              label="Advice"
              required={true}
              placeholder="Advice"
              error={errorsAdviceField}
              value={values?.advice_field ?? ""}
              onChange={handleChange}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default ProctologyExaminationSection;
