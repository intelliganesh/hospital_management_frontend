import { SortOption } from "@/components/SortData";
import { SetURLSearchParams } from "react-router-dom";
import { toast } from "./custom-hooks/use-toast";

// function to handle sorts
export const handleSortChange = (
    option: SortOption,
    setActiveSort: React.Dispatch<React.SetStateAction<SortOption | null>>,
    setSearchParams: SetURLSearchParams,
    searchParams: URLSearchParams
) => {
    setActiveSort(option);
    if(option.order){
        setSearchParams(
            {
                ...Object.fromEntries([...searchParams]),
                currentPage: "1",
                sort_by: option.value,
                sort_order: option.order,
            },
            { replace: true }
        );
    }
};

export const commanButtonStyle = "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200";

export const dynamicTableCardStyle = "overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800";

export const formSubmissionFailMessage = (
    description = "Some information is missing or incorrect. Check the fields and try again."
) => toast({
        title: "Form submition failed",
        variant: "destructive",
        description
})

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// removes the unit (e.g. "98.6 °F" -> "98.6") so only the value is shown in the field
export const removeUnit = (value: any, unit: string) => {
    if (value === null || value === undefined) return value;
    const unitWithoutSymbol = unit.replace("°", "");
    return String(value)
        .replace(new RegExp(`\\s*°?(${escapeRegExp(unit)}|${escapeRegExp(unitWithoutSymbol)})\\s*$`, "i"), "")
        .trim();
};

// appends the unit to the value (e.g. "98.6" -> "98.6 °F") before sending to backend
export const appendUnit = (value: any, unit: string) => {
    const cleanValue = removeUnit(value, unit);
    if (cleanValue === null || cleanValue === undefined || cleanValue === "") return cleanValue;
    return `${cleanValue} ${unit}`;
};
