import React, { useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Stethoscope, Calendar } from "lucide-react";
import dayjs from "dayjs";
import {
  CONSULTATION_TABLE_URL,
  CONSULTATION_DETAILS_URL,
  TIME_FORMAT,
  DATE_FORMAT,
} from "@/utils/urls/frontend";
import { useNavigate } from "react-router-dom";

interface ConsultationItemProps {
  consultation: any;
  index: number;
  showMore: boolean;
}

const ConsultationItem: React.FC<ConsultationItemProps> = ({
  consultation,
  // index,
  showMore = true,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const departmentType =
    consultation?.type === "Proctology"
      ? "proctology"
      : consultation?.type === "Non Proctology"
        ? "non_proctology"
        : "allopathy";

  const chiefComplaints = consultation[departmentType]?.chief_complaints
    ? JSON.parse(consultation[departmentType]?.chief_complaints)
    : [];

  const fistulaDataRaw = consultation[departmentType] || {};

  const parseFistulaData = (data: any) => {
    if (!data) return [];

    // Determine count based on maximum splits found in any field
    const keysToCheck = [
      "no_of_tracks_in_one_fistula",
      "no_of_external_opening_position",
      "external_opening_position",
      "no_of_secondary_opening_position",
      "secondary_opening_position",
      "any_other",
      "type_of_crypt",
      "crypt_cause",
      "type_of_fistula_sphincter",
      "type_of_fistula_position",
      "basis_of_high_low_riding",
      "distant_visceral_communication",
    ];

    let maxCount = 0;
    keysToCheck.forEach((key) => {
      if (data[key] && typeof data[key] === "string") {
        const len = data[key].split("#").length;
        if (len > maxCount) maxCount = len;
      }
    });

    // Internal opening might be 2x count
    if (
      data.internal_opening_position &&
      typeof data.internal_opening_position === "string"
    ) {
      const len = data.internal_opening_position.split("#").length;
      // If it's roughly double the other counts, assume pairs.
      // If it's same, assume single.
      // Let's rely on other keys mostly, but if maxCount is still 0/1 and this is big, we might infer.
      // For safety, let's just stick to standard keys (likely at least one standard key exists if data is real).
      if (maxCount === 0 && len > 0) maxCount = Math.floor(len / 2) || 1;
    }

    const count =
      maxCount || (data.no_of_fistula ? parseInt(data.no_of_fistula) : 0) || 1;
    const result = [];

    const getSplitValue = (key: string, idx: number) => {
      const field = data[key];
      if (!field) return null;
      const parts = field.split("#");
      return parts[idx] === null ||
        parts[idx] === undefined ||
        parts[idx] === ""
        ? "N/A"
        : `${parts[idx]} ${key === "external_opening_position" ? " o'clock" : ""} 
        `;
    };

    // Special helper for Internal Opening Position which seems to be paired (Value + Level) based on user example
    // Input: "7#Above...#16#Below..." -> [7, Above], [16, Below]
    // If the string suggests direct pairs matching the count, we iterate 2*idx
    const getInternalOpening = (idx: number) => {
      const field = data.internal_opening_position;
      if (!field) return null;
      const parts = field.split("#");
      // Check if we have enough parts for pairs (roughly 2x count)
      // Or if parts.length > count?
      if (parts.length >= count * 2) {
        const pos = parts[idx * 2] + " o'clock";
        const level = parts[idx * 2 + 1];
        if (!pos) return null;
        return `${pos} \n(Level: ${level || "N/A"})`;
      }
      // Fallback if structure is different (e.g. 1-1 mapping)
      return parts[idx] || null;
    };

    for (let i = 0; i < count; i++) {
      result.push({
        no_of_tracks: getSplitValue("no_of_tracks_in_one_fistula", i),
        external_opening_no: getSplitValue(
          "no_of_external_opening_position",
          i,
        ),
        external_opening_pos: getSplitValue("external_opening_position", i),
        secondary_opening_no: getSplitValue(
          "no_of_secondary_opening_position",
          i,
        ),
        secondary_opening_pos: getSplitValue("secondary_anal_valve", i),
        internal_opening_distance: getSplitValue(
          "internal_opening_distance",
          i,
        ),
        internal_opening_pos: getInternalOpening(i),
        other: getSplitValue("any_other", i),

        // Classification
        basis_of_crypt: getSplitValue("type_of_crypt", i),
        secondary_cause: getSplitValue("crypt_cause", i),
        basis_of_sphincter: getSplitValue("type_of_fistula_sphincter", i),
        position: getSplitValue("type_of_fistula_position", i),
        high_low_riding: getSplitValue("basis_of_high_low_riding", i),
        visceral_communications: getSplitValue(
          "distant_visceral_communication",
          i,
        ),
      });
    }
    return result;
  };

  const parsedFistulaList = fistulaDataRaw
    ? parseFistulaData(fistulaDataRaw)
    : [];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderField = (label: string, value: string | null | undefined) => (
    <View>
      <Text className="text-sm font-bold text-muted-foreground mb-1">
        {label}
      </Text>
      <Text className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {value || "N/A"}
      </Text>
    </View>
  );

  return (
    <Card className={` py-4 ${isExpanded ? "col-span-2" : "col-span-1"}`}>
      <CardContent className="">
        {/* Header with basic info */}
        <View className="flex justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex justify-between items-center gap-2 mb-2">
              <View className="flex items-center gap-1">
                <Stethoscope className="w-4 h-4 text-primary" />
                <Text className="font-semibold text-lg">Consultation </Text>
                <Text className="text-sm text-muted-foreground">
                  ({consultation?.type || "N/A  "})
                </Text>
              </View>
              <Text
                as="span"
                className="text-primary bg-primary-50 px-2 py-1 rounded border border-primary cursor-pointer"
                onClick={() =>
                  navigate(
                    `${CONSULTATION_TABLE_URL}${CONSULTATION_DETAILS_URL}/${consultation?.id}`,
                  )
                }
              >
                {consultation?.appointment_number}
              </Text>
            </View>

            <View className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <View className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {consultation?.appointment_date
                  ? dayjs(
                      `${consultation.appointment_date} ${consultation.appointment_time}`,
                    ).format(DATE_FORMAT) +
                    " | " +
                    dayjs(
                      `${consultation.appointment_date} ${consultation.appointment_time}`,
                    ).format(TIME_FORMAT)
                  : "N/A"}
              </View>
              {consultation?.doctor_name && (
                <View className="flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  {consultation.doctor_name}
                </View>
              )}
            </View>
          </View>

          {showMore && (
            <Button
              variant="ghost"
              size="small"
              onPress={toggleExpanded}
              className="flex items-center gap-1 text-primary"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  See More
                </>
              )}
            </Button>
          )}
        </View>

        {/* Always visible summary */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <View>
            <Text className="text-sm font-semibold text-muted-foreground mb-1">
              Complaints
            </Text>
            <View className="flex gap-2 items-center flex-wrap">
              {chiefComplaints.length > 0
                ? chiefComplaints
                    // .slice(0, 2 )
                    .map((item: any) => (
                      <Text
                        className="text-xs bg-primary text-white px-2 py-1 rounded"
                        key={item.id}
                      >
                        {item.label}
                      </Text>
                    ))
                : // .join(", ")
                  "N/A"}
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold text-muted-foreground mb-1">
              Diagnosis
            </Text>
            <Text className="text-sm">
              {consultation[departmentType]?.diagnosis_summary || "N/A"}
            </Text>
          </View>
        </View>

        {/* Expanded details */}
        {isExpanded && (
          <View className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <View>
              <Text weight="font-bold" className="text-lg text-primary">
                Fistual Findings
              </Text>
            </View>

            <View className="flex items-center gap-2">
              <Text className="text-md font-bold text-slate-800 dark:text-slate-100">
                No of Anal Fistula
              </Text>
              <View className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-semibold text-slate-600 dark:text-slate-300">
                {fistulaDataRaw?.no_of_fistula || parsedFistulaList.length}
              </View>
            </View>

            {/* Fistula Section */}
            {parsedFistulaList.length > 0 && (
              <View className="space-y-4 bg-muted p-4 rounded-lg">
                {parsedFistulaList.map((item: any, idx: number) => (
                  <View
                    key={idx}
                    className="bg-background shadow-sm rounded-lg p-5 border border-slate-200 dark:border-slate-700"
                  >
                    {/* Header */}
                    <View className="flex items-center gap-3 mb-6">
                      <View className="w-8 h-8 rounded-full bg-primary-50 border border-primary-600 text-primary flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </View>
                      <Text
                        weight="font-bold"
                        className="text-lg text-slate-900 dark:text-slate-100"
                      >
                        Fistula #{idx + 1}
                      </Text>
                    </View>

                    {/* Section 1: Track & Openings */}
                    <View className="space-y-6 mb-6">
                      <View>
                        {renderField("No Of Tracks", item.no_of_tracks)}
                      </View>

                      <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                        {renderField(
                          "External Opening (No.)",
                          item.external_opening_no,
                        )}
                        {renderField(
                          "External Opening (Position)",
                          item.external_opening_pos,
                        )}
                        {renderField(
                          "Secondary Opening (No.)",
                          item.secondary_opening_no,
                        )}
                        {renderField(
                          "Secondary Opening (Position)",
                          item.secondary_opening_pos,
                        )}
                      </View>

                      <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
                        {renderField(
                          "Internal Opening Distance",
                          item.internal_opening_distance,
                        )}
                        {renderField(
                          "Internal Openings Position",
                          item.internal_opening_pos,
                        )}
                        {/* Level is merged into internal_opening_pos for simpler display if they come together */}
                        {renderField("Any other", item.other)}
                      </View>
                    </View>

                    <View className="h-px bg-slate-200 dark:bg-slate-700 mb-4" />

                    {/* Section 2: Classification */}
                    <View>
                      <Text
                        weight="font-semibold"
                        className="text-lg text-slate-900 dark:text-slate-100 mb-4"
                      >
                        Fistula Classification
                      </Text>
                      <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                        {renderField(
                          "On The Basis Of Crypt",
                          item.basis_of_crypt,
                        )}
                        {renderField(
                          "If Secondary, Cause",
                          item.secondary_cause,
                        )}
                        {renderField(
                          "On The Basis Of Sphincter",
                          item.basis_of_sphincter,
                        )}
                        {renderField("On The Basis Of Position", item.position)}
                        {renderField(
                          "On The Basis Of high/Low Riding",
                          item.high_low_riding,
                        )}
                        {renderField(
                          "Any Other Distant or Visceral Communications",
                          item.visceral_communications,
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Investigations */}
            <View>
              <Text
                weight="font-bold"
                className="text-lg text-primary mb-4 border-b border-slate-200 dark:border-slate-700 pb-2"
              >
                Investigations & More
              </Text>
              <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                {renderField(
                  "Sonofistulaogram",
                  fistulaDataRaw.sono_fistula_gram,
                )}
                {renderField(
                  "MRI Fistulogram",
                  fistulaDataRaw.mri_fistula_gram,
                )}
                {renderField(
                  "Posterior Fistulous Angle",
                  fistulaDataRaw.posterior_fistulous_angle,
                )}
                {renderField(
                  "Sonologist/Radiologist",
                  fistulaDataRaw.sonologist,
                )}
                {renderField(
                  "Sonologist/Radiologist Findings",
                  fistulaDataRaw.sonologist_findings,
                )}
                {renderField(
                  "Any Other Investigations",
                  fistulaDataRaw.other_investigation,
                )}

                {/* Recurrence */}
                <View>
                  {renderField(
                    "Fistula Recurrence or New Case?",
                    consultation[departmentType]?.fistula_recurrence ===
                      "new_case"
                      ? "New Case"
                      : "Recurrence",
                  )}
                  {/* If Yes, maybe show count if available in data? It's not in the shared interface clearly but referenced in request */}
                  {/* {consultation[departmentType]?.fistula_recurrence_surgery_count && (
                             <Text className="text-xs text-slate-500 mt-1">Surgery Count: {consultation[departmentType].fistula_recurrence_surgery_count}</Text>
                        )} */}
                </View>
              </View>
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationItem;
