import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import View from "@/components/view";
import Input from "@/components/input";
import Select from "@/components/Select";
import { Calendar } from "lucide-react";

interface FilterOption {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface CustomFilterProps {
  title?: string;
  onResetFilter: () => void;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  filterOptions: FilterOption[];
  onFilterApiCall: (data: any) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const CustomFilter: React.FC<CustomFilterProps> = ({
  title = "Filter",
  footer,
  size = "md",
  filterOptions,
  onFilterApiCall,
  onResetFilter,
  showCloseButton = true,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resetFilter, setResetFilter] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let data: Record<string, any> = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    onFilterApiCall(data);
    onCloseHandler();
    setResetFilter(true);
  };

  const onCloseHandler = () => {
    setModalOpen(false);
  };

  const handleInputChange = (name: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderFilterControl = (option: FilterOption, index: number) => {
    switch (option.type) {
      case "text":
      case "number":
        return (
          <View className="w-full my-4" key={index}>
            <Input 
              name={option.name}
              label={option.label}
              placeholder={option.placeholder || `Enter ${option.label}`}
              type={option.type}
              value={filterValues[option.name] || ""}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
            />
          </View>
        );
      
      case "select":
        return (
          <View className="w-full my-4" key={index}>
            <Select
              name={option.name}
              label={option.label}
              placeholder={option.placeholder || `Select ${option.label}`}
              options={option.options || []}
              value={filterValues[option.name] || ""}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
            />
          </View>
        );
      
      case "date":
        return (
          <View className="w-full my-4" key={index}>
            <Input
              name={option.name}
              label={option.label}
              placeholder={option.placeholder || `Select ${option.label}`}
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              value={filterValues[option.name] || ""}
              onChange={(e) => handleInputChange(option.name, e.target.value)}
              rightIcon={<Calendar size={16} />}
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {/* <Button
        variant="primary"
        size="small"
        className="flex items-center gap-2"
        onPress={() => {
          setModalOpen(true);
        }}
      >
        Filter
      </Button> */}
      <Button
        variant="outline"
        size="small"
        className="flex items-center gap-2 px-3 py-2 text-xs"
        onPress={() => {
          setModalOpen(true);
        }}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
      </Button>
      {resetFilter && (
        <Button
          variant="secondary"
          size="small"
          className="flex items-center gap-2"
          onPress={() => {
            onResetFilter();
            setResetFilter(false);
            setFilterValues({});
          }}
        >
          Reset
        </Button>
      )}
      <Modal
        size={size}
        title={title}
        footer={footer}
        isOpen={modalOpen}
        onClose={onCloseHandler}
        showCloseButton={showCloseButton}
      >
        <form onSubmit={onSubmitHandler}>
          {filterOptions.map((option, index) => renderFilterControl(option, index))}
          <View className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onPress={onCloseHandler}>Close</Button>
            <Button type="submit" variant="primary">Apply Filter</Button>
          </View>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default CustomFilter;