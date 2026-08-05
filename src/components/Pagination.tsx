import React from "react";
import Button from "./button";
import View from "./view";

interface PaginationProps {
  last_page?: number;
  current_page?: number;
  getPageNumberHandler?: (pageNuber: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  last_page = 1,
  current_page = 1,
  getPageNumberHandler,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= last_page && getPageNumberHandler) {
      getPageNumberHandler(page);
    }
  };

  // Function to generate page numbers with ellipsis
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Maximum number of page buttons to show
    
    if (last_page <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (current_page <= 4) {
        // Show pages 1-5 and ellipsis + last page
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(last_page);
      } else if (current_page >= last_page - 3) {
        // Show first page + ellipsis and last 5 pages
        pages.push('...');
        for (let i = last_page - 4; i <= last_page; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current range + ellipsis + last page
        pages.push('...');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(last_page);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <View>
      <View className="flex items-center gap-1 justify-end py-2">
        <Button
          variant="outline"
          size="small"
          disabled={current_page === 1}
          onPress={() => handlePageChange(current_page - 1)}
          className="px-3 py-1.5 text-xs flex items-center gap-0 flex-shrink-0"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>

        <View className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2.5 py-1.5 text-xs min-w-[32px] h-8 flex items-center justify-center text-slate-400"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <Button
                variant={pageNum === current_page ? "primary" : "ghost"}
                size="small"
                key={pageNum}
                onPress={() => handlePageChange(pageNum)}
                className={`
                  px-2.5 py-1.5 text-xs min-w-[32px] h-8 flex-shrink-0
                  ${pageNum === current_page
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }
                `}
              >
                {pageNum}
              </Button>
            );
          })}
        </View>

        <Button
          variant="outline"
          size="small"
          disabled={current_page === last_page}
          onPress={() => handlePageChange(current_page + 1)}
          className="px-3 py-1.5 text-xs flex items-center flex-shrink-0"
        >
          Next
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </View>
    </View>
  );
};

export default PaginationComponent;