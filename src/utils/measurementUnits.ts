// Single source of truth for clinical units in the UI. Keep in sync with api/app/Support/MeasurementUnits.php.
export const MEASUREMENT_UNITS: Record<string, string> = {
  bp: "mmHg",
  blood_pressure: "mmHg",
  pulse: "bpm",
  pulse_rate: "bpm",
  heart_rate: "bpm",
  spo2: "%",
  sp_o2: "%",
  temperature: "°F",
  temp: "°F",
  respiratory_rate: "/min",
  rr: "/min",
  weight: "kg",
  height: "cm",
  blood_sugar: "mg/dL",
  rbs: "mg/dL",
  fbs: "mg/dL",
  ppbs: "mg/dL",
  hemoglobin: "g/dL",
  haemoglobin: "g/dL",
  hb: "g/dL",
};

export const unitFor = (key: string): string | undefined =>
  MEASUREMENT_UNITS[key?.toLowerCase().trim()];

/** Append the standard unit unless the value is empty or already has a unit. */
export const withUnit = (key: string, value: unknown): string => {
  const v = value === null || value === undefined ? "" : String(value).trim();
  const unit = unitFor(key);
  if (!v || !unit || /[A-Za-z%°]/.test(v)) return v;
  return `${v} ${unit}`;
};

/** "Pulse (bpm)" style label */
export const labelWithUnit = (label: string, key: string): string => {
  const unit = unitFor(key);
  return unit ? `${label} (${unit})` : label;
};
