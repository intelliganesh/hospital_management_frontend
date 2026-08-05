// Tab color configuration for consultation form
// Using light gradient backgrounds like dashboard KPI icons

export const TAB_COLORS = {
  patientDetails: {
    name: "Chief Complaints",
    primary: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300",
    borderColor: "border-purple-300",
    primaryHover: "hover:from-purple-200 hover:via-purple-300 hover:to-purple-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-purple-600 dark:via-purple-700 dark:to-purple-800",
    textColor: "!text-purple-700 dark:!text-purple-300",
    shadow: "shadow-md shadow-purple-500/25 dark:shadow-purple-400/20",
  },
  examination: {
    name: "Examination",
    primary: "bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300",
    borderColor: "border-indigo-300",
    primaryHover:
      "hover:from-indigo-200 hover:via-indigo-300 hover:to-indigo-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-indigo-600 dark:via-indigo-700 dark:to-indigo-800",
    textColor: "!text-indigo-700 dark:!text-indigo-300",
    shadow: "shadow-md shadow-indigo-500/25 dark:shadow-indigo-400/20",
  },
  fistula: {
    name: "Fistula",
    borderColor: "border-fuchsia-300",
    primary:
      "bg-gradient-to-br from-fuchsia-100 via-fuchsia-200 to-fuchsia-300",
    primaryHover:
      "hover:from-fuchsia-200 hover:via-fuchsia-300 hover:to-fuchsia-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-fuchsia-600 dark:via-fuchsia-700 dark:to-fuchsia-800",
    textColor: "!text-fuchsia-700 dark:!text-fuchsia-300",
    shadow: "shadow-md shadow-fuchsia-500/25 dark:shadow-fuchsia-400/20",
  },
  management: {
    name: "Management",
    primary: "bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300",
    borderColor: "border-orange-300",
    primaryHover:
      "hover:from-orange-200 hover:via-orange-300 hover:to-orange-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-orange-600 dark:via-orange-700 dark:to-orange-800",
    textColor: "!text-orange-700 dark:!text-orange-300",
    shadow: "shadow-md shadow-orange-500/25 dark:shadow-orange-400/20",
  },
  treatmentPlan: {
    name: "Treatment Plan",
    primary: "bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300",
    borderColor: "border-teal-300",
    primaryHover: "hover:from-teal-200 hover:via-teal-300 hover:to-teal-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-teal-600 dark:via-teal-700 dark:to-teal-800",
    textColor: "!text-teal-700 dark:!text-teal-300",
    shadow: "shadow-md shadow-teal-500/25 dark:shadow-teal-400/20",
  },
  medicineLifestyle: {
    name: "Test, Medicines & Lifestyle",
    primary: "bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300",
    borderColor: "border-violet-300",
    primaryHover:
      "hover:from-violet-200 hover:via-violet-300 hover:to-violet-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-violet-600 dark:via-violet-700 dark:to-violet-800",
    textColor: "!text-violet-700 dark:!text-violet-300",
    shadow: "shadow-md shadow-violet-500/25 dark:shadow-violet-400/20",
  },
  documents: {
    name: "Documents",
    primary: "bg-gradient-to-br from-lime-100 via-lime-200 to-lime-300",
    borderColor: "border-lime-300",
    primaryHover: "hover:from-lime-200 hover:via-lime-300 hover:to-lime-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-lime-600 dark:via-lime-700 dark:to-lime-800",
    textColor: "!text-lime-700 dark:!text-lime-300",
    shadow: "shadow-md shadow-amber-500/25 dark:shadow-amber-400/20",
  },
  consultationBilling: {
    name: "Payment & Follow-up",
    primary:
      "bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300",
    borderColor: "border-emerald-300",
    primaryHover:
      "hover:from-emerald-200 hover:via-emerald-300 hover:to-emerald-400",
    darkPrimary:
      "dark:!bg-gradient-to-br dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800",
    textColor: "!text-emerald-700 dark:!text-emerald-300",
    shadow: "shadow-md shadow-emerald-500/25 dark:shadow-emerald-400/20",
  },
} as const;

export type TabSection = keyof typeof TAB_COLORS;
