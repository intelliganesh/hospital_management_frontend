import { useFistula } from "@/actions/calls/fistula";
import { RootState } from "@/actions/store";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import Text from "@/components/text";
import View from "@/components/view";
import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type EntryType = {
  // secondary_opening_position: string;
  external_opening_position: string;
  secondary_anal_valve: string;
  internal_opening_value: string;
  internal_opening_level: string;
  no_of_external_opening_position?: string;
  no_of_tracks_in_one_fistula?: string;
  no_of_secondary_opening_position?: string;
  internal_opening_distance?: string;
  any_other?: string;
  type_of_crypt: string;
  crypt_cause?: string;
  basis_of_high_low_riding: string;
  distant_visceral_communication?: string;
  type_of_fistula_sphincter?: string;
  type_of_fistula_position?: string;
};

const emptyEntry: EntryType = {
  // secondary_opening_position: "",
  external_opening_position: "",
  secondary_anal_valve: "",
  internal_opening_value: "",
  internal_opening_level: "Above the level of anal verge",
  no_of_external_opening_position: "",
  no_of_tracks_in_one_fistula: "",
  no_of_secondary_opening_position: "",
  internal_opening_distance: "",
  any_other: "",
  type_of_crypt: "",
  crypt_cause: "",
  basis_of_high_low_riding: "",
  distant_visceral_communication: "",
  type_of_fistula_sphincter: "",
  type_of_fistula_position: "",
};

const REPEATABLE_FIELDS: (keyof EntryType)[] = [
  // "secondary_opening_position",
  "external_opening_position",
  "secondary_anal_valve",
  "no_of_external_opening_position",
  "no_of_tracks_in_one_fistula",
  "no_of_secondary_opening_position",
  "any_other",
  "type_of_crypt",
  "crypt_cause",
  "basis_of_high_low_riding",
  "distant_visceral_communication",
  "type_of_fistula_sphincter",
  "type_of_fistula_position",
  "internal_opening_distance",
];

const INTERNAL_LEVEL_OPTIONS = [
  {
    value: "Above the level of anal verge",
    label: "Above the level of anal valve",
  },
  {
    value: "At the level of anal verge",
    label: "At the level of anal valve",
  },
  {
    value: "Below the level of anal verge",
    label: "Below the level of anal valve",
  },
];
interface OpeningPositionProps {
  initialData?: any;
}

