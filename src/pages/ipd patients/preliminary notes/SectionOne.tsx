import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import SingleSelector from "@/components/SingleSelector";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import { genderOptions } from "./preliminaryFormOptions";
import Textarea from "@/components/Textarea";
import Text from "@/components/text";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";

interface SectionOneProps {
  errorsName: string;
  errorsAge: string;
  errorsGender: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsAge,
  errorsGender,
}) => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData.ipd
  ) as Partial<PreliminaryNotes> | null;

  console.log("jdsfa", preliminaryNotes);

  const { values, handleChange, onSetHandler } =
    useForm<Partial<PreliminaryNotes> | null>(preliminaryNotes);

  return (
    <>
      {/* <Text as="h3" weight="font-semibold" className="text-xl text-gray-800">
        Patient Details
      </Text>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="patient_name"
            name="patient_name"
            required={true}
            label="Patient Name"
            error={errorsName}
            value={values?.patient_name}
            placeholder="Patient Name"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="patient_age"
            name="patient_age"
            label="Age"
            required={true}
            error={errorsAge}
            placeholder="Enter Age"
            onChange={handleChange}
            value={values?.patient_age}
          />
        </View>
        <View>
          <SingleSelector
            id="gender"
            label="Gender"
            name="gender"
            error={errorsGender}
            value={values?.gender || ""}
            placeholder="Select Gender"
            onChange={(value) => {
              onSetHandler("gender", value);
            }}
            options={genderOptions}
            closeOnSelect={true}
            required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="patient_phone"
            name="patient_phone"
            label="Phone Number"
            placeholder="Enter Phone No"
            onChange={handleChange}
            value={values?.patient_phone}
          />
        </View>
        <View>
          <Input
            id="patient_email"
            name="patient_email"
            label="Email Id"
            placeholder="Enter Email"
            onChange={handleChange}
            value={values?.patient_email}
          />
        </View>
        <View>
          <Input
            id="identification_no"
            name="identification_no"
            label="Passport/Aadhar Number"
            placeholder="Enter Passport/Aadhar Number"
            onChange={handleChange}
            value={values?.identification_no}
          />
        </View>
      </View>
      <View>
        <Textarea
          id="patient_address"
          name="patient_address"
          label="Address"
          placeholder="Enter Address"
          onChange={handleChange}
          value={values?.patient_address || ""}
        />
      </View>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="profession"
            name="profession"
            label="Profession"
            placeholder="Enter Profession"
            onChange={handleChange}
            value={values?.profession}
          />
        </View>
      </View> */}
      <View>
        <Text
          as="h3"
          weight="font-semibold"
          className="text-xl text-gray-800 mb-4"
        >
          Admission & Discharge Details
        </Text>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <View>
            <Input
              id="admission_date_time"
              name="admission_date_time"
              type="datetime-local"
              label="Date & Time of Admission"
              onChange={handleChange}
              value={
                values?.admission_date_time
                  ? values.admission_date_time.replace(" ", "T").slice(0, 16)
                  : ""
              }
            />
          </View>
          <View>
            <Input
              id="discharge_date_time"
              name="discharge_date_time"
              type="datetime-local"
              label="Date & Time of Discharge"
              onChange={handleChange}
              value={
                values?.discharge_date_time
                  ? values.discharge_date_time.replace(" ", "T").slice(0, 16)
                  : ""
              }
            />
          </View>

          {/* <View>
            <Input
              id="doa_time"
              name="doa_time"
              type="time"
              label="Time of Admission"
              placeholder="Select Time"
              onChange={handleChange}
              value={
                values?.doa_time
                  ? values?.doa_time
                  : dayjs().format("HH:mm") || ""
              }
            />
          </View> */}
        </View>
        {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          
          <View>
            <Input
              id="dod_time"
              name="dod_time"
              type="time"
              label="Time of Discharge"
              placeholder="Select Time"
              onChange={handleChange}
              value={values?.dod_time || ""}
            />
          </View>
        </View> */}
      </View>
      {/* <Text
        as="h3"
        weight="font-semibold"
        className="text-xl text-gray-800 mb-4"
      >
        Attendant Information
      </Text>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="patient_attendant_name"
            name="patient_attendant_name"
            label="Attendant Name"
            placeholder="Enter Attendant Name"
            onChange={handleChange}
            value={values?.patient_attendant_name}
          />
        </View>
        <View>
          <Input
            id="attendant_relation"
            name="attendant_relation"
            label="Relation"
            placeholder="e.g., Father, Spouse"
            onChange={handleChange}
            value={values?.attendant_relation}
          />
        </View>
        <View>
          <Input
            id="patient_attendant_phone"
            name="patient_attendant_phone"
            type="tel"
            label="Attendant Phone"
            placeholder="Enter Attendant Phone"
            onChange={handleChange}
            value={values?.patient_attendant_phone}
          />
        </View>
      </View> */}
    </>
  );
};
export default SectionOne;
