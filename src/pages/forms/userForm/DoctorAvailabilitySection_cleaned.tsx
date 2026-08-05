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
    hMin: 5,
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
const SESSION_DURATIONS: Record<string, number> = {
  morning: 60,
  afternoon: 30,
  evening: 30,
};

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

const SLOT_SEP = "|";
const toSlotStr = (start: string, end: string): string =>
  `${start}${SLOT_SEP}${end}`;
const parseSlot = (s: string): { start: string; end: string } => {
  const idx = s.indexOf(SLOT_SEP);
  return idx === -1
    ? { start: s, end: "" }
    : { start: s.slice(0, idx), end: s.slice(idx + 1) };
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

// â”€â”€ Time dropdown options (30-min intervals) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// const TIME_OPTIONS: { value: string; label: string }[] = (() => {
//   const opts: { value: string; label: string }[] = [];
//   for (let h = 0; h < 24; h++) {
//     for (let m = 0; m < 60; m += 30) {
//       const hh = String(h).padStart(2, "0");
//       const mm = String(m).padStart(2, "0");
//       opts.push({ value: `${hh}:${mm}`, label: to12h(`${hh}:${mm}`) });
//     }
//   }
//   return opts;
// })();

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

const addMinutesToTime = (time: string, minutes: number): string => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const capped = Math.min(total, 23 * 60 + 30);
  return `${String(Math.floor(capped / 60)).padStart(2, "0")}:${String(capped % 60).padStart(2, "0")}`;
};

// ── Per-day session helpers ────────────────────────────────────────────────
const DAY_SLOT_SEP = ":";

const buildDaySessions = (slots: string[]): Record<string, SessionState[]> => {
  const result: Record<string, SessionState[]> = {};
  for (const dayConfig of DAYS) {
    const prefix = dayConfig.full + DAY_SLOT_SEP;
    const daySlots = slots
      .filter((s) => s.startsWith(prefix))
      .map((s) => s.slice(prefix.length));
    result[dayConfig.full] = buildDaySessions_inner(daySlots);
  }
  return result;
};

const buildDaySessions_inner = (slots: string[]): SessionState[] =>
  SESSIONS_CONFIG.map((s) => {
    const match = slots.find((slot) => {
      const startH = parseInt(parseSlot(slot).start.split(":")[0], 10);
      return startH >= s.hMin && startH < s.hMax;
    });
    if (match) {
      const { start, end } = parseSlot(match);
      return {
        key: s.key,
        label: s.label,
        start,
        end,
        slotDuration: SESSION_DURATIONS[s.key] ?? 30,
        active: true,
      };
    }
    return {
      key: s.key,
      label: s.label,
      start: s.defaultStart,
      end: s.defaultEnd,
      slotDuration: SESSION_DURATIONS[s.key] ?? 30,
      active: false,
    };
  });

