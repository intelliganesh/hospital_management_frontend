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
