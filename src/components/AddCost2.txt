import React, { useEffect, useState } from "react";
import View from "./view";
import Button from "./button";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import SingleSelector from "./SingleSelector";
import { Card, CardTitle } from "./ui/card";
import { useDispatch } from "react-redux";
import { totalServiceCostSlice } from "@/actions/slices/serviceCost";
// import { useServiceCost } from "@/actions/calls/serviceCost";
// import { totalServiceCostSlice } from "@/actions/slices/serviceCost";

interface InputField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface SelectDropDown {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface AddCostInputProps {
  title: string;
  minItems?: number;
  maxItems?: number;
  className?: string;
  defaultValue?: string[];
  cardClassName?: string;
  addButtonText?: string;
  inputField: InputField;
  selectDropDown: SelectDropDown;
}

interface InputItem {
  id: string;
  input: InputField;
  selectDropDown: SelectDropDown;
  service?: string;
  cost?: string;
}

const AddCostInput: React.FC<AddCostInputProps> = ({
  title,
  maxItems = 5,
  className = "",
  cardClassName = "",
  addButtonText = "Add Service",
  inputField,
  defaultValue = [],
  selectDropDown,
}) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState<InputItem[]>([]);
  // Initialize from defaultValue if provided

  // dispatch(totalServiceCostSlice(totalCost))
  useEffect(() => {
    if (defaultValue.length > 0) {
      const prefilledInputs = defaultValue.map((item) => {
        const [service, cost] = item.split("#");
        return {
          input: inputField,
          selectDropDown,
          id: `${Date.now()}_${Math.random()}`,
          service,
          cost,
        };
      });
      setInputs(prefilledInputs);
    }
  }, [defaultValue]);

  const handleAdd = () => {
    if (inputs.length < maxItems) {
      setInputs([
        ...inputs,
        {
          input: inputField,
          selectDropDown,
          id: `${Date.now()}_${Math.random()}`,
          service: "",
          cost: "",
        },
      ]);
    }
  };

  const handleRemove = (id: string) => {
    // setInputs((prev) => prev.filter((item) => item.id !== id));
    // dispatch(
    //   totalServiceCostSlice(
    //     inputs.reduce((acc, item) => acc + Number(item.cost || 0), 0)
    //   )
    // );
    const updatedInputs = inputs.filter((item) => item.id !== id);
    setInputs(updatedInputs);
    const total = updatedInputs.reduce(
      (acc, item) => acc + Number(item.cost || 0),
      0
    );
    dispatch(totalServiceCostSlice(total));
  };

  const handleUpdateValue = (id: string, service: string, cost: string) => {
    const updatedInputs = inputs.map((item) =>
      item.id === id ? { ...item, service, cost } : item
    );
    setInputs(updatedInputs);
    const total = updatedInputs.reduce(
      (acc, item) => acc + Number(item.cost || 0),
      0
    );
    dispatch(totalServiceCostSlice(total));
  };

  const serviceCostString = inputs
    .filter((i) => i.service && i.cost)
    .map((i) => `${i.service}#${i.cost}`)
    .join(",");

  return (
    <View className="px-6">
      <Card
        className={`${className} ${cardClassName}`}
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* <CardHeader> */}
        <CardTitle>{title}</CardTitle>
        {/* </CardHeader> */}

        {/* Hidden field to hold the result */}
        <input type="hidden" value={serviceCostString} name="Service" />

        {inputs.map((item, index) => (
          <InputsComp
            key={item.id}
            item={item}
            index={index}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
          />
        ))}
        <div className="flex justify-center mb-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleAdd}
            disabled={inputs.length >= maxItems}
            className="mt-4 flex items-center max-w-full justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        </div>
      </Card>
    </View>
  );
};

interface InputsCompProps {
  item: InputItem;
  index: number;
  handleRemove: (id: string) => void;
  handleUpdateValue: (id: string, service: string, cost: string) => void;
}

const InputsComp: React.FC<InputsCompProps> = ({
  item,
  index,
  handleRemove,
  handleUpdateValue,
}) => {
  const [cost, setCost] = useState(item.cost || "");
  const [service, setService] = useState(item.service || "");

  const handleSelect = (value: string) => {
    const [selectedService, selectedCost] = value.split("#");
    setService(selectedService);
    setCost(selectedCost);
    handleUpdateValue(item.id, selectedService, selectedCost);
  };

  return (
    <View className="p-6 space-y-4 dark:bg-card rounded-md mx-auto mb-8">
      <View>
        {/* <View className="flex justify-end">
          <Button
            type="button"
            variant="danger"
            className="px-2 py-1"
            onClick={() => handleRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </View> */}

        <View className="flex justify-between items-center gap-2 ">
          {/* Dropdown Selector */}
          <View className="w-full flex-1">
            <SingleSelector
              label={item.selectDropDown.label}
              id={`${item.selectDropDown.name}_${index}`}
              options={item.selectDropDown.options || []}
              placeholder={
                item.selectDropDown.placeholder ||
                `Select ${item.selectDropDown.label}`
              }
              value={service}
              onChange={handleSelect}
            />
          </View>

          {/* Cost Input (Read-only) */}
          <View className="w-full flex-1">
            <label className="block text-sm font-medium mb-1">
              {item.input.label}
              {item.input.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <Input
              value={cost}
              readOnly={true}
              type={item.input.type}
              placeholder={item.input.placeholder}
            />
          </View>
          <View className="flex items-end mt-6">
            <Button
              type="button"
              variant="danger"
              onClick={() => handleRemove(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddCostInput;