// const buildSessions = (slots: string[]): SessionState[] =>
//   SESSIONS_CONFIG.map((s) => {
//     const match = slots.find((slot) => {
//       const startH = parseInt(parseSlot(slot).start.split(":")[0], 10);
//       return startH >= s.hMin && startH < s.hMax;
//     });
//     if (match) {
//       const { start, end } = parseSlot(match);
//       return { key: s.key, label: s.label, start, end, slotDuration: SESSION_DURATIONS[s.key] ?? 30, active: true };
//     }
//     return {
//       key: s.key,
//       label: s.label,
//       start: s.defaultStart,
//       end: s.defaultEnd,
//       slotDuration: SESSION_DURATIONS[s.key] ?? 30,
//       active: false,
//     };
//   });

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
  const safeAvailableDays = safeArr(values?.available_days);
  const safeTimeSlots = safeArr(values?.available_time_slots);
  const safeNotAvailableDates = safeArr(values?.not_available_dates);

  // -- Session state (per-day) --------------------------------------------------
  const [daySessions, setDaySessions] = useState<
    Record<string, SessionState[]>
  >(() => buildDaySessions(safeTimeSlots));
  const [globalSlotDuration, setGlobalSlotDuration] = useState(30);
  const skipSyncRef = useRef(false);

  // Re-sync when values load externally (e.g., edit form async API response)
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setDaySessions(buildDaySessions(safeTimeSlots));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values?.available_time_slots)]);

  const applyDaySessionChange = (day: string, next: SessionState[]) => {
    skipSyncRef.current = true;
    const updated = { ...daySessions, [day]: next };
    setDaySessions(updated);
    const newSlots: string[] = [];
    for (const [dayName, sess] of Object.entries(updated)) {
      for (const s of sess.filter((s) => s.active)) {
        newSlots.push(`${dayName}${DAY_SLOT_SEP}${toSlotStr(s.start, s.end)}`);
      }
    }
    onSetHandler("available_time_slots", newSlots);
  };

  const toggleDaySession = (day: string, key: string) => {
    const curr = daySessions[day] ?? buildDaySessions_inner([]);
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
    const curr = daySessions[day] ?? buildDaySessions_inner([]);
    if (field === "start") {
      applyDaySessionChange(
        day,
        curr.map((s) =>
          s.key === key
            ? {
                ...s,
                start: val,
                end: addMinutesToTime(val, globalSlotDuration),
              }
            : s,
        ),
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
        end: s.active ? addMinutesToTime(s.start, duration) : s.end,
      }));
    }
    skipSyncRef.current = true;
    setDaySessions(updated);
    const newSlots: string[] = [];
    for (const [dayName, sess] of Object.entries(updated)) {
      for (const s of sess.filter((s) => s.active)) {
        newSlots.push(`${dayName}${DAY_SLOT_SEP}${toSlotStr(s.start, s.end)}`);
      }
    }
    onSetHandler("available_time_slots", newSlots);
  };

  // â”€â”€ Day / date handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const toggleDay = (day: string) => {
    if (readOnly) return;
    const next = safeAvailableDays.includes(day)
      ? safeAvailableDays.filter((d) => d !== day)
      : [...safeAvailableDays, day];
    onSetHandler("available_days", next);
  };

  const toggleDate = (dateStr: string) => {
    if (readOnly) return;
    const next = safeNotAvailableDates.includes(dateStr)
      ? safeNotAvailableDates.filter((d) => d !== dateStr)
      : [...safeNotAvailableDates, dateStr];
    onSetHandler("not_available_dates", next);
  };

  const activeDayCount = safeAvailableDays.length;
  // For readOnly summary: gather unique active sessions from Monday (or first available day)
  const summaryDaySessions =
    daySessions[DAYS[0].full] ?? buildDaySessions_inner([]);
  const activeSessions = summaryDaySessions.filter((s) => s.active);

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
          /* Read-only: compact summary chips */
          <View className="space-y-3">
            <View>
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
            </View>
            <View>
              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Sessions
              </Text>
              {activeSessions.length === 0 ? (
                <Text className="text-sm text-slate-400 italic">
                  No sessions configured.
                </Text>
              ) : (
                <View className="flex flex-wrap gap-1.5">
                  {activeSessions.map((s) => (
                    <span
                      key={s.key}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium"
                    >
                      <span className="flex items-center">
                        {getSessionIcon(s.key)}
                      </span>
                      <span>
                        {s.label}: {to12h(s.start)} &ndash; {to12h(s.end)}
                      </span>
                    </span>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          /* Edit: Weekly Schedule grid */
          <View className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <View className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <View>
                <Text className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Weekly Schedule
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Set your active days and consultation sessions
                </Text>
              </View>
              <View className="flex items-center gap-2">
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
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
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
                    {(daySessions[day.full] ?? buildDaySessions_inner([])).map(
                      (session) => (
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
                      ),
                    )}
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
              Not Available Dates
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
