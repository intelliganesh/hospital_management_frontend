import React, { useEffect } from "react";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { Consultation } from "@/interfaces/consultation";
import Input from "@/components/input";
import { useFistula } from "@/actions/calls/fistula";
import OpeningPosition from "./OpeningPosition";
import RadioGroup from "@/components/RadioGroup";
import Text from "@/components/text";
import { TAB_COLORS } from "../consultationFormConfig";
import Textarea from "@/components/Textarea";

interface SectionSevenProps {
  errorFistulaRecurrenceCount: string;
  initialData: any;
}

const SectionSeven: React.FC<SectionSevenProps> = ({
  errorFistulaRecurrenceCount,
  initialData,
}) => {
  // const [position] = useState("o'clock");

  const consultationDetailData = initialData;

  // const consultationDetailData = {
  //   ...consultationDetail?.consultations,
  //   ...consultationDetail?.proctologyOrNonProctology,
  // };

  const { fistulaDropdownHandler } = useFistula();

  const { values, handleChange, onSetHandler } = useForm<Consultation | null>(
    consultationDetailData,
  );

  useEffect(() => {
    fistulaDropdownHandler(() => {}, consultationDetailData?.type);
  }, []);

  return (
    <React.Fragment>
      {/* <CollapsibleContainer title="Fistula" variant="minimal"> */}
      <View className="mt-4">
        <Text
          as="h3"
          weight="font-bold"
          className={`${TAB_COLORS.fistula.textColor} mb-4`}
        >
          Fistula Findings
        </Text>
      </View>

      <View className="grid grid-cols-1 gap-6">
        {/* <View>
          <SingleSelector
            id="type_of_fistula_position"
            label="Type of Fistula"
            name="type_of_fistula_position"
            value={values?.type_of_fistula_position || ""}
            placeholder="Select Fistula Position"
            onChange={(value) => {
              onSetHandler("type_of_fistula_position", value);
            }}
            options={fistulaDropDownList
              ?.filter((x) => x?.sub_fistula_name === "position")
              .map((x) => ({
                label: x.fistula_name,
                value: x.fistula_name,
              }))}
          />
        </View>
        <View>
          <SingleSelector
            id="type_of_fistula_sphincter"
            label="Type of Fistula (Sphincter)"
            name="type_of_fistula_sphincter"
            value={values?.type_of_fistula_sphincter || ""}
            placeholder="Select Fistula Sphincter"
            onChange={(value) => {
              onSetHandler("type_of_fistula_sphincter", value);
            }}
            options={fistulaDropDownList
              ?.filter((x) => x?.sub_fistula_name === "sphincter")
              .map((x) => ({
                label: x.fistula_name,
                value: x.fistula_name,
              }))}
            // options={fistulaSphincterTypes}
          />
        </View> */}
        {/* <View>
          <Input
            id="no_of_tracks_in_one_fistula"
            name="no_of_tracks_in_one_fistula"
            label="No of Tracks in one Fistula"
            value={values?.no_of_tracks_in_one_fistula || ""}
            onChange={handleChange}
            placeholder="Enter No of Tracks in one Fistula"
          />
        </View> */}
        <View>
          <Input
            id="no_of_fistula"
            name="no_of_fistula"
            label="No of Anal Fistula"
            value={values?.no_of_fistula ?? "0"}
            onChange={handleChange}
            placeholder="Enter No of Anal Fistula"
          />
        </View>
        {/* Opening Position */}
        <View className="col-span-2">
          {Number(values?.no_of_fistula) > 0 && (
            <OpeningPosition initialData={initialData} />
          )}
        </View>

        {/* investigations */}

        <Text className="text-lg font-semibold">Investigations</Text>
        <View className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <View>
            <Input
              id="sono_fistula_gram"
              name="sono_fistula_gram"
              label="Sonofistulogram"
              value={values?.sono_fistula_gram || ""}
              onChange={handleChange}
              placeholder="Enter Sonofistulogram"
            />
          </View>
          <View>
            <Input
              id="mri_fistula_gram"
              name="mri_fistula_gram"
              label="MRI Fistulogram"
              value={values?.mri_fistula_gram || ""}
              onChange={handleChange}
              placeholder="Enter MRI Fistulogram"
            />
          </View>
        </View>
        <View className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <View className="flex flex-col gap-2">
            <label
              htmlFor="posterior_fistulous_angle"
              className="text-sm font-medium"
            >
              Posterior Fistulous Angle
            </label>
            <View className="flex items-center border rounded-md">
              <Input
                type="number"
                id="posterior_fistulous_angle"
                name="posterior_fistulous_angle"
                min={0}
                value={
                  Number(values?.posterior_fistulous_angle?.split(" ")[0]) || ""
                }
                onChange={(e) => {
                  const syntheticEvent = {
                    target: {
                      name: e.target.name,
                      value: e.target.value ? `${e.target.value} degree` : "",
                      type: e.target.type,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleChange(syntheticEvent);
                }}
                placeholder="Enter Posterior Fistulous Angle"
                className="flex-1 px-3 py-2 outline-none border-none"
              />
              <span className="px-3 py-2 bg-gray-100 border-l">degree</span>
            </View>
          </View>
          <View className="flex flex-col gap-2">
            <label
              htmlFor="posterior_fistulous_angle"
              className="text-sm font-medium"
            >
              Sonologist/Radiologist
            </label>
            <View>
              <Input
                id="sonologist"
                name="sonologist"
                // label="Sonologist"
                value={values?.sonologist || ""}
                onChange={handleChange}
                placeholder="Enter Sonologist"
              />
            </View>
          </View>
        </View>
      </View>

      <View className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <View className="mt-6">
          <Textarea
            id="sonologist_findings"
            name="sonologist_findings"
            label="Sonologist/Radiologist Findings"
            value={values?.sonologist_findings || ""}
            onChange={handleChange}
            placeholder="Enter Sonologist Findings"
          />
        </View>
        <View className="mt-6">
          <Textarea
            id="other_investigation"
            name="other_investigation"
            label="Any Other Investigations"
            value={values?.other_investigation || ""}
            onChange={handleChange}
            placeholder="Enter Any Other Investigations"
          />
        </View>
      </View>
      <View className="mt-6">
        <RadioGroup
          name="fistula_recurrence"
          label="Fistula Recurrence or New Case?"
          value={values?.fistula_recurrence || "new_case"}
          onChange={(value) => {
            onSetHandler("fistula_recurrence", value);
          }}
          options={[
            { label: "New Case", value: "new_case" },
            { label: "Recurrence", value: "recurrence" },
          ]}
          direction="horizontal"
          size="medium"
          variant="default"
        />
      </View>
      {values?.fistula_recurrence === "recurrence" && (
        <View className="mt-4">
          <Input
            type="number"
            id="fistula_recurrence_surgery_count"
            name="fistula_recurrence_surgery_count"
            label="Number of Times Undertaken Surgery"
            value={values?.fistula_recurrence_surgery_count || ""}
            onChange={handleChange}
            required={true}
            placeholder="Enter Number of Times Undertaken Surgery (Ex: 2)"
          />
          {errorFistulaRecurrenceCount && (
            <Text className="text-red-500 text-xs mt-1">
              {errorFistulaRecurrenceCount}
            </Text>
          )}
        </View>
      )}
      {/* </CollapsibleContainer> */}
    </React.Fragment>
  );
};
export default SectionSeven;
