import React, { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import View from "@/components/view";
import Text from "@/components/text";
import { UserInterface } from "@/interfaces/users";
import {
  Calendar,
  CalendarX,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Timer,
  X,
} from "lucide-react";

// â”€â”€ Day definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DAYS = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
];

// â”€â”€ Session definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface SessionConfig {
  key: string;
  label: string;
  emoji: string;
  defaultStart: string;
  defaultEnd: string;
  hMin: number;
  hMax: number;
}

const SESSIONS_CONFIG: SessionConfig[] = [
  {
    key: "morning",
    label: "Morning",
    emoji: "ðŸŒ…",
    defaultStart: "09:00",
    defaultEnd: "13:00",
    hMin: 0,
    hMax: 12,
  },
  {
    key: "afternoon",
    label: "Afternoon",
    emoji: "â˜€ï¸",
    defaultStart: "14:00",
    defaultEnd: "17:00",
    hMin: 12,
    hMax: 17,
  },
  {
    key: "evening",
    label: "Evening",
    emoji: "ðŸŒ™",
    defaultStart: "17:00",
    defaultEnd: "21:00",
    hMin: 17,
    hMax: 24,
  },
];

// â”€â”€ Time helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SLOT_DURATIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1.5 hr" },
  { value: 120, label: "2 hr" },
];

const getSessionIcon = (key: string, cls = "w-3.5 h-3.5") => {
  if (key === "morning") return <Sunrise className={cls} />;
  if (key === "afternoon") return <Sun className={cls} />;
  return <Sunset className={cls} />;
};

const to12h = (t: string): string => {
  if (!t || !t.includes(":")) return t || "";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return t;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
};

// â”€â”€ Session state helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface SessionState {
  key: string;
  label: string;
  start: string;
  end: string;
  slotDuration: number;
  active: boolean;
}

const safeArr = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
};

// const addMinutesToTime = (time: string, minutes: number): string => {
//   const [h, m] = time.split(":").map(Number);
//   const total = h * 60 + m + minutes;
//   const capped = Math.min(total, 23 * 60 + 30);
//   return `${String(Math.floor(capped / 60)).padStart(2, "0")}:${String(capped % 60).padStart(2, "0")}`;
// };

// ── Per-day session helpers ────────────────────────────────────────────────
// Storage format:
// { "Monday": { "morning": ["09:00","13:00"], "afternoon": ["14:00","17:00"] }, ... }
// Active days  = Object.keys(available_days)
// Active sessions for a day = Object.keys(available_days[day])

type AvailabilityData = Record<string, Record<string, string[]>>;

// Parse available_days → AvailabilityData, handling JSON strings from the API.
const parseAvailableDays = (val: unknown): AvailabilityData => {
  if (typeof val === "string") {
    try {
      return parseAvailableDays(JSON.parse(val));
    } catch {
      return {};
    }
  }
  if (val && typeof val === "object" && !Array.isArray(val))
    return val as AvailabilityData;
  return {};
};

// Extract active day names from available_days (string or AvailabilityData).
const getActiveDays = (val: unknown): string[] =>
  Object.keys(parseAvailableDays(val));

// Convert internal daySessions → AvailabilityData for storage.
// All activeDays are always present as keys (even with {} when no sessions active)
// so getActiveDays can always recover the enabled-day list.
const toGrouped = (
  sessions: Record<string, SessionState[]>,
  activeDays: string[],
): AvailabilityData => {
  const result: AvailabilityData = {};
  for (const dayName of activeDays) {
    const sess = sessions[dayName] ?? [];
    const daySess: Record<string, string[]> = {};
    for (const s of sess) {
      if (s.active) daySess[s.key] = [s.start, s.end];
    }
    result[dayName] = daySess;
  }
  return result;
};

