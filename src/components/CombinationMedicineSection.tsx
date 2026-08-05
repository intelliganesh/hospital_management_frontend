import View from "./view";
import Text from "./text";
import { Plus, X } from "lucide-react";
import Button from "@/components/button";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SingleSelector from "./SingleSelector";
import Input from "./input";

interface MedicineIngredient {
  id: string;
  combination_medicine: string;
  combination_quantity: string;
  combination_unit: string;
}

interface CombinationMedicine {
  id: string;
  combination_ingredients: MedicineIngredient[];
  combination_dosage: string;
  combination_timing: string;
  combination_take_with: string;
  combination_medicine_days: string;
}

interface CombinationMedicineSectionProps {
  combinationMedicineData: any;
  medicinesList: any[];
  onSetHandler: (field: string, value: any) => void;
}

const CombinationMedicineSection: React.FC<CombinationMedicineSectionProps> = ({
  combinationMedicineData,
  medicinesList,
  onSetHandler,
}) => {
  const combinationMedicinesRef = useRef<HTMLInputElement>(null);

  const [combinationMedicines, setCombinationMedicines] = useState<
    CombinationMedicine[]
  >([]);
  useEffect(() => {
    if (combinationMedicinesRef.current) {
      combinationMedicinesRef.current.value =
        JSON.stringify(combinationMedicines);
    }
  }, [combinationMedicines]);

  useEffect(() => {
    // Handle array of objects or parse from string if needed
    let combinationData: CombinationMedicine[] = [];
    if (Array.isArray(combinationMedicineData)) {
      // Already an array of objects
      combinationData = combinationMedicineData.map(
        (combo: any, index: number) => ({
          id: (index + 1).toString(),
          combination_ingredients:
            combo.combination_ingredients?.map((ing: any, ingIndex: number) => ({
              id: `${index + 1}-${ingIndex + 1}`,
              combination_medicine: ing.combination_medicine || "",
              combination_quantity: ing.combination_quantity || "",
              combination_unit: ing.combination_unit || "g",
            })) || [],
          combination_dosage: combo.combination_dosage || "2-0-2",
          combination_timing: combo.combination_timing || "before-food",
          combination_take_with: combo.combination_take_with || "Warm water",
          combination_medicine_days: combo.combination_medicine_days || "14",
        })
      );
    } else if (
      typeof combinationMedicineData === "string" &&
      combinationMedicineData
    ) {      
      // Parse from JSON string
      try {
        const parsed = JSON.parse(combinationMedicineData);
        if (Array.isArray(parsed)) {
          combinationData = parsed.map((combo: any, index: number) => ({
            id: (index + 1).toString(),
            combination_ingredients:
              combo.combination_ingredients?.map((ing: any, ingIndex: number) => ({
                id: `${index + 1}-${ingIndex + 1}`,
                combination_medicine: ing.combination_medicine || "",
                combination_quantity: ing.combination_quantity || "",
                combination_unit: ing.combination_unit || "g",
              })) || [],
            combination_dosage: combo.combination_dosage || "2-0-2",
            combination_timing: combo.combination_timing || "before-food",
            combination_take_with: combo.combination_take_with || "Warm water",
            combination_medicine_days: combo.combination_medicine_days || "14",
          }));
        }
      } catch (e) {
        console.error("Error parsing combination medicine data:", e);
      }
    }    

    if (combinationData.length > 0) {
      setCombinationMedicines(combinationData);
    } else {
      // Initialize with empty combination
      // const defaultCombination: CombinationMedicine = {
      //   id: "1",
      //   combination_ingredients: [
      //     {
      //       id: "1-1",
      //       combination_medicine: "",
      //       combination_quantity: "",
      //       combination_unit: "g",
      //     },
      //   ],
      //   combination_dosage: "2-0-2",
      //   combination_timing: "before-food",
      //   combination_take_with: "Warm water",
      //   combination_medicine_days: "14",
      // };
      // setCombinationMedicines([defaultCombination]);
      // syncToParent([defaultCombination]);
    }
  }, [combinationMedicineData]);

  const syncToParent = (combinations: CombinationMedicine[]) => {
    // Convert to array of objects (clean format without IDs)
    const dataToSend = combinations.map((combo) => ({
      combination_ingredients: combo.combination_ingredients.map((ing) => ({
        combination_medicine: ing.combination_medicine,
        combination_quantity: ing.combination_quantity,
        combination_unit: ing.combination_unit,
      })),
      combination_dosage: combo.combination_dosage,
      combination_timing: combo.combination_timing,
      combination_take_with: combo.combination_take_with,
      combination_medicine_days: combo.combination_medicine_days,
    }));

    // Send as array of objects
    onSetHandler("combination_medicines", dataToSend);
  };

  const addCombinationMedicine = () => {
    const newId = (combinationMedicines.length + 1).toString();
    const newCombination: CombinationMedicine = {
      id: newId,
      combination_ingredients: [
        {
          id: `${newId}-1`,
          combination_medicine: "",
          combination_quantity: "",
          combination_unit: "g",
        },
      ],
      combination_dosage: "2-0-2",
      combination_timing: "before-food",
      combination_take_with: "Warm water",
      combination_medicine_days: "14",
    };
    const updated = [...combinationMedicines, newCombination];
    setCombinationMedicines(updated);
    syncToParent(updated);
  };

  const removeCombinationMedicine = (id: string) => {
    const updated = combinationMedicines.filter((combo) => combo.id !== id);
    setCombinationMedicines(updated);
    syncToParent(updated);
  };

  const addIngredient = (comboId: string) => {
    setCombinationMedicines((prev) => {
      const updated = prev.map((combo) => {
        if (combo.id === comboId) {
          const newIngredientId = `${comboId}-${
            combo.combination_ingredients.length + 1
          }`;
          return {
            ...combo,
            combination_ingredients: [
              ...combo.combination_ingredients,
              {
                id: newIngredientId,
                combination_medicine: "",
                combination_quantity: "",
                combination_unit: "g",
              },
            ],
          };
        }
        return combo;
      });
      syncToParent(updated);
      return updated;
    });
  };

  const removeIngredient = (comboId: string, ingredientId: string) => {
    setCombinationMedicines((prev) => {
      const updated = prev.map((combo) => {
        if (combo.id === comboId) {
          return {
            ...combo,
            combination_ingredients: combo.combination_ingredients.filter(
              (ing) => ing.id !== ingredientId
            ),
          };
        }
        return combo;
      });
      syncToParent(updated);
      return updated;
    });
  };

  const updateIngredient = (
    comboId: string,
    ingredientId: string,
    field: keyof MedicineIngredient,
    value: string
  ) => {
    setCombinationMedicines((prev) => {
      const updated = prev.map((combo) => {
        if (combo.id === comboId) {
          return {
            ...combo,
            combination_ingredients: combo.combination_ingredients.map(
              (ing) => {
                if (ing.id === ingredientId) {
                  return { ...ing, [field]: value };
                }
                return ing;
              }
            ),
          };
        }
        return combo;
      });
      syncToParent(updated);
      return updated;
    });
  };

  const updateCombination = (
    comboId: string,
    field: keyof CombinationMedicine,
    value: string
  ) => {
    setCombinationMedicines((prev) => {
      const updated = prev.map((combo) => {
        if (combo.id === comboId) {
          return { ...combo, [field]: value };
        }
        return combo;
      });
      syncToParent(updated);
      return updated;
    });
  };

  return (
    <Card className="" style={{ backgroundColor: "var(--background" }}>
      <View className="flex justify-between items-center p-4">
        <Text as="h4" className="font-medium">
          Combination Medicines
        </Text>
      </View>
      <CardContent className="space-y-4">
        {combinationMedicines?.map((combination, index) => (
          <View
            key={combination?.id}
            className="rounded-lg p-4 space-y-4 bg-card border border-border"
          >
            <View className="flex items-center gap-8">
              <Text as="h4" className="font-medium">
                Combination Medicine {index + 1}
              </Text>
              <Button
                type="button"
                variant="danger"
                onClick={() => removeCombinationMedicine(combination.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </View>

            {/* Ingredients Section */}
            <View className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md">
              <View className="flex justify-between items-center">
                <Text as="p" className="text-sm font-semibold text-text-light">
                  Mix Ingredients
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={() => addIngredient(combination.id)}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Medicine
                </Button>
              </View>

              {combination.combination_ingredients.map((ingredient, index) => (
                <React.Fragment key={ingredient.id}>
                  {index > 0 && (
                    <View className="flex justify-center items-center py-1">
                      <Text
                        as="span"
                        className="text-lg font-bold text-primary"
                      >
                        +
                      </Text>
                    </View>
                  )}
                  <View className="flex gap-2 items-end bg-white dark:bg-card p-2 rounded-md">
                    <View className="flex-1 min-w-0">
                      <SingleSelector
                        id={`combination_medicine-${ingredient.id}`}
                        label="Medicine"
                        name={`combination_medicine-${ingredient.id}`}
                        value={ingredient.combination_medicine}
                        placeholder="Select Medicine"
                        onChange={(value) =>
                          updateIngredient(
                            combination.id,
                            ingredient.id,
                            "combination_medicine",
                            value
                          )
                        }
                        options={medicinesList}
                      />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Input
                        id={`combination_quantity-${ingredient.id}`}
                        name={`combination_quantity-${ingredient.id}`}
                        label="Quantity"
                        value={ingredient.combination_quantity}
                        placeholder="50"
                        onChange={(e) =>
                          updateIngredient(
                            combination.id,
                            ingredient.id,
                            "combination_quantity",
                            e.target.value
                          )
                        }
                      />
                    </View>
                    <View className="flex-1 min-w-0">
                      <SingleSelector
                        id={`combination_unit-${ingredient.id}`}
                        label="Unit"
                        name={`combination_unit-${ingredient.id}`}
                        value={ingredient.combination_unit}
                        placeholder="Unit"
                        onChange={(value) =>
                          updateIngredient(
                            combination.id,
                            ingredient.id,
                            "combination_unit",
                            value
                          )
                        }
                        options={[
                          { label: "g (grams)", value: "g" },
                          { label: "mg (milligrams)", value: "mg" },
                          { label: "ml (milliliters)", value: "ml" },
                          { label: "tablets", value: "tablet" },
                          { label: "tsp (teaspoon)", value: "tsp" },
                          { label: "tblsp (tablespoon)", value: "tblsp" },
                          { label: "Drops", value: "drops" },
                          { label: "External Apply (Oil/Cream)", value: "external" }

                        ]}
                      />
                    </View>
                    {combination.combination_ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() =>
                          removeIngredient(combination.id, ingredient.id)
                        }
                        className="mb-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* Dosage, Timing, Take With, Days */}
            <View className="flex flex-wrap gap-2">
              <View className="flex-grow">
                <SingleSelector
                  id={`combination_dosage-${combination.id}`}
                  label="Dosage"
                  name={`combination_dosage-${combination.id}`}
                  value={combination.combination_dosage}
                  placeholder="Select Dosage"
                  onChange={(value) =>
                    updateCombination(
                      combination.id,
                      "combination_dosage",
                      value
                    )
                  }
                  options={[
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
                          { label: "2.5ml-0-0", value: "2.5ml-0-0" },
                          { label: "0-2.5ml-0", value: "0-2.5ml-0" },
                          { label: "0-0-2.5ml", value: "0-0-2.5ml" },
                          { label: "2.5ml-0-2.5ml", value: "2.5ml-0-2.5ml" },
                          {
                            label: "2.5ml-2.5ml-2.5ml",
                            value: "2.5ml-2.5ml-2.5ml",
                          },

                          { label: "5ml-0-0", value: "5ml-0-0" },
                          { label: "5ml-0-5ml", value: "5ml-0-5ml" },
                          { label: "0-5ml-0", value: "0-5ml-0" },
                          { label: "0-0-5ml", value: "0-0-5ml" },
                          { label: "2tsp-0-5ml", value: "2tsp-0-5ml" },
                          { label: "5ml-5ml-5ml", value: "5ml-5ml-5ml" },

                          { label: "20ml-0-0", value: "20ml-0-0" },
                          { label: "0-20ml-0", value: "0-20ml-0" },
                          { label: "0-0-20ml", value: "0-0-20ml" },
                          { label: "20ml-0-20ml", value: "20ml-0-20ml" },
                          { label: "2tsp-0-20ml", value: "2tsp-0-20ml" },
                          { label: "20ml-20ml-20ml", value: "20ml-20ml-20ml" },

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
                          { label: "10ml-10ml-10ml", value: "10ml-10ml-10ml" },

                          { label: "15ml-0-0", value: "15ml-0-0" },
                          { label: "0-15ml-0", value: "0-15ml-0" },
                          { label: "0-0-15ml", value: "0-0-15ml" },
                          { label: "15ml-0-15ml", value: "15ml-0-15ml" },
                          { label: "15ml-15ml-15ml", value: "15ml-15ml-15ml" },
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
                          { label: "1tsp-1tsp-1tsp", value: "1tsp-1tsp-1tsp" },
                          { label: "1/2tblsp-0-0", value: "1/2tblsp-0-0" },
                          { label: "0-1/2tblsp-0", value: "0-1/2tblsp-0" },
                          { label: "0-0-1/2tblsp", value: "0-0-1/2tblsp" },
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
                          { label: "1 Time", value: "1_time" },
                          { label: "2 Times", value: "2_times" },
                          { label: "3 Times", value: "3_times" },
                  ]}
                />
              </View>

              <View className="flex-grow">
                <SingleSelector
                  id={`combination_timing-${combination.id}`}
                  label="Timing"
                  name={`combination_timing-${combination.id}`}
                  value={combination.combination_timing}
                  placeholder="Select Timing"
                  onChange={(value) =>
                    updateCombination(
                      combination.id,
                      "combination_timing",
                      value
                    )
                  }
                  options={[
                    { label: "Before Food", value: "before-food" },
                    { label: "After Food", value: "after-food" },
                    { label: "With Food", value: "with-food" },
                    { label: "Empty Stomach", value: "empty-stomach" },
                    { label: "Before Sleep", value: "before-sleep" },
                  ]}
                />
              </View>

              <View className="flex-grow">
                <SingleSelector
                  id={`combination_take_with-${combination.id}`}
                  label="Take With"
                  name={`combination_take_with-${combination.id}`}
                  value={combination.combination_take_with}
                  placeholder="Select with what to take"
                  onChange={(value) =>
                    updateCombination(
                      combination.id,
                      "combination_take_with",
                      value
                    )
                  }
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
                  id={`combination_medicine_days-${combination.id}`}
                  name={`combination_medicine_days-${combination.id}`}
                  label="Days"
                  value={combination.combination_medicine_days}
                  placeholder="14"
                  onChange={(e) =>
                    updateCombination(
                      combination.id,
                      "combination_medicine_days",
                      e.target.value
                    )
                  }
                />
              </View>
            </View>
          </View>
        ))}

        <Button
          type="button"
          variant="primary"
          onClick={addCombinationMedicine}
          className="mt-4 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Combination Medicine
        </Button>

        <input
          type="hidden"
          name="combination_medicines"
          ref={combinationMedicinesRef}
          defaultValue={JSON.stringify(combinationMedicines)}
        />
      </CardContent>
    </Card>
  );
};

export default CombinationMedicineSection;
