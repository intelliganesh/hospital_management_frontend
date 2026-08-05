import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useSearchParams } from "react-router-dom";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

interface DateRangePickerProps {
  onDateChange?: (range: DateRange) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  className?: string;
  placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateChange,
  // initialStartDate = null,
  // initialEndDate = null,
  className = "",
  placeholder = "Select date range",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const startDateParam = searchParams.get("from_date");
  const startDate1 = startDateParam ? new Date(startDateParam) : null;
  const endDateParam = searchParams.get("to_date");
  const endDate1 = endDateParam ? new Date(endDateParam) : null;
  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);

  const [isOpen, setIsOpen] = useState(false);
  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      if (onDateChange) onDateChange({ startDate: day, endDate: null });
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
        if (onDateChange) onDateChange({ startDate: day, endDate: startDate });
      } else {
        setEndDate(day);
        if (onDateChange) onDateChange({ startDate, endDate: day });
      }
    }
  };

  const handleDone = () => {
    if (startDate) {
      searchParams.set("from_date", dayjs(startDate).format("YYYY-MM-DD"));
      // searchParams.set("from_date", startDate.toISOString().split("T")[0]);
    } else {
      searchParams.delete("from_date");
    }

    if (endDate) {
      searchParams.set("to_date", dayjs(endDate).format("YYYY-MM-DD"));

      // searchParams.set("to_date", endDate.toISOString().split("T")[0]);
    } else {
      searchParams.delete("to_date");
    }

    setSearchParams(searchParams);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    searchParams.delete("from_date");
    searchParams.delete("to_date");
    setSearchParams(searchParams);
    if (onDateChange) onDateChange({ startDate: null, endDate: null });
  };

  const formatDateRange = () => {
    if (!startDate) return placeholder;
    if (!endDate) return `${startDate.toLocaleDateString()} - Select end date`;
    return `${
      typeof startDate === "string" ? startDate : startDate.toLocaleDateString()
    } - ${
      typeof endDate === "string" ? endDate : endDate.toLocaleDateString()
    }`;
  };

  const selectedRange =
    startDate && endDate
      ? { from: startDate, to: endDate }
      : startDate
      ? { from: startDate, to: startDate }
      : undefined;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="flex items-center justify-between px-2 py-1 border border-gray-300 rounded-md cursor-pointer bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-48"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={
            startDate
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400"
          }
        >
          {formatDateRange()}
        </span>
        <div className="flex items-center space-x-2">
          {startDate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="text-black font-extrabold text-lg hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="text-gray-400">📅</span>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-w-[90vw]">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Date Range
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-gray-500 mb-3 dark:text-gray-400">
                {!startDate && "Click a date to select start date"}
                {startDate &&
                  !endDate &&
                  "Click another date to select end date"}
                {startDate && endDate && "Click a date to select new range"}
              </div>

              <DayPicker
                key={`${startDate ?? "none"}-${endDate ?? "none"}`}
                mode="range"
                selected={selectedRange}
                onDayClick={handleDayClick}
                classNames={{
                  // selected: "bg-primary text-white",
                  today: "text-primary font-bold",
                  nav_button: "text-primary hover:bg-primary-600 rounded",
                }}
                modifiers={{
                  ...(startDate && { start: startDate }),
                  ...(endDate && { end: endDate }),
                  ...(selectedRange && { range: selectedRange }),
                }}
                modifiersStyles={{
                  start: {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "6px 0 0 6px",
                  },
                  end: {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "0 6px 6px 0",
                  },
                  range: {
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                  },
                }}
                styles={{
                  root: {
                    fontSize: "12px",
                  },
                  table: {
                    width: "100%",
                    maxWidth: "240px",
                  },
                  day: {
                    margin: "1px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "26px",
                    height: "26px",
                    fontSize: "11px",
                  },
                }}
              />

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  disabled={!startDate}
                >
                  Clear
                </button>
                <button
                  onClick={handleDone}
                  className="px-3 py-1.5 bg-primary text-white text-xs rounded-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
