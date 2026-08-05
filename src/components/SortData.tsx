import React from "react";
import View from "./view";
import Select from "./Select";
import { ChevronDown } from 'lucide-react';


export interface SortOption {
  label: string;
  value: string;
  order?:"asc" | "desc";
}

interface DataSortProps {
  sortOptions: SortOption[];
  onSort: (option: SortOption) => void;
  activeSort?: SortOption;
}

const DataSort = ({ sortOptions, onSort, activeSort }: DataSortProps) => {
  const getOptionValue = (option: SortOption) => `${option.value}|${option.order}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [value, order] = e.target.value.split("|");

    const selectedOption = sortOptions.find((opt) => opt.value === value && opt.order === order);
    if (selectedOption) {
      onSort(selectedOption);
    }
  };

  return (
    <View className="flex items-center gap-2">
      <Select
        id="sort-select"
        name="sort"
        placeholder="Sort by"
        rightIcon={<ChevronDown />}
        options={sortOptions.map(option => ({
          ...option,
          value: getOptionValue(option) 
        }))}
        // options={sortOptions}
        value={activeSort ? getOptionValue(activeSort) : ""}
        // value={activeSort ? `${activeSort.value}` : ""}
        onChange={handleChange}
        className="block w-52 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-card dark:bg-card text-gray-700 dark:text-white"
      >
        {/* <option disabled value="">
          Select an option
        </option>
        {sortOptions.map((option) => (
          <option
            key={`${option.value}`}
            value={`${option.value}`}
          >
            {option.label} 
          </option>
        ))} */}
      </Select>
    </View>
  );
};

export default DataSort;