// Build internal daySessions from AvailabilityData.
const buildDaySessions = (
  data: AvailabilityData,
  slotDuration = 30,
): Record<string, SessionState[]> => {
  const result: Record<string, SessionState[]> = {};
  for (const dayConfig of DAYS) {
    const daySess = data[dayConfig.full] ?? {};
    result[dayConfig.full] = SESSIONS_CONFIG.map((s) => {
      const times = daySess[s.key]; // ["09:00", "13:00"]
      if (times && times.length >= 2) {
        return {
          key: s.key,
          label: s.label,
          start: times[0],
          end: times[1],
          slotDuration,
          active: true,
        };
      }
      return {
        key: s.key,
        label: s.label,
        start: s.defaultStart,
        end: s.defaultEnd,
        slotDuration,
        active: false,
      };
    });
  }
  return result;
};

// â”€â”€ Mini inline calendar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DAY_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MiniCalendarProps {
  selectedDates: string[];
  onToggle: (date: string) => void;
  readOnly?: boolean;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDates,
  onToggle,
  readOnly = false,
}) => {
  const [viewMonth, setViewMonth] = useState<Dayjs>(dayjs().startOf("month"));

  const today = dayjs().format("YYYY-MM-DD");
  const daysInMonth = viewMonth.daysInMonth();
  const startWeekday = viewMonth.startOf("month").day(); // 0 = Sunday

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const remainder = cells.length % 7;
  if (remainder !== 0) cells.push(...Array(7 - remainder).fill(null));

  return (
    <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-4 select-none w-full max-w-xs shrink-0">
      {/* Header */}
      <View className="flex items-center justify-between mb-4">
        <Text className="text-base font-bold text-slate-900 dark:text-slate-100">
          {viewMonth.format("MMMM YYYY")}
        </Text>
        <View className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMonth((v) => v.subtract(1, "month"))}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth((v) => v.add(1, "month"))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </View>
      </View>

      {/* Day-of-week headers */}
      <View className="grid grid-cols-7 mb-1">
        {DAY_HEADER.map((d, i) => (
          <View key={d} className="flex items-center justify-center">
            <Text
              className={`text-[11px] font-semibold ${
                i === 6 ? "text-primary" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Date grid */}
      <View className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) return <View key={`blank-${idx}`} />;
          const dateStr = viewMonth.date(day).format("YYYY-MM-DD");
          const isSelected = selectedDates.includes(dateStr);
          const isToday = dateStr === today;
          const isPast = dayjs(dateStr).isBefore(dayjs(), "day");

          return (
            <View
              key={dateStr}
              className="flex items-center justify-center py-0.5"
            >
              <button
                type="button"
                disabled={readOnly || isPast}
                onClick={() => onToggle(dateStr)}
                title={
                  isPast
                    ? undefined
                    : isSelected
                      ? `Remove ${dateStr}`
                      : `Mark ${dateStr} unavailable`
                }
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150",
                  isSelected
                    ? "bg-primary text-white shadow-sm scale-105"
                    : isToday
                      ? "border-2 border-primary text-primary font-bold"
                      : isPast
                        ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                        : "text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary cursor-pointer",
                  readOnly ? "cursor-not-allowed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {day}
              </button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Main section component
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DoctorAvailabilitySectionProps {
  values: Partial<UserInterface>;
  onSetHandler: (name: string, value: any) => void;
  readOnly?: boolean;
  hideHeader?: boolean;
}

const DoctorAvailabilitySection: React.FC<DoctorAvailabilitySectionProps> = ({
  values,
  onSetHandler,
  readOnly = false,
  hideHeader = false,
}) => {
  const safeAvailableDays = getActiveDays(values?.available_days);
  const rawAvailableDays = parseAvailableDays(values?.available_days);
  const safeNotAvailableDates = safeArr(values?.leave_date);
  // slot_duration may arrive as a string from the API; treat missing/NaN as null
  const parsedSlotDuration = Number(values?.slot_duration);
  const resolvedSlotDuration =
    !isNaN(parsedSlotDuration) && parsedSlotDuration > 0
      ? parsedSlotDuration
      : null;

  // -- Session state (per-day) --------------------------------------------------
  const initSlotDuration = resolvedSlotDuration ?? 30;
  const [daySessions, setDaySessions] = useState<
    Record<string, SessionState[]>
  >(() => buildDaySessions(rawAvailableDays, initSlotDuration));
  const [globalSlotDuration, setGlobalSlotDuration] =
    useState<number>(initSlotDuration);
  const skipSyncRef = useRef(false);

  // Re-sync when values load externally (e.g., edit form async API response)
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setDaySessions(
      buildDaySessions(
        parseAvailableDays(values?.available_days),
        globalSlotDuration,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values?.available_days)]);

  useEffect(() => {
    if (resolvedSlotDuration !== null)
      setGlobalSlotDuration(resolvedSlotDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.slot_duration]);

  const applyDaySessionChange = (day: string, next: SessionState[]) => {
    skipSyncRef.current = true;
    const updated = { ...daySessions, [day]: next };
    setDaySessions(updated);
    onSetHandler("available_days", toGrouped(updated, safeAvailableDays));
  };

  const toggleDaySession = (day: string, key: string) => {
    const curr = daySessions[day] ?? [];
    applyDaySessionChange(
      day,
      curr.map((s) => (s.key === key ? { ...s, active: !s.active } : s)),
    );
  };

  const updateDaySessionTime = (
    day: string,
    key: string,
    field: "start" | "end",
    val: string,
  ) => {
    const curr = daySessions[day] ?? [];
    if (field === "start") {
      applyDaySessionChange(
        day,
        curr.map((s) => (s.key === key ? { ...s, start: val } : s)),
      );
    } else {
      applyDaySessionChange(
        day,
        curr.map((s) => (s.key === key ? { ...s, end: val } : s)),
      );
    }
  };

  const handleGlobalDurationChange = (duration: number) => {
    setGlobalSlotDuration(duration);
    const updated: Record<string, SessionState[]> = {};
    for (const [dayName, sess] of Object.entries(daySessions)) {
      updated[dayName] = sess.map((s) => ({
        ...s,
        slotDuration: duration,
      }));
    }
    skipSyncRef.current = true;
    setDaySessions(updated);
    onSetHandler("available_days", toGrouped(updated, safeAvailableDays));
    onSetHandler("slot_duration", duration);
  };

  // â”€â”€ Day / date handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const toggleDay = (day: string) => {
    if (readOnly) return;
    const nextDays = safeAvailableDays.includes(day)
      ? safeAvailableDays.filter((d) => d !== day)
      : [...safeAvailableDays, day];
    // Single write: nextDays are the keys, slots come from daySessions
    onSetHandler("available_days", toGrouped(daySessions, nextDays));
  };

  const toggleDate = (dateStr: string) => {
    if (readOnly) return;
    const next = safeNotAvailableDates.includes(dateStr)
      ? safeNotAvailableDates.filter((d) => d !== dateStr)
      : [...safeNotAvailableDates, dateStr];
    onSetHandler("leave_date", next);
  };

  const activeDayCount = safeAvailableDays.length;

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <View
      className={
        hideHeader
          ? ""
          : "mt-8 border-t border-slate-200 dark:border-slate-700 pt-6"
      }
    >
      {!hideHeader && (
        <View className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <Text
            as="h3"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Doctor Availability
          </Text>
        </View>
      )}

      <View className="space-y-6">
        {/* â”€â”€ 1. Weekly Schedule â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {readOnly ? (
          /* Read-only: per-day schedule */
          <View className="space-y-3">
            {/* Available days chips */}
            {/* <View>
              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Available Days
              </Text>
              {activeDayCount === 0 ? (
                <Text className="text-sm text-slate-400 italic">
                  No days configured.
                </Text>
              ) : (
                <View className="flex flex-wrap gap-1.5">
                  {DAYS.filter((d) => safeAvailableDays.includes(d.full)).map(
                    (d) => (
                      <span
                        key={d.full}
                        className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
                      >
                        {d.short}
                      </span>
                    ),
                  )}
                </View>
              )}
            </View> */}

            {/* Per-day session schedule */}
            {activeDayCount > 0 && (
              <View>
                <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Doctor vailable On
                </Text>
                <View className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden">
                  {DAYS.filter((d) => safeAvailableDays.includes(d.full)).map(
                    (d) => {
                      const sessions = (
                        daySessions[d.full] ??
                        buildDaySessions({}, globalSlotDuration)[d.full]
                      ).filter((s) => s.active);
                      return (
                        <View
                          key={d.full}
                          className="flex items-start gap-3 px-3 py-2.5 bg-white dark:bg-slate-800/60"
                        >
                          {/* Day label */}
                          <View className="w-10 shrink-0 pt-0.5">
                            <Text className="text-xs font-bold text-slate-700 dark:text-slate-200">
                              {d.short}
                            </Text>
                          </View>
                          {/* Sessions */}
                          {sessions.length === 0 ? (
                            <Text className="text-xs text-slate-400 italic pt-0.5">
                              No sessions
                            </Text>
                          ) : (
                            <View className="flex flex-wrap gap-1.5">
                              {sessions.map((s) => (
                                <span
                                  key={s.key}
                                  className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-medium"
                                >
                                  {getSessionIcon(s.key, "w-3 h-3")}
                                  {s.label}: {to12h(s.start)}&nbsp;&ndash;&nbsp;
                                  {to12h(s.end)}
                                </span>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    },
                  )}
                </View>
              </View>
            )}
          </View>
        ) : (
          /* Edit: Weekly Schedule grid */
          <View className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <View className="flex items-center flex-wrap gap-x-3 gap-y-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <Text className="text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap mr-auto">
                Weekly Schedule
              </Text>
              <View className="flex items-center gap-2 shrink-0">
                {/* Global slot duration */}
                <View className="flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-slate-500" />
                  <Text className="text-xs font-medium text-slate-500">
                    Slot
                  </Text>
                  <select
                    value={globalSlotDuration}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleGlobalDurationChange(Number(e.target.value))
                    }
                    className="text-xs border border-slate-200 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50"
                  >
                    {SLOT_DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </View>
                {activeDayCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                    {activeDayCount} active{" "}
                    {activeDayCount === 1 ? "day" : "days"}
                  </span>
                )}
              </View>
            </View>

            {/* Day rows */}
            {DAYS.map((day, dayIdx) => {
              const isDayActive = safeAvailableDays.includes(day.full);
              return (
                <View
                  key={day.full}
                  className={`flex items-start gap-3 px-4 py-3 ${
                    dayIdx < DAYS.length - 1
                      ? "border-b border-slate-100 dark:border-slate-700/60"
                      : ""
                  }`}
                >
                  {/* Day label + toggle */}
                  <View className="w-24 shrink-0 flex flex-col gap-1 pt-0.5">
                    <Text
                      className={`text-sm font-semibold leading-tight ${
                        isDayActive
                          ? "text-slate-800 dark:text-slate-100"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {day.full}
                    </Text>
                    {/* Toggle switch */}
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => toggleDay(day.full)}
                      role="switch"
                      aria-checked={isDayActive}
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 ${
                        isDayActive
                          ? "bg-primary"
                          : "bg-slate-200 dark:bg-slate-700"
                      } ${readOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
                          isDayActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <Text
                      className={`text-[10px] font-medium ${
                        isDayActive
                          ? "text-primary"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {isDayActive ? "Available" : "Unavailable"}
                    </Text>
                  </View>

                  {/* Session cards */}
                  <View
                    className={`flex flex-wrap gap-2 flex-1 min-w-0 transition-opacity duration-200 ${
                      !isDayActive ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    {(
                      daySessions[day.full] ??
                      buildDaySessions({}, globalSlotDuration)[day.full]
                    ).map((session) => (
                      <View
                        key={session.key}
                        className={`border rounded-xl p-2.5 flex-1 min-w-[150px] max-w-[210px] transition-all duration-150 ${
                          session.active
                            ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {/* Card header: checkbox + icon + label */}
                        <View className="flex items-center gap-1.5 mb-2">
                          <button
                            type="button"
                            disabled={readOnly || !isDayActive}
                            onClick={() =>
                              toggleDaySession(day.full, session.key)
                            }
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              session.active
                                ? "bg-primary border-primary"
                                : "border-slate-300 dark:border-slate-600 hover:border-primary"
                            } ${readOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {session.active && (
                              <Check
                                className="w-2.5 h-2.5 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                          <span
                            className={`flex items-center shrink-0 ${
                              session.active
                                ? "text-primary"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {getSessionIcon(session.key)}
                          </span>
                          <Text
                            className={`text-xs font-medium leading-none truncate ${
                              session.active
                                ? "text-slate-800 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {session.label}
                          </Text>
                        </View>

                        {/* Start / End time inputs */}
                        <View className="grid grid-cols-2 gap-1.5">
                          <View>
                            <View className="flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Start
                              </Text>
                            </View>
                            <input
                              type="time"
                              value={session.start}
                              disabled={readOnly || !session.active}
                              onChange={(e) =>
                                updateDaySessionTime(
                                  day.full,
                                  session.key,
                                  "start",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-md px-1.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </View>
                          <View>
                            <View className="flex items-center gap-1 mb-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                End
                              </Text>
                            </View>
                            <input
                              type="time"
                              value={session.end}
                              disabled={readOnly || !session.active}
                              onChange={(e) =>
                                updateDaySessionTime(
                                  day.full,
                                  session.key,
                                  "end",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-md px-1.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* â”€â”€ 2. Not Available Dates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <View>
          <View className="flex items-center gap-2 mb-2">
            <CalendarX className="w-4 h-4 text-slate-500" />
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Not Available On
            </Text>
            {!readOnly && (
              <Text className="text-xs text-slate-400">
                (Click dates to mark as unavailable)
              </Text>
            )}
          </View>

          {readOnly ? (
            safeNotAvailableDates.length === 0 ? (
              <Text className="text-sm text-slate-400 italic">
                No exception dates set.
              </Text>
            ) : (
              <View className="flex flex-wrap gap-2">
                {safeNotAvailableDates
                  .slice()
                  .sort()
                  .map((date) => (
                    <View
                      key={date}
                      className="px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-full text-sm"
                    >
                      {dayjs(date).format("D MMM YYYY")}
                    </View>
                  ))}
              </View>
            )
          ) : (
            <View className="flex flex-wrap gap-4 items-start">
              <MiniCalendar
                selectedDates={safeNotAvailableDates}
                onToggle={toggleDate}
              />
              <View className="flex-1 min-w-[180px]">
                {safeNotAvailableDates.length === 0 ? (
                  <View className="flex items-center justify-center min-h-[80px] border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <Text className="text-sm text-slate-400 italic">
                      No unavailable dates selected.
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      {safeNotAvailableDates.length} date
                      {safeNotAvailableDates.length !== 1 ? "s" : ""} marked
                    </Text>
                    <View className="flex flex-wrap gap-2">
                      {safeNotAvailableDates
                        .slice()
                        .sort()
                        .map((date) => (
                          <View
                            key={date}
                            className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-full px-3 py-1 text-sm"
                          >
                            <span>{dayjs(date).format("D MMM YYYY")}</span>
                            <button
                              type="button"
                              onClick={() => toggleDate(date)}
                              className="hover:text-red-900 dark:hover:text-red-100 transition-colors ml-0.5"
                              title="Remove date"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default DoctorAvailabilitySection;
