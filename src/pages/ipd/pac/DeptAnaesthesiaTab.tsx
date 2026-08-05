import React from "react";
import View from "@/components/view";
import ReadOnlyField from "./components/ReadOnlyField";
import TagPill from "./components/TagPill";
import SectionDivider from "./components/SectionDivider";
import TabUploadSection from "./components/TabUploadSection";

interface Props {
  detail: any;
  uploadPath?: string | null;
  onPreview: (url: string, title: string) => void;
  onDownload: () => void;
}

const parseArrayField = (value: any) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const parseObjectField = (value: any) => {
  if (!value) return null;

  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const DeptAnaesthesiaTab: React.FC<Props> = ({
  detail,
  uploadPath,
  onPreview,
}) => {
  const abp = parseObjectField(detail?.abp_details);
  const cvp = parseObjectField(detail?.cvp_details);

  const regionalSupplements = parseArrayField(detail?.regional_supplements);

  return (
    <View className="space-y-8 p-6">
      {/* Pre-Anaesthesia */}
      <SectionDivider label="Pre-Anaesthesia" />

      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TagPill
          label="Pre-Anaesthesia State"
          items={parseArrayField(detail?.pre_anaesthesia_state)}
        />

        <TagPill
          label="Ventilated Patient"
          items={parseArrayField(detail?.ventilated_patient)}
        />

        <ReadOnlyField label="NPO Status" value={detail?.npo_status} />

        <ReadOnlyField
          label="Difficult Intubation"
          value={
            detail?.difficult_intubation != null
              ? detail.difficult_intubation
                ? "Yes"
                : "No"
              : null
          }
        />

        <TagPill
          label="Patient Safety"
          items={parseArrayField(detail?.patient_safety)}
        />

        <TagPill
          label="Pre Oxygenation"
          items={parseArrayField(detail?.pre_oxygenation)}
        />

        <ReadOnlyField label="Induction" value={detail?.induction} />
      </View>

      {/* Airway */}
      <SectionDivider label="Airway" />

      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TagPill label="Airway" items={parseArrayField(detail?.airway)} />

        <ReadOnlyField label="Airway Size" value={detail?.airway_size} />

        <TagPill
          label="Laryngoscopy"
          items={parseArrayField(detail?.laryngoscopy)}
        />

        <TagPill
          label="Endotracheal Tube"
          items={parseArrayField(detail?.endotracheal_tube)}
        />

        <TagPill
          label="Endotracheal Tube Type"
          items={parseArrayField(detail?.endotracheal_tube_type)}
        />

        <ReadOnlyField
          label="Endotracheal Tube Size"
          value={detail?.endotracheal_tube_size}
        />

        <ReadOnlyField
          label="Endotracheal Tube Fixed At"
          value={detail?.endotracheal_tube_fixed_at}
        />

        <TagPill
          label="Mask Anaesthesia"
          items={parseArrayField(detail?.mask_anaesthesia)}
        />

        <ReadOnlyField label="Throat Pack" value={detail?.throat_pack} />

        <ReadOnlyField
          label="Nasogastric Tube"
          value={detail?.nasogastric_tube}
        />
      </View>

      {/* IV Access */}
      {parseArrayField(detail?.iv_access)?.length > 0 && (
        <>
          <SectionDivider label="IV Access" />

          <View className="space-y-4">
            {parseArrayField(detail?.iv_access).map(
              (item: any, index: number) => (
                <View
                  key={item?.id || index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg p-4"
                >
                  <ReadOnlyField label="Site" value={item?.site} />

                  <ReadOnlyField label="Size" value={item?.size} />

                  <ReadOnlyField label="Location" value={item?.location} />
                </View>
              ),
            )}
          </View>
        </>
      )}

      {/* Regional & Central Blocks */}
      <SectionDivider label="Regional & Central Blocks" />

      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TagPill
          label="Central Blocks Spinal"
          items={parseArrayField(detail?.central_blocks_spinal)}
        />

        <ReadOnlyField
          label="Spinal Needle Gauge"
          value={detail?.central_blocks_spinal_needle_g}
        />

        <TagPill
          label="Central Blocks Epidural"
          items={parseArrayField(detail?.central_blocks_epidural)}
        />

        <ReadOnlyField
          label="Epidural Gauge"
          value={detail?.central_blocks_epidural_g}
        />

        <TagPill
          label="Regional Blocks"
          items={parseArrayField(detail?.regional_blocks)}
        />

        <TagPill
          label="Nerve Stimulator"
          items={parseArrayField(detail?.nerve_stimulator)}
        />

        <TagPill
          label="Drugs Regional"
          items={parseArrayField(detail?.drugs_regional)}
        />
      </View>

      {/* Regional Supplements */}
      {regionalSupplements?.length > 0 && (
        <>
          <SectionDivider label="Regional Supplements" />

          <View className="space-y-4">
            {regionalSupplements.map((item: any, index: number) => (
              <View
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg p-4"
              >
                <ReadOnlyField label="Drug Name" value={item?.name} />

                <ReadOnlyField label="Concentration" value={item?.conc} />

                <ReadOnlyField label="Volume" value={item?.vol} />
              </View>
            ))}
          </View>
        </>
      )}

      {/* Monitoring & Fluids */}
      <SectionDivider label="Monitoring & Fluids" />

      <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TagPill
          label="Monitoring"
          items={parseArrayField(detail?.monitoring)}
        />

        <ReadOnlyField label="Temperature" value={detail?.temperature} />

        <ReadOnlyField
          label="Crystalloids (ml)"
          value={detail?.crystalloids_ml}
        />

        <ReadOnlyField label="Colloids (ml)" value={detail?.colloids_ml} />

        <ReadOnlyField label="Blood (ml)" value={detail?.blood_ml} />
      </View>

      {/* ABP Details */}
      {abp && (
        <>
          <SectionDivider label="ABP Details" />

          <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReadOnlyField label="Site" value={abp?.site} />

            <ReadOnlyField label="Size" value={abp?.size} />

            <ReadOnlyField label="Location" value={abp?.location} />
          </View>
        </>
      )}

      {/* CVP Details */}
      {cvp && (
        <>
          <SectionDivider label="CVP Details" />

          <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReadOnlyField label="Site" value={cvp?.site} />

            <ReadOnlyField label="Size" value={cvp?.size} />

            <ReadOnlyField label="Location" value={cvp?.location} />
          </View>
        </>
      )}

      {/* Maintenance */}
      <SectionDivider label="Maintenance" />

      <TagPill
        label="Maintenance"
        items={parseArrayField(detail?.maintenance)}
      />

      {/* Summary */}
      <SectionDivider label="Summary" />

      <ReadOnlyField
        label="Anaesthesia Technique Brief"
        value={detail?.anaesthesia_technique_brief}
      />

      <ReadOnlyField label="Summary" value={detail?.summary} />

      {/* Uploaded Documents */}
      <TabUploadSection
        docs={[
          {
            label: "Anaesthesia Form",
            path: uploadPath || detail?.upload_pdf_path,
          },
        ]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default DeptAnaesthesiaTab;
