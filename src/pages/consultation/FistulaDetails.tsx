import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InfoCard from "@/components/ui/infoCard";

/* ---------- Types ---------- */

export interface FistulaRawData {
  no_of_fistula?: string | null;
  fistula_recurrence?: string | null;
  fistula_recurrence_surgery_count?: string | null;
  sono_fistula_gram?: string | null;
  mri_fistula_gram?: string | null;
  posterior_fistulous_angle?: string | null;
  sonologist?: string | null;
  sonologist_findings?: string | null;
  other_investigation?: string | null;
  no_of_tracks_in_one_fistula?: string | null;
  no_of_external_opening_position?: string | null;
  external_opening_position?: string | null;
  internal_opening_distance?: string | null;
  no_of_secondary_opening_position?: string | null;
  secondary_anal_valve?: string | null;
  any_other?: string | null;
  internal_opening_position?: string | null;
  type_of_crypt?: string | null;
  crypt_cause?: string | null;
  type_of_fistula_sphincter?: string | null;
  type_of_fistula_position?: string | null;
  basis_of_high_low_riding?: string | null;
  distant_visceral_communication?: string | null;
}

export interface FistulaDetailsProps {
  data: FistulaRawData;
  title?: string;

  openingsTableTitle?: string;

  classificationTableTitle?: string;

  emptyPlaceholder?: string;

  emptyCellPlaceholder?: string;

  visibleInfoCards?: {
    noOfFistula?: boolean;
    recurrence?: boolean;
    recurrenceCount?: boolean;
    sonoFistulogram?: boolean;
    mriFistulogram?: boolean;
    posteriorAngle?: boolean;
    sonologist?: boolean;
    sonologistFindings?: boolean;
    otherInvestigation?: boolean;
  };

  /**
   * Control which columns appear in the Fistula Openings table.
   * All are shown by default.
   */
  openingsColumns?: {
    tracks?: boolean;
    extCount?: boolean;
    extPos?: boolean;
    secCount?: boolean;
    secPos?: boolean;
    internalDistance?: boolean;
    internalPos?: boolean;
    internalLevel?: boolean;
    anyOther?: boolean;
  };

  /**
   * Control which columns appear in the Fistula Classification table.
   * All are shown by default.
   */
  classificationColumns?: {
    crypt?: boolean;
    cryptCause?: boolean;
    sphincter?: boolean;
    position?: boolean;
    highLow?: boolean;
    distant?: boolean;
  };

  className?: string;
}

/* ---------- Helpers ---------- */

const splitHash = (value?: string | null): string[] =>
  value ? value.split("#") : [];

const formatClock = (value?: string | null): string[] =>
  value ? value.split("#").map((v) => `${v} o'clock`) : [];

const buildInternalWithLevel = (
  value?: string | null,
): { pos: string; level: string }[] => {
  if (!value) return [];
  const parts = value.split("#");
  const result: { pos: string; level: string }[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    result.push({
      pos: parts[i] ? `${parts[i]} o'clock` : "",
      level: parts[i + 1] || "",
    });
  }
  return result;
};

/* ---------- Component ---------- */

