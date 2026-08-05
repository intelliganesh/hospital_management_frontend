import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import TransferList, { TransferListItem } from "@/components/TransferList";
import { useChiefComplaint } from "@/actions/calls/chiefComplaints";
import { RootState } from "@/actions/store";
import { useSelector } from "react-redux";

const ProctologyNewSection: React.FC = () => {
  const { values, onSetHandler } = useForm<Consultation | null>(null);

  const { chiefComplaintDropdownHandler } = useChiefComplaint();

  const chiefComplaintData = useSelector(
    (state: RootState) => state.chiefComplaint.chiefComplaintDropdownData
  );

  const chiefComplaintObj = chiefComplaintData?.map((item: any) => ({
    id: item?.id,
    label: item?.complaint_name,
    value: item?.complaint_name,
  }));

  useEffect(() => {
    chiefComplaintDropdownHandler(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Section 1 - Examination */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Proctology Examination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* chief complaints */}
          <View>
            <TransferList
              name="chief_complaint"
              label="Chief Complaints"
              sourceData={chiefComplaintObj}
              selectedItems={values?.complaint_name || []}
              onSelectionChange={(value: TransferListItem[]) => {
                onSetHandler("complaint_name", value);
              }}
              placeholder="Search complaints..."
              sourceTitle="Available Complaints"
              selectedTitle="Selected Complaints"
              height="150px"
              searchable
              showCount
              allowSelectAll
              allowCustomValues
              customValuePlaceholder="Add custom complaint"
            />
          </View>

          {/* surgical history  */}
          <View>
            <TransferList
              name="surgical_history"
              label="Surgical History"
              sourceData={[
                { id: 1, label: "Appendectomy", value: "appendectomy" },
                { id: 2, label: "Hysterectomy", value: "hysterectomy" },
                { id: 3, label: "Cesarean Section", value: "cesarean_section" },
                { id: 4, label: "Laparoscopy", value: "laparoscopy" },
              ]}
              selectedItems={[]}
              // onSelectionChange={(value) => {
              //   console.log("value", value);
              // }}
              placeholder="Search surgical history..."
              sourceTitle="Available Surgical History"
              selectedTitle="Selected Surgical History"
              height="150px"
              searchable
              showCount
              allowSelectAll
              allowCustomValues
              customValuePlaceholder="Add custom surgical history"
            />
          </View>

          {/* Co-morbidities */}
          <View>
            <TransferList
              name="co_morbidities"
              label="Co-morbidities"
              sourceData={[
                { id: 1, label: "Diabetes", value: "diabetes" },
                { id: 2, label: "Hypertension", value: "hypertension" },
                { id: 3, label: "Asthma", value: "asthma" },
                { id: 4, label: "Arthritis", value: "arthritis" },
              ]}
              selectedItems={[]}
              onSelectionChange={() => {
                // console.log("value", value);
              }}
              placeholder="Search co-morbidities..."
              sourceTitle="Available Co-morbidities"
              selectedTitle="Selected Co-morbidities"
              height="150px"
              maxSelections={6}
              searchable
              showCount
              allowSelectAll
              allowCustomValues
              customValuePlaceholder="Add custom co-morbidity"
            />
          </View>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProctologyNewSection;
