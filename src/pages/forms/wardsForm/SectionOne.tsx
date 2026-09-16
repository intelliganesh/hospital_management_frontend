import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { wardStatusOptions, wardTypeOptions } from "./wardFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Ward } from "@/interfaces/wards";
// import TipTapTextEditor from "@/components/TipTapTexteditor";
import Textarea from "@/components/Textarea";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";

interface SectionOneProps {
  errorsName: string;
  errorsType: string;
  errorsWardNumber: string;
  errorsStatus: string;
  errorsFloor: string;
  errorsDescription: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsType,
  errorsWardNumber,
  errorsStatus,
  errorsFloor,
  errorsDescription,
}) => {
  const wardsData = useSelector(
    (state: RootState) => state.wards.wardDetailData
  ) as Partial<Ward> | null;

  
  const { values, handleChange, onSetHandler } = useForm<Partial<Ward> | null>(
    wardsData
  );

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <View>
          <Input
            id="name"
            name="name"
            required={true}
            label="Ward Name"
            error={errorsName}
            value={values?.name || ""}
            placeholder="Enter Ward Name"
            onChange={handleChange}
          />
        </View>
        {/* <View>
          <Input
            id="code"
            name="code"
            label="Ward Code"
            error={errorsCode}
            value={values?.code}
            placeholder="Enter Ward Code"
            onChange={handleChange}
          />
        </View> */}
        <View>
          <Input
            id="ward_number"
            name="ward_number"
            required={true}
            label="Ward Number"
            error={errorsWardNumber}
            value={values?.ward_number || ""}
            placeholder="Enter Ward Number"
            onChange={handleChange}
          />
        </View>
        <View>
          <SingleSelector 
            label="Ward Type"
            required={true}
            id="type"
            name="type"
            error={errorsType}
            options={wardTypeOptions}
            placeholder="Select Ward Type"
            value={values?.type}
            onChange={(e) => {
              onSetHandler("type", e.target.value);
            }}
          />
        </View>
        
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* <View>
          <Input
            type="number"
            id="capacity"
            name="capacity"
            label="Capacity"
            placeholder="Enter Capacity"
            error={errorsCapacity}
            onChange={handleChange}
            value={values?.capacity ?? 0}
          />
        </View> */}
        <View>
           <Input 
            id="floor"
            name="floor"
            required={true}
            label="Floor"
            error={errorsFloor}
            value={values?.floor || ""}
            placeholder="Enter Floor"
            onChange={handleChange}
          />
        </View>
        {/* <View>
          <Select
            id="location"
            name="location"
            required={true}
            label="Location"
            placeholder="Location"
            error={errorsLocation}
            value={values?.location}
            options={wardLocationOptions}
            onChange={(e) => {
              onSetHandler("location", e.currentTarget.value);
            }}
          />
        </View> */}
        <View>
          <SingleSelector
            id="status"
            name="status"
            required={true}
            label="Status"
            placeholder="Status"
            error={errorsStatus}
            value={values?.status || GenericStatus.ACTIVE}
            options={wardStatusOptions}
            onChange={(e) => {
              onSetHandler("status", e.currentTarget.value);
            }}
          />
        </View>
        <View className="col-span-2">
          {/* <TipTapTextEditor
            name="description"
            label="Description"
            areaHeight="h-24"
            placeholder="Enter Description"
            error={errorsDescription}
            value={values?.description || ""}
            onChange={ (value, name) => {
              onSetHandler(name, value);
            }}
          /> */}
          <Textarea
            id="description"
            name="description"
            label="Description"
            error={errorsDescription}
            onChange={handleChange}
            placeholder="Enter Description"
            value={values?.description ?? ""}
          />
        </View>
        
      </View>
    </>
  );
};
export default SectionOne;
