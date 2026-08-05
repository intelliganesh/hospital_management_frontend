import View from "./view";
import Text from "./text";
import { Plus, X } from "lucide-react";
// import Select from "@/components/Select";
import Button from "@/components/button";
// import SearchSelect from "./SearchSelect";
import React, { useEffect, useState } from "react";
// import useForm from "@/utils/custom-hooks/use-form";
// import { Consultation } from "@/interfaces/consultation";
import { Card, CardContent } from "@/components/ui/card";
import SingleSelector from "./SingleSelector";
import Input from "./input";
import { useDispatch } from "react-redux";
import { setMedicineModel } from "@/actions/slices/medicalStatus";

interface Medicine {
  id: string;
  dosage: string;
  timing: string;
  medicines: string;
  take_with: string;
  medicine_days: string;
  dosage_unit: string;
}

interface MedicinesSectionProps {
  medicineData: any;
  medicinesList: any[];
  errorsDosage?: string;
  errorsDosageUnit?: string;
  errorsTiming?: string;
  errorsTakeWith?: string;
  errorsMedicines?: string;
  errorsMedicineDays?: string;
  onSetHandler: (field: string, value: any) => void;
}

const MedicinesSection: React.FC<MedicinesSectionProps> = ({
  medicineData,
  errorsDosage,
  errorsTiming,
  errorsTakeWith,
  medicinesList,
  errorsMedicines,
  errorsDosageUnit,
  // errorsMedicineDays,
  onSetHandler,
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const dispatch = useDispatch();
  // const { onSetHandler } = useForm<Consultation | null>(null);

  useEffect(() => {
    if (medicines.length === 0) {
      updateMedicine("1", "dosage_unit", "Tablet");
    }
  }, []);

  useEffect(() => {
    const medicineString =
      typeof medicineData === "string"
        ? medicineData
        : medicineData?.medicines || "";
    const medicineLists = medicineString ? medicineString?.split(",") : [];
    const arrengedMedicineLists = medicineLists?.map(
      (medicine: any, index: number) => {
        const [
          medicineName,
          dosage_unit,
          dosage,
          timing,
          take_with,
          medicine_days,
        ] = medicine?.split("#");
        return {
          id: (index + 1)?.toString(),
          medicines: medicineName || "",
          dosage_unit: dosage_unit || "",
          dosage: dosage || "",
          timing: timing || "",
          take_with: take_with || "",
          medicine_days: medicine_days || "",
        };
      },
    );
    if (arrengedMedicineLists.length > 0) {
      setMedicines(arrengedMedicineLists);
    } else {
      const defaultMed: Medicine = {
        id: "1",
        medicines: "",
        dosage_unit: "Tablet", // <- important
        dosage: "2-0-2", // <- sensible default for Tablet
        timing: "before-food",
        take_with: "Warm water",
        medicine_days: "14",
      };
      setMedicines([defaultMed]);

      // keep parent form in sync
      onSetHandler(
        "medicines",
        [
          [
            defaultMed.medicines,
            defaultMed.dosage_unit,
            defaultMed.dosage,
            defaultMed.timing,
            defaultMed.take_with,
            defaultMed.medicine_days,
          ].join("#"),
        ].join(","),
      );
    }
  }, [medicineData]);

  const addMedicine = () => {
    const newId = (medicines.length + 1).toString();
    const newMedicines = [
      ...medicines,
      {
        id: newId,
        medicines: "",
        dosage_unit: "Tablet",
        dosage: "2-0-2",
        timing: "before-food",
        take_with: "Warm water",
        medicine_days: "14",
      },
    ];
    setMedicines(newMedicines);
  };

  const removeMedicine = (id: string) => {
    // if (medicines.length > 1) {
    const newMedicines = medicines.filter((med) => med.id !== id);
    setMedicines(newMedicines);

    // Add this part to update the form data
    onSetHandler(
      "medicines",
      newMedicines
        .map(
          (medicine) =>
            `${medicine.medicines}#${medicine.dosage_unit}#${medicine.dosage}#${medicine.timing}#${medicine.take_with}#${medicine.medicine_days}`,
        )
        .join(","),
    );
    // }
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines((prev) => {
      const updated = prev.map((medicine) => {
        if (medicine.id === id) {
          return { ...medicine, [field]: value };
        }
        return medicine;
      });
      onSetHandler(
        "medicines",
        updated
          .map((medicine) =>
            [
              medicine.medicines || "",
              medicine.dosage_unit || "",
              medicine.dosage || "",
              medicine.timing || "",
              medicine.take_with || "",
              medicine.medicine_days || "",
            ].join("#"),
          )
          .join(","),
      );

      return updated;
    });
  };

  return (
    <Card className="" style={{ backgroundColor: "var(--background" }}>
      <View className="flex justify-between items-center p-4">
        <Text as="h4" className="font-medium">
          Medicines
        </Text>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-1 text-primary"
          // variant="outline"
          onClick={() => {
            dispatch(setMedicineModel(true));
          }}
        >
          <Plus className="h-4 w-4" />
          Add New Medicine Data
        </Button>
      </View>
      <CardContent className="space-y-4">
        {medicines?.map((medicine, index) => (
          <View key={medicine?.id} className="rounded-lg p-4 space-y-4 bg-card">
            <View className="flex justify-between items-center">
              <Text as="h4" className="font-medium">
                Medicine {index + 1}
              </Text>
              {/* {index > 0 && ( */}
              <Button
                type="button"
                variant="danger"
                onClick={() => removeMedicine(medicine.id)}
                // disabled={medicines.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
              {/* )} */}
            </View>

            <View className="flex flex-wrap gap-2">
              <View className="flex-grow">
                {/* <SearchSelect
                  name="medicines"
                  label="Medicines"
                  selected={medicine.medicines}
                  onSelect={(option) =>
                    updateMedicine(
                      medicine.id,
                      "medicines",
                      option?.value || ""
                    )
                  }
                  options={medicinesList}
                  placeholder="Select Medicine"
                  error={errorsMedicines}
                /> */}
                <SingleSelector
                  id="medicines"
                  label="Medicines"
                  name="medicines"
                  error={errorsMedicines}
                  value={medicine?.medicines || ""}
                  placeholder="Select Medicine"
                  onChange={(value) => {
                    updateMedicine(medicine?.id, "medicines", value);
                  }}
                  options={medicinesList}
                />
              </View>
              <View className="flex-grow">
                <SingleSelector
                  id="dosage_unit"
                  label="Dosage Unit"
                  name="dosage_unit"
                  value={medicine?.dosage_unit || "Tablet"}
                  placeholder="Select Unit"
                  error={errorsDosageUnit}
                  onChange={(value) => {
                    updateMedicine(medicine.id, "dosage_unit", value);
                    // clear previous value when unit changes
                    // updateMedicine(medicine.id, "dosage_unit", "");
                  }}
                  options={[
                    { label: "Tablet", value: "Tablet" },
                    { label: "ML", value: "ML" },
                    { label: "tsp", value: "tsp" },
                    { label: "tblsp", value: "tblsp" },
                    { label: "Drops", value: "drops" },
                    { label: "External Apply (Oil/Cream)", value: "external" },
                  ]}
                />
              </View>

              <View className="flex-grow">
                {/* <Select
                  label="Dosage"
                  name="dosage"
                  value={medicine.dosage}
                  onChange={(e) => {
                    updateMedicine(medicine.id, "dosage", e.target.value);
                  }}
                  options={[
                    { label: "1-0-0", value: "1-0-0" },
                    { label: "0-1-0", value: "0-1-0" },
                    { label: "0-0-1", value: "0-0-1" },
                    { label: "1-0-1", value: "1-0-1" },
                    { label: "1-1-0", value: "1-1-0" },
                    { label: "0-1-1", value: "0-1-1" },
                    { label: "1-1-1", value: "1-1-1" },
                  ]}
                  placeholder="Select Dosage"
                  error={errorsDosage}
                /> */}
                <SingleSelector
                  id="dosage"
                  label="Dosage"
                  name="dosage"
                  error={errorsDosage}
                  value={medicine?.dosage || "2-0-2"}
                  placeholder="Select Dosage"
                  onChange={(value) => {
                    updateMedicine(medicine?.id, "dosage", value);
                  }}
                  options={
                    medicine?.dosage_unit === "tablet" ||
                    medicine?.dosage_unit === "Tablet"
                      ? [
                          { label: "1-0-0", value: "1-0-0" },
                          { label: "0-1-0", value: "0-1-0" },
                          { label: "0-0-1", value: "0-0-1" },
                          { label: "1-0-1", value: "1-0-1" },
                          { label: "1-1-1", value: "1-1-1" },
                          { label: "2-0-0", value: "2-0-0" },
                          { label: "0-2-0", value: "0-2-0" },
                          { label: "0-0-2", value: "0-0-2" },
                          { label: "2-0-2", value: "2-0-2" },
                          { label: "2-2-2", value: "2-2-2" },
                          { label: "5-0-0", value: "5-0-0" },
                          { label: "0-5-0", value: "0-5-0" },
                          { label: "0-0-5", value: "0-0-5" },
                          { label: "5-0-5", value: "5-0-5" },
                          { label: "5-5-5", value: "5-5-5" },
                        ]
                      : medicine?.dosage_unit === "ml" ||
                          medicine?.dosage_unit === "ML"
                        ? [
                            { label: "2.5ml-0-0", value: "2.5ml-0-0" },
                            { label: "0-2.5ml-0", value: "0-2.5ml-0" },
                            { label: "0-0-2.5ml", value: "0-0-2.5ml" },
                            { label: "2.5ml-0-2.5ml", value: "2.5ml-0-2.5ml" },
                            {
                              label: "2.5ml-2.5ml-2.5ml",
                              value: "2.5ml-2.5ml-2.5ml",
                            },

                            { label: "5ml-0-0", value: "5ml-0-0" },
                            { label: "0-5ml-0", value: "0-5ml-0" },
                            { label: "0-0-5ml", value: "0-0-5ml" },
                            { label: "5ml-0-5ml", value: "5ml-0-5ml" },
                            { label: "2tsp-0-5ml", value: "2tsp-0-5ml" },
                            { label: "5ml-5ml-5ml", value: "5ml-5ml-5ml" },

                            { label: "20ml-0-0", value: "20ml-0-0" },
                            { label: "0-20ml-0", value: "0-20ml-0" },
                            { label: "0-0-20ml", value: "0-0-20ml" },
                            { label: "20ml-0-20ml", value: "20ml-0-20ml" },
                            { label: "2tsp-0-20ml", value: "2tsp-0-20ml" },
                            {
                              label: "20ml-20ml-20ml",
                              value: "20ml-20ml-20ml",
                            },

                            { label: "7.5ml-0-0", value: "7.5ml-0-0" },
                            { label: "0-7.5ml-0", value: "0-7.5ml-0" },
                            { label: "0-0-7.5ml", value: "0-0-7.5ml" },
                            { label: "7.5ml-0-7.5ml", value: "7.5ml-0-7.5ml" },
                            {
                              label: "7.5ml-7.5ml-7.5ml",
                              value: "7.5ml-7.5ml-7.5ml",
                            },

                            { label: "10ml-0-0", value: "10ml-0-0" },
                            { label: "0-10ml-0", value: "0-10ml-0" },
                            { label: "0-0-10ml", value: "0-0-10ml" },
                            { label: "10ml-0-10ml", value: "10ml-0-10ml" },
                            {
                              label: "10ml-10ml-10ml",
                              value: "10ml-10ml-10ml",
                            },

                            { label: "15ml-0-0", value: "15ml-0-0" },
                            { label: "0-15ml-0", value: "0-15ml-0" },
                            { label: "0-0-15ml", value: "0-0-15ml" },
                            { label: "15ml-0-15ml", value: "15ml-0-15ml" },
                            {
                              label: "15ml-15ml-15ml",
                              value: "15ml-15ml-15ml",
                            },
                          ]
                        : medicine?.dosage_unit === "tsp"
                          ? [
                              { label: "1/4tsp-0-0", value: "1/4tsp-0-0" },
                              { label: "0-1/4tsp-0", value: "0-1/4tsp-0" },
                              { label: "0-0-1/4tsp", value: "0-0-1/4tsp" },
                              {
                                label: "1/4tsp-0-1/4tsp",
                                value: "1/4tsp-0-1/4tsp",
                              },
                              {
                                label: "1/4tsp-1/4tsp-1/4tsp",
                                value: "1/4tsp-1/4tsp-1/4tsp",
                              },

                              { label: "1/2tsp-0-0", value: "1/2tsp-0-0" },
                              { label: "0-1/2tsp-0", value: "0-1/2tsp-0" },
                              { label: "0-0-1/2tsp", value: "0-0-1/2tsp" },
                              {
                                label: "1/2tsp-0-1/2tsp",
                                value: "1/2tsp-0-1/2tsp",
                              },
                              {
                                label: "1/2tsp-1/2tsp-1/2tsp",
                                value: "1/2tsp-1/2tsp-1/2tsp",
                              },

                              { label: "1tsp-0-0", value: "1tsp-0-0" },
                              { label: "0-1tsp-0", value: "0-1tsp-0" },
                              { label: "0-0-1tsp", value: "0-0-1tsp" },
                              { label: "1tsp-0-1tsp", value: "1tsp-0-1tsp" },
                              {
                                label: "1tsp-1tsp-1tsp",
                                value: "1tsp-1tsp-1tsp",
                              },
                            ]
                          : medicine?.dosage_unit === "tblsp"
                            ? [
                                {
                                  label: "1/2tblsp-0-0",
                                  value: "1/2tblsp-0-0",
                                },
                                {
                                  label: "0-1/2tblsp-0",
                                  value: "0-1/2tblsp-0",
                                },
                                {
                                  label: "0-0-1/2tblsp",
                                  value: "0-0-1/2tblsp",
                                },
                                {
                                  label: "1/2tblsp-0-2tsp",
                                  value: "1/2tblsp-0-2tsp",
                                },
                                {
                                  label: "1/2tblsp-1/2tblsp-1/2tblsp",
                                  value: "1/2tblsp-1/2tblsp-1/2tblsp",
                                },

                                { label: "1tblsp-0-0", value: "1tblsp-0-0" },
                                { label: "0-1tblsp-0", value: "0-1tblsp-0" },
                                { label: "0-0-1tblsp", value: "0-0-1tblsp" },
                                {
                                  label: "1tblsp-0-1tblsp",
                                  value: "1tblsp-0-1tblsp",
                                },
                                {
                                  label: "1tblsp-1tblsp-1tblsp",
                                  value: "1tblsp-1tblsp-1tblsp",
                                },
                              ]
                            : medicine?.dosage_unit === "drops"
                              ? [
                                  { label: "1-0-0", value: "1-0-0" },
                                  { label: "0-1-0", value: "0-1-0" },
                                  { label: "0-0-1", value: "0-0-1" },
                                  { label: "1-0-1", value: "1-0-1" },
                                  { label: "1-1-1", value: "1-1-1" },
                                  { label: "2-0-0", value: "2-0-0" },
                                  { label: "0-2-0", value: "0-2-0" },
                                  { label: "0-0-2", value: "0-0-2" },
                                  { label: "2-0-2", value: "2-0-2" },
                                  { label: "2-2-2", value: "2-2-2" },
                                ]
                              : medicine?.dosage_unit === "external"
                                ? [
                                    { label: "1 Time", value: "1_time" },
                                    { label: "2 Times", value: "2_times" },
                                    { label: "3 Times", value: "3_times" },
                                  ]
                                : []
                  }
                />
              </View>

              <View className="flex-grow">
                {/* <Select
                  label="Timing"
                  name="timing"
                  value={medicine.timing}
                  onChange={(e) => {
                    updateMedicine(medicine.id, "timing", e.target.value);
                  }}
                  options={[
                    { label: "Before Food", value: "before-food" },
                    { label: "After Food", value: "after-food" },
                    { label: "With Food", value: "with-food" },
                    { label: "Empty Stomach", value: "empty-stomach" },
                    { label: "Before Sleep", value: "before-sleep" },
                  ]}
                  placeholder="Select Timing"
                  error={errorsTiming}
                /> */}
                <SingleSelector
                  id="timing"
                  label="Timing"
                  name="timing"
                  error={errorsTiming}
                  value={
                    medicine?.dosage_unit === "external" ||
                    medicine?.dosage_unit === "drops"
                      ? ""
                      : medicine?.timing || "before-food"
                  }
                  placeholder="Select Timing"
                  onChange={(value) => {
                    updateMedicine(medicine?.id, "timing", value);
                  }}
                  options={[
                    { label: "Before Food", value: "before-food" },
                    { label: "After Food", value: "after-food" },
                    { label: "With Food", value: "with-food" },
                    { label: "Empty Stomach", value: "empty-stomach" },
                    { label: "Before Sleep", value: "before-sleep" },
                  ]}
                />
              </View>

              <View className="flex-shrink">
                <SingleSelector
                  id="take_with"
                  label="Take With"
                  name="take_with"
                  error={errorsTakeWith}
                  value={
                    medicine?.dosage_unit === "external" ||
                    medicine?.dosage_unit === "drops"
                      ? ""
                      : medicine?.take_with || "Warm water"
                  }
                  placeholder="Select with what to take"
                  onChange={(value) => {
                    updateMedicine(medicine.id, "take_with", value);
                  }}
                  options={[
                    { label: "Normal water", value: "Normal water" },
                    { label: "Warm water", value: "Warm water" },
                    { label: "Hot water", value: "Hot water" },
                    { label: "Normal milk", value: "Normal milk" },
                    { label: "Warm milk", value: "Warm milk" },
                    { label: "Hot milk", value: "Hot milk" },
                    { label: "Juice", value: "Juice" },
                    { label: "Kashaya", value: "Kashaya" },
                  ]}
                />
              </View>
              <View className="flex-initial w-24">
                <Input
                  id="medicine_days"
                  name="medicine_days"
                  label="Days"
                  value={medicine?.medicine_days || "14"}
                  placeholder="Enter Days"
                  onChange={(e) => {
                    updateMedicine(
                      medicine?.id,
                      "medicine_days",
                      e.target.value,
                    );
                  }}
                />
              </View>
            </View>
            {/* <View>
              <Input
                id="medicine_days"
                name="medicine_days"
                label="Days to Take Medicine"
                value={medicine?.medicine_days || ""}
                placeholder="Enter Days"
                onChange={(e) => {
                  updateMedicine(medicine?.id, "medicine_days", e.target.value);
                }}
              />
            </View> */}
          </View>
        ))}

        <Button
          type="button"
          variant="primary"
          onClick={addMedicine}
          className="mt-4 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicinesSection;
