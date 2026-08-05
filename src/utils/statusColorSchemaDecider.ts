import { GenericStatus } from "@/interfaces";

// Type definition for simplified color scheme
export type StatusColorScheme = {
  background: string;
  color: string; // Same color for text and border
};

// Individual color mapping for each GenericStatus
export const statusColorMap: Partial<Record<GenericStatus, StatusColorScheme>> =
  {
    // ✅ Success statuses - Greens & Teals
    [GenericStatus.COMPLETED]: {
      background: "#ECFDF5",
      color: "#059669",
    },
    [GenericStatus.RESOLVED]: {
      background: "#D1FAE5",
      color: "#047857",
    },
    [GenericStatus.APPROVED]: {
      background: "#DCFCE7",
      color: "#16A34A",
    },
    [GenericStatus.STABLE]: {
      background: "#CCFBF1",
      color: "#0D9488",
    },
    [GenericStatus.PAYMENT_COMPLETED]: {
      background: "#DCFCE7",
      color: "#15803D",
    },
    [GenericStatus.SURGERY_COMPLETED]: {
      background: "#DCFCE7",
      color: "#15803D",
    },
    [GenericStatus.DISCHARGED]: {
      background: "#D1FAE5",
      color: "#059669",
    },
    [GenericStatus.ROOM_AVAILABLE]: {
      background: "#DCFFE4",
      color: "#22C55E",
    },
    [GenericStatus.OPEN]: {
      background: "#F0FDF4",
      color: "#22C55E",
    },

    // ⚠️ Warning or pending - Ambers & Oranges
    [GenericStatus.PENDING]: {
      background: "#FEF3C7",
      color: "#D97706",
    },
    [GenericStatus.WAITING]: {
      background: "#FFFBEB",
      color: "#B45309",
    },
    [GenericStatus.FOLLOW_UP]: {
      background: "#FEF9C3",
      color: "#CA8A04",
    },
    [GenericStatus.FOLLOW_UP_REQUIRED]: {
      background: "#FFEDD5",
      color: "#EA580C",
    },
    [GenericStatus.UNDER_OBSERVATION]: {
      background: "#FEF9C3",
      color: "#CA8A04",
    },
    [GenericStatus.ADMISSION_PENDING]: {
      background: "#FEF3C7",
      color: "#D97706",
    },
    [GenericStatus.DISCHARGE_PENDING]: {
      background: "#FEF3C7",
      color: "#D97706",
    },

    // 🧠 Info or progress - Blues
    [GenericStatus.ACTIVE]: {
      background: "#DBEAFE",
      color: "#2563EB",
    },
    [GenericStatus.STARTED]: {
      background: "#E0F2FE",
      color: "#0284C7",
    },
    [GenericStatus.IN_PROGRESS]: {
      background: "#DBEAFE",
      color: "#1D4ED8",
    },
    [GenericStatus.ONGOING]: {
      background: "#EFF6FF",
      color: "#3B82F6",
    },
    [GenericStatus.IN_TREATMENT]: {
      background: "#DBEAFE",
      color: "#1D4ED8",
    },
    [GenericStatus.SURGERY_IN_PROGRESS]: {
      background: "#E0F2FE",
      color: "#0284C7",
    },
    [GenericStatus.FIRST_VISIT]: {
      background: "#E0F2FE",
      color: "#0EA5E9",
    },

    // ❌ Danger or failed - Reds
    [GenericStatus.CRITICAL]: {
      background: "#FEE2E2",
      color: "#DC2626",
    },
    [GenericStatus.REJECTED]: {
      background: "#FFE4E6",
      color: "#E11D48",
    },
    [GenericStatus.DECEASED]: {
      background: "#F3F4F6",
      color: "#4B5563",
    },
    [GenericStatus.CANCELLED]: {
      background: "#FFE4E6",
      color: "#BE123C",
    },
    [GenericStatus.RECALL]: {
      background: "#FEE2E2",
      color: "#B91C1C",
    },
    [GenericStatus.UNRESOLVED]: {
      background: "#FEE2E2",
      color: "#DC2626",
    },
    [GenericStatus.NOT_REFERRED]: {
      background: "#FFE4E6",
      color: "#BE123C",
    },
    [GenericStatus.EMERGENCY]: {
      background: "#FEE2E2",
      color: "#EF4444",
    },
    [GenericStatus.PAYMENT_STATUS_UNPAID]: {
      background: "#FEE2E2",
      color: "#DC2626",
    },

    // Neutral / inactive
    [GenericStatus.DRAFT]: {
      background: "#F3F4F6",
      color: "#6B7280",
    },
    [GenericStatus.INACTIVE]: {
      background: "#F3F4F6",
      color: "#6B7280",
    },
    [GenericStatus.ENDED]: {
      background: "#F3F4F6",
      color: "#4B5563",
    },
    [GenericStatus.CLOSED]: {
      background: "#F3F4F6",
      color: "#4B5563",
    },
    [GenericStatus.ROOM_MAINTAINANCE]: {
      background: "#F3F4F6",
      color: "#6B7280",
    },
    [GenericStatus.STANDARD_FEE_TYPE]: {
      background: "#F3F4F6",
      color: "#6B7280",
    },

    // other special / secondary statuses
    [GenericStatus.TRANSFERRED]: {
      background: "#EDE9FE",
      color: "#7C3AED",
    },
    [GenericStatus.REFERRED]: {
      background: "#EDE9FE",
      color: "#7C3AED",
    },
    [GenericStatus.UNDER_DIAGNOSIS]: {
      background: "#EDE9FE",
      color: "#7C3AED",
    },
    [GenericStatus.CONVERTED_TO_IPD]: {
      background: "#EDE9FE",
      color: "#8B5CF6",
    },
    [GenericStatus.BOTH]: {
      background: "#EDE9FE",
      color: "#8B5CF6",
    },
    [GenericStatus.PRESCRIBED]: {
      background: "#E0F7FA",
      color: "#0097A7",
    },

    // payment
    [GenericStatus.PAYMENT_STATUS_PAID]: {
      background: "#DCFCE7",
      color: "#16A34A",
    },
    [GenericStatus.PAYMENT_PENDING]: {
      background: "#FEF3C7",
      color: "#D97706",
    },

    // Fee types
    [GenericStatus.EMERGENCY_FEE_TYPE]: {
      background: "#FFE4E6",
      color: "#EF4444",
    },
    [GenericStatus.HOME_COLLECTION_FEE_TYPE]: {
      background: "#E0F2FE",
      color: "#0EA5E9",
    },

    // ✅ Newly colored & distinct ones:
    [GenericStatus.PAUSED]: {
      background: "#F5F3FF", // Indigo 50
      color: "#6366F1", // Indigo 500
    },
    [GenericStatus.IN_REVIEW]: {
      background: "#FDF2F8", // Pink 50
      color: "#DB2777", // Pink 600
    },
    [GenericStatus.SUBMITTED]: {
      background: "#EFF6FF", // Blue 50
      color: "#1D4ED8", // Blue 700
    },
    [GenericStatus.ADMITTED]: {
      background: "#ECFEFF", // Cyan 50
      color: "#0891B2", // Cyan 600
    },
    [GenericStatus.TEST_PENDING]: {
      background: "#FFF7ED", // Orange 50
      color: "#F97316", // Orange 500
    },
    [GenericStatus.TEST_COMPLETED]: {
      background: "#F0FDF4", // Green 50
      color: "#22C55E", // Green 500
    },
    [GenericStatus.MEDICATION_DISPENSED]: {
      background: "#F0F9FF", // Sky 50
      color: "#0369A1", // Sky 700
    },
    [GenericStatus.SURGERY_SCHEDULED]: {
      background: "#FFF1F2", // Rose 50
      color: "#E11D48", // Rose 600
    },
    [GenericStatus.MEDICAL]: {
      background: "#F3F4F6", // Gray 100
      color: "#0F172A", // Slate 900
    },
    [GenericStatus.SURGICAL]: {
      background: "#E0F2F1", // Teal 50
      color: "#00695C", // Teal 800
    },
    [GenericStatus.ROOM_OCCUPIED]: {
      background: "#FFFAF0", // Amber 50
      color: "#92400E", // Amber 800
    },
    [GenericStatus.RESCHEDULED]: {
      background: "",
      color: "",
    },
    [GenericStatus.PAYMENT_LINK_SENT]: {
      background: "#E0F2FE", // Sky 50
      color: "#0369A1", // Sky 700
    },
    [GenericStatus.PAYMENT_REJECTED]: {
      background: "#FFE4E6", // Rose 50
      color: "#E11D48", // Rose 600
    },
  };

// Lookup function to get color scheme for a specific status
export function getStatusColorScheme(status: GenericStatus): StatusColorScheme {
  return (
    statusColorMap[status] || {
      background: "#F3F4F6",
      color: "#6B7280",
    }
  );
}

export default getStatusColorScheme;
