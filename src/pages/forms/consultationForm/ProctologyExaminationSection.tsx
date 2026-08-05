import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Input from "@/components/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Switch from "@/components/ui/switch";
import Text from "@/components/text";
import View from "@/components/view";
import MultiSelectWithDropDown from "@/components/MultiSelectWithDropDown";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";

const ProctologyExaminationSection: React.FC = () => {
  // const [findings, setFindings] = useState([""]);
  // const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [admissionAdvice, setAdmissionAdvice] = useState(false);
  const [fees, setFees] = useState("");
  const [, setFinding] = useState("");

  const { values, handleChange, handleTipTapChange, onSetHandler } =
    useForm<Consultation | null>(null);

  //   const handleFileChange = (fileList: FileItem[]) => {
  //   console.log("fileList", fileList);
  //   onSetHandler("doc_upload", fileList?.map((item: any) => item.file));
  // };

  // const addFinding = () => {
  //   if (findings.length < 10) {
  //     setFindings([...findings, ""]);
  //   }
  // };

  // const removeFinding = (index: number) => {
  //   setFindings(findings.filter((_, i) => i !== index));
  // };

  // const updateFinding = (index: number, value: string) => {
  //   const updated = [...findings];
  //   updated[index] = value;
  //   setFindings(updated);
  // };

  return (
    <div className="space-y-6">
      {/* Section 1 - Examination */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Proctology Examination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {/* < htmlFor="preliminary_diagnostic">Preliminary Diagnostic</> */}
            <View className="col-span-2">
              <Textarea
                required={true}
                onChange={handleChange}
                id="preliminary_diagnosis"
                name="preliminary_diagnosis"
                label="Preliminary Diagnosis"
                // error={errorsPreliminaryDiagnosis}
                placeholder="Preliminary Diagnosis"
                value={values?.preliminary_diagnosis || ""}
              />
            </View>
            {/* <Input label="Preliminary Diagnostic"  id="preliminary_diagnostic" placeholder="Enter preliminary diagnostic" /> */}
          </div>

          <div>
            {/* <Text as="h3">Findings</Text> */}
            <MultiSelectWithDropDown
              name="findings"
              label="Findings"
              onChange={(value) => setFinding(value)}
              placeholder="Select Findings"
              options={[
                { id: 1, label: "Hemorrhoids", value: "hemorrhoids" },
                { id: 2, label: "Anal Fissure", value: "fissure" },
                { id: 3, label: "Anal Fistula", value: "fistula" },
                { id: 4, label: "Polyp", value: "polyp" },
                { id: 5, label: "Inflammation", value: "inflammation" },
              ]}
            />

            {/* {findings.map((finding, index) => (
              <View key={index} className="flex gap-2 mb-2">
                <Select
                  name="findings"
                  value={finding}
                  onChange={(e) => updateFinding(index, e.target.value)}
                  options={[
                    { label: "Hemorrhoids", value: "hemorrhoids" },
                    { label: "Anal Fissure", value: "fissure" },
                    { label: "Anal Fistula", value: "fistula" },
                    { label: "Polyp", value: "polyp" },
                    { label: "Inflammation", value: "inflammation" },
                  ]}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => removeFinding(index)}
                  disabled={findings.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </View>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={addFinding}
              disabled={findings.length >= 10}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Finding
            </Button> */}
          </div>

          <div>
            {/* <Label htmlFor="examination_overview">Examination Overview</Label> */}
            {/* <Input label="Examination Overview" id="examination_overview" placeholder="Enter examination overview" /> */}
            <View>
              <TipTapTextEditor
                name="examination_overview"
                // value={values?.examination_overview}
                onChange={handleTipTapChange}
                label="Examination Overview"
                placeholder="Enter examination overview..."
                // error={errorsExaminationOverview}
              />
            </View>
          </div>

          {/* 
          <div>
            <Input 
              label="Upload Documents & Files (Max 5)"
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length <= 5) {
                  setUploadedFiles(files.map(f => f.name));
                }
              }}
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Uploaded files:</p>
                <ul className="text-sm">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}
          <View>
            <Upload
              label="Upload Documents & Files (Max 5)"
              name="doc_upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              multiple
              maxCount={5}
              onChange={(fileList: any) => {
                // console.log("fileList", fileList);
                // console.log("fileList length", fileList?.length);

                // Extract the actual File objects from FileItem array
                const files = fileList?.map((item: any) => item.file) || [];
                // console.log("extracted files", files);
                // console.log("extracted files length", files.length);

                onSetHandler("doc_upload", files);
              }}
            />
          </View>

          {/* <Label htmlFor="diagnosis_summary">Diagnosis Summary</Label> */}
          <View>
            <TipTapTextEditor
              name="diagnosis_summary"
              // value={values?.examination_overview}
              onChange={handleTipTapChange}
              label="Diagnosis Summary"
              placeholder="Enter diagnosis summary..."
              // error={errorsExaminationOverview}
            />
          </View>

          {/* <Label htmlFor="advice">Advice</Label> */}
          <View className="col-span-2">
            <Textarea
              id="advice"
              name="advice"
              label="Advice"
              required={true}
              placeholder="Advice"
              // error={errorsAdvice}
              value={values?.advice}
              onChange={handleChange}
            />
          </View>
        </CardContent>
      </Card>

      {/* Section 2 - Post Examination */}
      <Card>
        <CardHeader>
          <CardTitle>Post Examination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {/* <Label htmlFor="fees">Appointment Fees</Label> */}
            <Input
              label="Appointment Fees"
              id="fees"
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="Enter fees amount"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="admission_advice"
              checked={admissionAdvice}
              onChange={setAdmissionAdvice}
            />
            <Text as="label">Advice for Admission</Text>
          </div>

          <div>
            {/* <Label htmlFor="status">Status</Label> */}
            {/* <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="follow-up">Follow-up Required</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProctologyExaminationSection;