const FistulaDetails: React.FC<FistulaDetailsProps> = ({
  data,
  title = "Fistula Details",
  openingsTableTitle = "Fistula Openings",
  classificationTableTitle = "Fistula Classification",
  emptyPlaceholder = "N/A",
  emptyCellPlaceholder = "-",
  visibleInfoCards = {},
  openingsColumns = {},
  classificationColumns = {},
  className,
}) => {
  if (!data) return null;

  /* Resolve visibility toggles (default: all visible) */
  const ic = {
    noOfFistula: true,
    recurrence: true,
    recurrenceCount: true,
    sonoFistulogram: true,
    mriFistulogram: true,
    posteriorAngle: true,
    sonologist: true,
    sonologistFindings: true,
    otherInvestigation: true,
    ...visibleInfoCards,
  };

  const oc = {
    tracks: true,
    extCount: true,
    extPos: true,
    secCount: true,
    secPos: true,
    internalDistance: true,
    internalPos: true,
    internalLevel: true,
    anyOther: true,
    ...openingsColumns,
  };

  const cc = {
    crypt: true,
    cryptCause: true,
    sphincter: true,
    position: true,
    highLow: true,
    distant: true,
    ...classificationColumns,
  };

  /* ---------- Global fields ---------- */
  const noOfFistula = data.no_of_fistula;
  const recurrence = data.fistula_recurrence;
  const recurrenceCount = data.fistula_recurrence_surgery_count;
  const sono = data.sono_fistula_gram;
  const mri = data.mri_fistula_gram;
  const angle = data.posterior_fistulous_angle;
  const sonologist = data.sonologist;
  const sonologistFindings = data.sonologist_findings;
  const otherInvestigation = data.other_investigation;

  /* ---------- Per-fistula arrays ---------- */
  const tracks = splitHash(data.no_of_tracks_in_one_fistula);
  const extCount = splitHash(data.no_of_external_opening_position);
  const extPos = formatClock(data.external_opening_position);
  const internalDistance = splitHash(data.internal_opening_distance);
  const secCount = splitHash(data.no_of_secondary_opening_position);
  const secPos = splitHash(data.secondary_anal_valve);
  const anyOther = splitHash(data.any_other);
  const internal = buildInternalWithLevel(data.internal_opening_position);

  /* ---------- Classification arrays ---------- */
  const crypt = splitHash(data.type_of_crypt);
  const cryptCause = splitHash(data.crypt_cause);
  const sphincter = splitHash(data.type_of_fistula_sphincter);
  const position = splitHash(data.type_of_fistula_position);
  const highLow = splitHash(data.basis_of_high_low_riding);
  const distant = splitHash(data.distant_visceral_communication);

  /* Use internal rows as the row anchor; fall back to max array length */
  const rowCount = internal.length || Math.max(tracks.length, crypt.length, 1);
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  const cell = (val?: string) => val || emptyCellPlaceholder;
  const info = (val?: string | null) => val || emptyPlaceholder;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* -------- Global Info Cards -------- */}

          {ic.noOfFistula && (
            <InfoCard label="No of Anal Fistula" value={info(noOfFistula)} />
          )}

          {ic.recurrence && (
            <InfoCard
              label="Fistula Recurrence"
              value={
                recurrence ? recurrence.split("_").join(" ") : emptyPlaceholder
              }
            />
          )}

          {ic.recurrenceCount && (
            <InfoCard
              label="Recurrence Surgery Count"
              value={info(recurrenceCount)}
            />
          )}

          {ic.sonoFistulogram && (
            <InfoCard label="Sonofistulogram" value={info(sono)} />
          )}

          {ic.mriFistulogram && (
            <InfoCard label="MRI Fistulogram" value={info(mri)} />
          )}

          {ic.posteriorAngle && (
            <InfoCard label="Posterior Fistulous Angle" value={info(angle)} />
          )}

          {ic.sonologist && (
            <InfoCard
              label="Sonologist / Radiologist"
              value={info(sonologist)}
            />
          )}

          {ic.sonologistFindings && (
            <View className="col-span-1 md:col-span-2 lg:col-span-3">
              <InfoCard
                label="Sonologist / Radiologist Findings"
                value={info(sonologistFindings)}
              />
            </View>
          )}

          {ic.otherInvestigation && (
            <View className="col-span-1 md:col-span-2 lg:col-span-3">
              <InfoCard
                label="Any Other Investigations"
                value={info(otherInvestigation)}
              />
            </View>
          )}

          {/* -------- Fistula Openings Table -------- */}

          <View className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
            <Text className="font-semibold mb-2">{openingsTableTitle}</Text>

            <Table>
              <TableHeader>
                <TableRow>
                  {oc.tracks && <TableHead>No of Tracks in Fistula</TableHead>}
                  {oc.extCount && <TableHead>No of External Opening</TableHead>}
                  {oc.extPos && (
                    <TableHead>Positions of External Openings</TableHead>
                  )}
                  {oc.secCount && (
                    <TableHead>No of Secondary Opening</TableHead>
                  )}
                  {oc.secPos && (
                    <TableHead>Positions of Secondary Openings</TableHead>
                  )}
                  {oc.internalDistance && (
                    <TableHead>Internal Opening Distance</TableHead>
                  )}
                  {oc.internalPos && (
                    <TableHead>Internal Opening Position</TableHead>
                  )}
                  {oc.internalLevel && (
                    <TableHead>Internal Opening Level</TableHead>
                  )}
                  {oc.anyOther && <TableHead>Any Other</TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i}>
                    {oc.tracks && <TableCell>{cell(tracks[i])}</TableCell>}
                    {oc.extCount && <TableCell>{cell(extCount[i])}</TableCell>}
                    {oc.extPos && <TableCell>{cell(extPos[i])}</TableCell>}
                    {oc.secCount && <TableCell>{cell(secCount[i])}</TableCell>}
                    {oc.secPos && <TableCell>{cell(secPos[i])}</TableCell>}
                    {oc.internalDistance && (
                      <TableCell>{cell(internalDistance[i])}</TableCell>
                    )}
                    {oc.internalPos && (
                      <TableCell>{cell(internal[i]?.pos)}</TableCell>
                    )}
                    {oc.internalLevel && (
                      <TableCell>{cell(internal[i]?.level)}</TableCell>
                    )}
                    {oc.anyOther && <TableCell>{cell(anyOther[i])}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>

          {/* -------- Fistula Classification Table -------- */}

          <View className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
            <Text className="font-semibold mb-2">
              {classificationTableTitle}
            </Text>

            <Table>
              <TableHeader>
                <TableRow>
                  {cc.crypt && <TableHead>Fistula Crypt</TableHead>}
                  {cc.cryptCause && <TableHead>Secondary Cause</TableHead>}
                  {cc.sphincter && <TableHead>Fistula Sphincter</TableHead>}
                  {cc.position && <TableHead>Fistula Position</TableHead>}
                  {cc.highLow && (
                    <TableHead>Fistula High / Low Riding</TableHead>
                  )}
                  {cc.distant && <TableHead>Distant / Visceral</TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i}>
                    {cc.crypt && <TableCell>{cell(crypt[i])}</TableCell>}
                    {cc.cryptCause && (
                      <TableCell>{cell(cryptCause[i])}</TableCell>
                    )}
                    {cc.sphincter && (
                      <TableCell>{cell(sphincter[i])}</TableCell>
                    )}
                    {cc.position && <TableCell>{cell(position[i])}</TableCell>}
                    {cc.highLow && <TableCell>{cell(highLow[i])}</TableCell>}
                    {cc.distant && <TableCell>{cell(distant[i])}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default FistulaDetails;