const OpeningPosition: React.FC<OpeningPositionProps> = ({ initialData }) => {
  const consultationDetailData = initialData;

  // const consultationDetail = {
  //   ...consultationDetailData?.proctologyOrNonProctology,
  //   ...consultationDetailData?.vitals,
  //   ...consultationDetailData?.consultations,
  // };

  const { values } = useForm<Consultation | null>(consultationDetailData);

  const [positions, setPositions] = useState<EntryType[]>([emptyEntry]);

  const fistulaDropDownList = useSelector(
    (state: RootState) => state.fistula.fistulaDropdownData,
  );
  const { fistulaDropdownHandler } = useFistula();

  const buildHashPayload = <K extends keyof EntryType>(
    list: EntryType[],
    key: K,
  ) => list.map((item) => item[key] || "").join("#");

  useEffect(() => {
    fistulaDropdownHandler(() => {}, consultationDetailData?.type);
  }, []);

  useEffect(() => {
    if (!values) return;

    const extPos = values.external_opening_position?.split("#") || [];
    if (!extPos.length) {
      setPositions([emptyEntry]);
      return;
    }
    const internalOpeningDistance =
      values.internal_opening_distance?.split("#") || [];
    if (!extPos.length) {
      setPositions([emptyEntry]);
      return;
    }

    const secValve = values.secondary_anal_valve?.split("#") || [];
    const internalParts = values.internal_opening_position?.split("#") || [];

    const noOfExtPos = values.no_of_external_opening_position?.split("#") || [];
    const noOfTracks = values.no_of_tracks_in_one_fistula?.split("#") || [];
    const noOfSecPos =
      values.no_of_secondary_opening_position?.split("#") || [];
    const anyOther = values.any_other?.split("#") || [];

    const typeOfCrypt = values.type_of_crypt?.split("#") || [];
    const cryptCause = values.crypt_cause?.split("#") || [];
    const highLow = values.basis_of_high_low_riding?.split("#") || [];
    const distantVisceral =
      values.distant_visceral_communication?.split("#") || [];

    const fistulaSphincter = values.type_of_fistula_sphincter?.split("#") || [];
    const fistulaPosition = values.type_of_fistula_position?.split("#") || [];

    const mapped: EntryType[] = extPos.map((_, i) => ({
      external_opening_position: extPos[i] || "",
      internal_opening_distance: internalOpeningDistance[i] || "",
      secondary_anal_valve: secValve[i] || "",

      internal_opening_value: internalParts[i * 2] || "",
      internal_opening_level:
        internalParts[i * 2 + 1] || "Above the level of anal verge",

      no_of_external_opening_position: noOfExtPos[i] || "",
      no_of_tracks_in_one_fistula: noOfTracks[i] || "",
      no_of_secondary_opening_position: noOfSecPos[i] || "",
      any_other: anyOther[i] || "",

      type_of_crypt: typeOfCrypt[i] || "",
      crypt_cause: cryptCause[i] || "",
      basis_of_high_low_riding: highLow[i] || "",
      distant_visceral_communication: distantVisceral[i] || "",

      type_of_fistula_sphincter: fistulaSphincter[i] || "",
      type_of_fistula_position: fistulaPosition[i] || "",
    }));

    setPositions(mapped);
  }, [
    values?.external_opening_position,
    values?.secondary_anal_valve,
    values?.internal_opening_position,
    values?.no_of_external_opening_position,
    values?.internal_opening_distance,
    values?.no_of_tracks_in_one_fistula,
    values?.no_of_secondary_opening_position,
    values?.any_other,
    values?.type_of_crypt,
    values?.crypt_cause,
    values?.basis_of_high_low_riding,
    values?.distant_visceral_communication,
    values?.type_of_fistula_sphincter,
    values?.type_of_fistula_position,
  ]);

  /* ---------- Handlers ---------- */
  const handleChange = (
    index: number,
    field: keyof EntryType,
    value: string,
  ) => {
    setPositions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEntry = () => {
    setPositions((prev) => [
      ...prev,
      {
        ...emptyEntry,
        internal_opening_level: "Above the level of anal verge",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- Payload ---------- */

  const hashPayloads = Object.fromEntries(
    REPEATABLE_FIELDS.map((field) => [
      field,
      buildHashPayload(positions, field),
    ]),
  );

  const internalOpeningPayload = positions
    .map(
      (p) =>
        `${p.internal_opening_value || ""}#${p.internal_opening_level || ""}`,
    )
    .join("#");

  /* ---------- UI ---------- */
  return (
    <>
      <View className="flex justify-end items-center gap-2 mt-4">
        {/* <Text className="text-lg font-semibold">Positions</Text> */}
        <Button type="button" onPress={addEntry} className="flex gap-2">
          <Plus size={16} />
          <Text className="text-sm">Add</Text>
        </Button>
      </View>

      {positions.map((entry, index) => (
        <View key={index} className="mt-4 bg-gray-100 p-4 rounded-lg">
          <View className="flex justify-between items-center border-b pb-2 mb-4">
            <Text className="text-md font-semibold">Fistula #{index + 1}</Text>
            <Button
              type="button"
              onPress={() => removeEntry(index)}
              variant="danger"
            >
              <X size={16} />
            </Button>
          </View>

          {/* Row 1 */}

          <View className="mb-4">
            <Input
              id="no_of_tracks_in_one_fistula"
              name="no_of_tracks_in_one_fistula"
              label="No of Tracks in Fistula"
              value={entry.no_of_tracks_in_one_fistula || ""}
              onChange={(e: any) =>
                handleChange(
                  index,
                  "no_of_tracks_in_one_fistula",
                  e.target.value,
                )
              }
              placeholder="Enter No of Tracks in Fistula"
            />
          </View>

          {/* Row 2 */}
          <View className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <View className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Number of External Opening
              </label>
              <Input
                value={entry.no_of_external_opening_position}
                onChange={(e: any) =>
                  handleChange(
                    index,
                    "no_of_external_opening_position",
                    e.target.value,
                  )
                }
                placeholder="Ex: 6"
                className="flex-1 px-3 py-2 outline-none border-none"
              />
            </View>

            <View className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Positions of External Openings
              </label>
              <View className="flex items-center">
                <Input
                  value={entry.external_opening_position}
                  onChange={(e: any) =>
                    handleChange(
                      index,
                      "external_opening_position",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: 6"
                  className="flex-1 px-3 py-2 outline-none border-none"
                />
                <span className="px-3 py-2 bg-gray-200 border-l">o'clock</span>
              </View>
            </View>
            {/* <View className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Internal Opening Position
              </label>
              <View className="flex items-center border rounded-md">
                <Input
                  value={entry.secondary_opening_position}
                  onChange={(e: any) =>
                    handleChange(
                      index,
                      "secondary_opening_position",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: 6"
                  className="flex-1 px-3 py-2 outline-none border-none"
                />
                <span className="px-3 py-2 bg-gray-100 border-l">o'clock</span>
              </View>
            </View> */}
          </View>

          {/* Row 2*/}

          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <View className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Number of Secondary Opening
              </label>
              <Input
                value={entry.no_of_secondary_opening_position}
                onChange={(e: any) =>
                  handleChange(
                    index,
                    "no_of_secondary_opening_position",
                    e.target.value,
                  )
                }
                placeholder="Ex: 6"
                className="flex-1 px-3 py-2 outline-none border-none"
              />
            </View>

            <View className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                positions of secondary openings
              </label>
              <View className="flex items-center border rounded-md">
                <Input
                  value={entry.secondary_anal_valve}
                  onChange={(e: any) =>
                    handleChange(index, "secondary_anal_valve", e.target.value)
                  }
                  placeholder="Ex: 6"
                  className="flex-1 px-3 py-2 outline-none border-none"
                />
                {/* <span className="px-3 py-2 bg-gray-100 border-l">o'clock</span> */}
              </View>
            </View>
          </View>
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <View className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-medium text-slate-700">
                Internal Opening Distance
              </label>
              <View className="flex items-center">
                <Input
                  value={entry.internal_opening_distance}
                  onChange={(e: any) =>
                    handleChange(
                      index,
                      "internal_opening_distance",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: 6cm"
                  className="flex-1 px-3 py-2 outline-none border-none"
                />
                {/* <span className="px-3 py-2 bg-gray-200 border-l">o'clock</span> */}
              </View>
            </View>
            <View className="flex flex-col gap-2">
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-2">
                <View className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Positions of Internal Openings
                  </label>
                  <View className="flex items-center">
                    <Input
                      placeholder="e.g. 3"
                      // label="Positions of Internal Openings"
                      value={entry.internal_opening_value}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "internal_opening_value",
                          e.target.value,
                        )
                      }
                    />
                    <span className="px-3 py-2 bg-gray-200 border-l">
                      o'clock
                    </span>
                  </View>
                </View>

                <View className="flex flex-col">
                  <SingleSelector
                    label="At The Level"
                    options={INTERNAL_LEVEL_OPTIONS}
                    value={entry.internal_opening_level}
                    onChange={(val: string) =>
                      handleChange(index, "internal_opening_level", val)
                    }
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Row 3*/}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <View className="flex flex-col gap-2">
              <View className="">
                <Input
                  label="Any other"
                  value={entry.any_other}
                  onChange={(e) =>
                    handleChange(index, "any_other", e.target.value)
                  }
                />
              </View>
            </View>
          </View>

          {/* fistula classification */}
          <View className="mb-4">
            <Text className="text-md font-semibold mb-4">
              Fistula Classification
            </Text>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <View>
                <SingleSelector
                  id="type_of_crypt"
                  label="On The Basis Of Crypt"
                  name="type_of_crypt"
                  value={entry.type_of_crypt}
                  onChange={(val: string) =>
                    handleChange(index, "type_of_crypt", val)
                  }
                  placeholder="Select Fistula Crypt"
                  options={fistulaDropDownList
                    ?.filter((x) => x?.sub_fistula_name === "crypt")
                    .map((x) => ({
                      label: x.fistula_name,
                      value: x.fistula_name,
                    }))}
                />
              </View>
              <View>
                <Input
                  label="If Secondary, Cause"
                  value={entry.crypt_cause || ""}
                  onChange={(e) =>
                    handleChange(index, "crypt_cause", e.target.value)
                  }
                />
              </View>
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <View>
                <SingleSelector
                  id="type_of_fistula_sphincter"
                  label="On The Basis Of Sphincter"
                  name="type_of_fistula_sphincter"
                  value={entry.type_of_fistula_sphincter}
                  onChange={(val: string) =>
                    handleChange(index, "type_of_fistula_sphincter", val)
                  }
                  placeholder="Select Fistula Sphincter"
                  options={fistulaDropDownList
                    ?.filter((x) => x?.sub_fistula_name === "sphincter")
                    .map((x) => ({
                      label: x.fistula_name,
                      value: x.fistula_name,
                    }))}
                  // options={fistulaSphincterTypes}
                />
              </View>
              <View>
                <SingleSelector
                  id="type_of_fistula_position"
                  label="On The Basis Of Position"
                  name="type_of_fistula_position"
                  placeholder="Select Fistula Position"
                  value={entry.type_of_fistula_position}
                  onChange={(val: string) =>
                    handleChange(index, "type_of_fistula_position", val)
                  }
                  options={fistulaDropDownList
                    ?.filter((x) => x?.sub_fistula_name === "position")
                    .map((x) => ({
                      label: x.fistula_name,
                      value: x.fistula_name,
                    }))}
                />
              </View>
            </View>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <View>
                <SingleSelector
                  id="basis_of_high_low_riding"
                  label="On The Basis Of high/Low Riding"
                  name="basis_of_high_low_riding"
                  placeholder="Select Fistula High/Low Riding"
                  value={entry.basis_of_high_low_riding}
                  onChange={(val: string) =>
                    handleChange(index, "basis_of_high_low_riding", val)
                  }
                  options={fistulaDropDownList
                    ?.filter((x) => x?.sub_fistula_name === "high_low_riding")
                    .map((x) => ({
                      label: x.fistula_name,
                      value: x.fistula_name,
                    }))}
                  // options={fistulaSphincterTypes}
                />
              </View>
              <View>
                <Input
                  label="Any Other Distant or Visceral Communications"
                  value={entry.distant_visceral_communication || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "distant_visceral_communication",
                      e.target.value,
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Hidden backend fields */}
      {REPEATABLE_FIELDS.map((field) => (
        <Input key={field} hidden name={field} value={hashPayloads[field]} />
      ))}

      <Input
        hidden
        name="internal_opening_position"
        value={internalOpeningPayload}
      />
    </>
  );
};

export default OpeningPosition;
