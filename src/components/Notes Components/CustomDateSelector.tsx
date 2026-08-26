import React, { useState, useEffect, useRef } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";
import dayjs from "dayjs";

export interface CustomDateSelectorProps {
  value?: Date;
  onChange: (date: Date) => void;
  onConfirm?: (date: Date) => void;
  showConfirmButton?: boolean;
  showNavigationButtons?: boolean;
  showCalendarIcon?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
}

const CustomDateSelector: React.FC<CustomDateSelectorProps> = ({
  value,
  onChange,
  onConfirm,
  showConfirmButton = true,
  showNavigationButtons = true,
  showCalendarIcon = true,
  minDate,
  maxDate,
  disabled = false,
  className = "",
  error,
  label,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Generate day, month options
  const days = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: String(i + 1),
  }));

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleDayChange = (day: string) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(parseInt(day));
    setSelectedDate(newDate);
    setPendingConfirm(true);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(month) - 1);
    setSelectedDate(newDate);
    setPendingConfirm(true);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year) && year > 1900 && year < 2100) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(year);
      setSelectedDate(newDate);
      setPendingConfirm(true);
    }
  };

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    onChange(newDate);
    if (onConfirm) onConfirm(newDate);
    setPendingConfirm(false);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    onChange(newDate);
    if (onConfirm) onConfirm(newDate);
    setPendingConfirm(false);
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setPendingConfirm(true);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    if (onConfirm) onConfirm(selectedDate);
    setPendingConfirm(false);
  };

  const openCalendarPicker = () => {
    datePickerRef.current?.showPicker();
  };

  return (
    <View className={`space-y-2 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </Text>
      )}
      <View className="flex items-center gap-2">
        <View className="flex items-center gap-2">
          {/* Previous Date Button */}
        {showNavigationButtons && (
          <Button
            variant="outline"
            onPress={handlePrevDate}
            disabled={disabled}
            className="px-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Calendar Icon */}
        {showCalendarIcon && (
          <Button
            variant="outline"
            onPress={openCalendarPicker}
            disabled={disabled}
            className="px-3"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        )}
        </View>

        <View className="flex items-center gap-2 bg-slate-50 dark:bg-background p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          {/* Hidden Date Picker */}
        <input
          ref={datePickerRef}
          type="date"
          value={dayjs(selectedDate).format("YYYY-MM-DD")}
          onChange={handleCalendarChange}
          className="hidden"
          min={minDate ? dayjs(minDate).format("YYYY-MM-DD") : undefined}
          max={maxDate ? dayjs(maxDate).format("YYYY-MM-DD") : undefined}
        />

        {/* Day Selector */}
        <View className="flex items-center">
          <SingleSelector
            id="day-selector"
            name="day"
            value={String(selectedDate.getDate())}
            onChange={handleDayChange}
            options={days}
            placeholder="DD"
            disabled={disabled}
            className="shadow-sm border-none"
          />
        </View>

        <Text className="text-slate-400">/</Text>

        {/* Month Selector */}
        <View className="flex items-center">
          <SingleSelector
            id="month-selector"
            name="month"
            value={String(selectedDate.getMonth() + 1)}
            onChange={handleMonthChange}
            options={months}
            placeholder="MM"
            disabled={disabled}
            className="shadow-sm border-none"
          />
        </View>

        <Text className="text-slate-400">/</Text>

        {/* Year Input */}
        <View className="flex items-center">
          <Input
            id="year-input"
            name="year"
            type="number"
            value={selectedDate.getFullYear()}
            onChange={handleYearChange}
            placeholder="YYYY"
            disabled={disabled}
            min={1900}
            max={2100}
            className="shadow-sm border-none"
          />
        </View>
        </View>

        <View className="flex items-center gap-2">
          {/* Confirm Button */}
        {showConfirmButton && pendingConfirm && (
          <Button
            onPress={handleConfirm}
            disabled={disabled}
            className="px-3"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}

        {/* Next Date Button */}
        {showNavigationButtons && (
          <Button
            variant="outline"
            onPress={handleNextDate}
            disabled={disabled}
            className="px-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-xs text-red-600 dark:text-red-400">{error}</Text>
      )}

      {/* Selected Date Display */}
      <Text className="text-xs text-slate-500 dark:text-slate-400">
        Selected: {dayjs(selectedDate).format("dddd, MMMM DD, YYYY")}
      </Text>
    </View>
  );
};

export default CustomDateSelector;
