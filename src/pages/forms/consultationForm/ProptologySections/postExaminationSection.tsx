import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import Switch from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import useForm from "@/utils/custom-hooks/use-form";
import { useMedicine } from "@/actions/calls/medicine";
import { Consultation } from "@/interfaces/consultation";
import MedicinesSection from "@/components/MedicinesSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostExaminationSectionProps {
  errorsFees: string;
  errorsDosage: string;
  errorsTiming: string;
  appointmetnFees: string;
  errorsMedicines: string;
  postExaminationData: any;
  errorsAdviceAdmission: string;
}
const PostExaminationSection: React.FC<PostExaminationSectionProps> = ({
  errorsFees,
  errorsTiming,
  errorsDosage,
  errorsMedicines,
  appointmetnFees,
  postExaminationData,
  errorsAdviceAdmission,
}) => {
  const { medicineDropdownHandler } = useMedicine();

  const consultationData = useSelector(
    (state: any) => state.consultation.consultationDetailData
  );

  const medicineDropdownData = useSelector(
    (state: RootState) => state.medicines.medicineDropdownData
  )?.map((item: any) => ({
    id: item?.id,
    label: item?.medicine_name,
    value: item?.medicine_name,
  }));

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationData?.consultations
  );

  useEffect(() => {
    medicineDropdownHandler(() => {});
    onSetHandler("fees", appointmetnFees);
  }, []);

  return (
    <View className="space-y-6">
      {/* Section 1 - Examination */}
      <Card
        className="mt-2 shadow-none border-none"
        style={{ boxShadow: "none" }}
      >
        <CardHeader
          style={{
            padding: "10px 0px",
          }}
        >
          <CardTitle>Post Examination</CardTitle>
        </CardHeader>
        <CardContent
          className="space-y-4"
          style={{
            padding: "20px 0px",
          }}
        >
          <View className=" rounded-lg">
            <MedicinesSection
              errorsDosage={errorsDosage}
              errorsTiming={errorsTiming}
              errorsMedicines={errorsMedicines}
              medicinesList={medicineDropdownData}
              medicineData={postExaminationData?.medicines}
              onSetHandler={onSetHandler}
            />
          </View>
          <View>
            <Input
              id="fees"
              name="fees"
              type="number"
              error={errorsFees}
              onChange={handleChange}
              label="Appointment Fees"
              value={values?.fees || ""}
              placeholder="Enter fees amount"
            />
          </View>

          <View>
            <View className="flex items-center space-x-2">
              <Switch
                variant="primary"
                id="advice_admition"
                name="advice_admition"
                defaultChecked={false}
                // defaultChecked={values?.advice_admition || false}
                onChange={(checked: boolean) =>
                  onSetHandler("advice_admition", checked)
                }
              />
              <Text as="label">Advice for Admission</Text>
            </View>
            {errorsAdviceAdmission && (
              <Text as="p" className="text-sm text-red-500">
                {errorsAdviceAdmission}
              </Text>
            )}
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default PostExaminationSection;
