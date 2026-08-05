import React from "react";
import View from "@/components/view";
import ReadOnlyField from "./components/ReadOnlyField";
import ASAGradingTiles from "./components/ASAGradingTiles";
import TagPill from "./components/TagPill";
import SectionDivider from "./components/SectionDivider";
import TabUploadSection from "./components/TabUploadSection";

interface Props {
  detail: any;
  uploadPath?: string | null;
  onPreview: (url: string, title: string) => void;
  onDownload: () => void;
}

/**
 * Pre-Op Anaesthesia Evaluation tab.
 * Shows all fields returned by: GET /api/ipd_pre_operative_anaesthesia_evaluation_details/:id
 */
const PreOpEvalTab: React.FC<Props> = ({ detail, uploadPath, onPreview }) => {
  return (
    <View className="space-y-8 p-6">
      {/* ── ASA & Consent ── */}
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ASAGradingTiles value={detail?.asa_grading} />
        <ReadOnlyField
          label="Informed Consent"
          value={
            detail?.informed_consent !== undefined &&
            detail?.informed_consent !== null
              ? detail.informed_consent
                ? "Yes"
                : "No"
              : null
          }
        />
      </View>

      {/* ── Physical Examination ── */}
      <SectionDivider label="Physical Examination" />
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReadOnlyField label="Mouth Opening" value={detail?.mouth_opening} />
        <ReadOnlyField label="Teeth" value={detail?.teeth} />
        <ReadOnlyField label="Neck Movement" value={detail?.neck_movement} />
        <ReadOnlyField
          label="Mallampati Score"
          value={detail?.mallampati_score}
        />
        <ReadOnlyField label="Dentures" value={detail?.dentures_check} />
        <ReadOnlyField label="TMD" value={detail?.tmd} />
      </View>

      {/* ── Airway Assessment ── */}
      {detail?.airway_assessment && (
        <>
          <SectionDivider label="Airway Assessment" />
          <ReadOnlyField
            label="Airway Assessment"
            value={detail?.airway_assessment}
          />
        </>
      )}

      {/* ── Systems Review ── */}
      {(detail?.respiratory_system ||
        detail?.cardio_vascular_system ||
        detail?.cns_musculoskeletal ||
        detail?.hepatic_renal ||
        detail?.endocrine ||
        detail?.other_system) && (
        <>
          <SectionDivider label="Systems Review" />
          <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReadOnlyField
              label="Respiratory System"
              value={detail?.respiratory_system}
            />
            <ReadOnlyField
              label="Cardio-Vascular System"
              value={detail?.cardio_vascular_system}
            />
            <ReadOnlyField
              label="CNS / Musculoskeletal"
              value={detail?.cns_musculoskeletal}
            />
            <ReadOnlyField
              label="Hepatic / Renal"
              value={detail?.hepatic_renal}
            />
            <ReadOnlyField label="Endocrine" value={detail?.endocrine} />
            <ReadOnlyField label="Other Systems" value={detail?.other_system} />
          </View>
        </>
      )}

      {/* ── Investigations ── */}
      {(detail?.hb_hct ||
        detail?.tc ||
        detail?.platelets ||
        detail?.bt_ct ||
        detail?.pt_ptt ||
        detail?.inr ||
        detail?.blood_group ||
        detail?.fbs_rbs ||
        detail?.bun ||
        detail?.na_k ||
        detail?.chest_xray ||
        detail?.ecg ||
        detail?.echo ||
        detail?.other_investigation) && (
        <>
          <SectionDivider label="Investigations" />
          <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <ReadOnlyField label="Hb / Hct" value={detail?.hb_hct} />
            <ReadOnlyField label="TC" value={detail?.tc} />
            <ReadOnlyField label="Platelets" value={detail?.platelets} />
            <ReadOnlyField label="BT / CT" value={detail?.bt_ct} />
            <ReadOnlyField label="PT / PTT" value={detail?.pt_ptt} />
            <ReadOnlyField label="INR" value={detail?.inr} />
            <ReadOnlyField label="Blood Group" value={detail?.blood_group} />
            <ReadOnlyField label="FBS / RBS" value={detail?.fbs_rbs} />
            <ReadOnlyField label="BUN" value={detail?.bun} />
            <ReadOnlyField label="Na / K" value={detail?.na_k} />
            <ReadOnlyField label="Chest X-Ray" value={detail?.chest_xray} />
            <ReadOnlyField label="ECG" value={detail?.ecg} />
            <ReadOnlyField label="Echo" value={detail?.echo} />
            <ReadOnlyField
              label="Other Investigation"
              value={detail?.other_investigation}
            />
          </View>
        </>
      )}

      {/* ── Clinical Evaluation ── */}
      {detail?.clinical_evaluation && (
        <>
          <SectionDivider label="Clinical Evaluation" />
          <ReadOnlyField
            label="Clinical Evaluation"
            value={detail?.clinical_evaluation}
          />
        </>
      )}

      {/* ── History ── */}
      <SectionDivider label="History" />
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReadOnlyField
          label="Previous Anaesthesia / Surgery"
          value={detail?.previous_anaesthesia_surgery}
        />
        <ReadOnlyField
          label="Current Medication"
          value={detail?.current_medication}
        />
      </View>
      <TagPill label="Allergies" items={detail?.allergies} />

      {/* ── Pre-Operative Instructions ── */}
      {detail?.pre_operative_anaesthesia_instruction && (
        <>
          <SectionDivider label="Pre-Operative Instructions" />
          <ReadOnlyField
            label="Pre-Operative Anaesthesia Instructions"
            value={detail?.pre_operative_anaesthesia_instruction}
          />
        </>
      )}

      {/* ── Summary ── */}
      <SectionDivider label="Summary" />
      <ReadOnlyField label="Evaluation Summary" value={detail?.summary} />

      {/* ── Uploaded Documents ── */}
      <TabUploadSection
        docs={[{ label: "Pre-Op Evaluation Form", path: uploadPath }]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default PreOpEvalTab;
