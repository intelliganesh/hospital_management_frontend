import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import ReadOnlyField from "./components/ReadOnlyField";
import TagPill from "./components/TagPill";
import SectionDivider from "./components/SectionDivider";
import dayjs from "dayjs";
import TabUploadSection from "./components/TabUploadSection";

interface Props {
  detail: any;
  uploadPath?: string | null;
  onPreview: (url: string, title: string) => void;
  onDownload: () => void;
}

/**
 * Parses a JSON string safely, falling back to the value or an empty array.
 */
const safeParse = (val: any, fallback: any = []) => {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const VitalMonitoringTable: React.FC<{ rows: any[] }> = ({ rows }) => {
  if (!rows?.length)
    return <Text className="text-slate-400 italic text-sm">Not recorded</Text>;

  return (
    <View className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100">
            {[
              "Time",
              "Consciousness",
              "Respiration",
              "Pulse Rate",
              "SpO₂",
              "Remarks",
            ].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, idx: number) => (
            <tr
              key={row.id || idx}
              className={idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/60 dark:bg-slate-700"}
            >
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                {row.time || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                {row.consciousness || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                {row.respiration || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                {row.pulseRate || "—"}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.spo2 || "—"}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.remarks || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </View>
  );
};

const RecoveryObsTab: React.FC<Props> = ({ detail, uploadPath, onPreview }) => {
  const monitors = safeParse(detail?.monitors);
  const complications = safeParse(detail?.post_operative_complications);
  const medications = safeParse(detail?.post_operative_medications);
  const vitalRows = safeParse(detail?.vital_monitoring);

  const formatDateTime = (val: string | null) =>
    val ? dayjs(val).format("DD MMM YYYY, hh:mm A") : null;

  return (
    <View className="space-y-8 p-6">
      {/* ── General ── */}
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReadOnlyField
          label="Surgical Procedure"
          value={detail?.surgical_procedure}
        />
        <ReadOnlyField
          label="Time Patient Received"
          value={formatDateTime(detail?.time_patient_received)}
        />
      </View>

      {/* ── Monitoring & Medications ── */}
      <SectionDivider label="Monitoring & Medications" />
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TagPill label="Monitors" items={monitors} />
        <TagPill label="Post-Op Medications" items={medications} />
        <TagPill label="Complications" items={complications} />
      </View>

      {/* ── Vital Monitoring Table ── */}
      <SectionDivider label="Vital Monitoring" />
      <VitalMonitoringTable rows={vitalRows} />

      {/* ── Recovery Score (Aldrete) ── */}
      <SectionDivider label="Recovery Score (Aldrete)" />
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReadOnlyField
          label="Score on Admission"
          value={
            detail?.patient_score_on_admission
              ? `${detail.patient_score_on_admission} / 14`
              : null
          }
        />
        <ReadOnlyField
          label="Score Before Transfer"
          value={
            detail?.patient_score_before_transfer
              ? `${detail.patient_score_before_transfer} / 14`
              : null
          }
        />
      </View>

      {/* ── Transfer / Discharge ── */}
      <SectionDivider label="Transfer / Discharge" />
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReadOnlyField
          label="Transfer Destination"
          value={detail?.transfer_to}
        />
        <ReadOnlyField
          label="Time of Transfer"
          value={formatDateTime(detail?.time_of_transfer)}
        />
        <ReadOnlyField
          label="Pulse (at shifting)"
          value={detail?.pulse_at_shifting}
        />
        <ReadOnlyField
          label="BP (at shifting)"
          value={
            detail?.sbp_at_shifting && detail?.dbp_at_shifting
              ? `${detail.sbp_at_shifting} / ${detail.dbp_at_shifting} mmHg`
              : null
          }
        />
        <ReadOnlyField
          label="RR (at shifting)"
          value={detail?.rr_at_shifting}
        />
      </View>

      {/* ── Summary ── */}
      {detail?.summary && (
        <>
          <SectionDivider label="Summary" />
          <ReadOnlyField label="Summary" value={detail?.summary} />
        </>
      )}

      {/* ── Post-Operative Instructions ── */}
      <SectionDivider label="Post-Operative Instructions" />
      <ReadOnlyField
        label="Instructions"
        value={detail?.post_operative_instructions}
      />

      {/* ── Uploaded Documents ── */}
      <TabUploadSection
        docs={[
          {
            label: "Recovery Room Form",
            path: uploadPath || detail?.upload_pdf_path,
          },
        ]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default RecoveryObsTab;
