 import { useState } from "react";
import dayjs from "dayjs";

export const useDateFormater = () => {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  const formatDate = (date: Date | string | null, format: string = "DD-MM-YYYY"): void => {
    if (date) {
      setFormattedDate(dayjs(date).format(format));
    }
  };
  const formatTime = (time: string | null, format: string = "HH:mm:ss"): void => {
    if (time) {
      setFormattedTime(dayjs(time, "HH:mm:ss").format(format));
    }
  };
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  return {
    formatDate,
    formatTime,
    formattedDate,
    formattedTime,
    getCurrentDateTimeLocal,
  };
};
