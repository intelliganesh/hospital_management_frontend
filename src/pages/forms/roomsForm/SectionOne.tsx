import Input from "@/components/input";
import View from "@/components/view";
import { Rooms } from "@/interfaces/master/rooms";
import useForm from "@/utils/custom-hooks/use-form";
import { roomStatusOptions, roomTypeOptions } from "./roomFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsName: string;
  errorsType: string;
  errorsWardName: string;
  errorsWardType: string;
  errorsCapacity: string;
  errorsLocation: string;
  errorsStatus: string;
  errorsFloor: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsType,
  errorsWardName,
  errorsWardType,
  errorsCapacity,
  errorsLocation,
  errorsStatus,
  errorsFloor,
}) => {
  const roomsData = useSelector(
    (state: RootState) => state.room.currentRoom
  ) as Partial<Rooms> | null;
  const { values, handleChange, onSetHandler } = useForm<Partial<Rooms> | null>(
    roomsData
  );

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <View>
          <Input
            id="name"
            name="name"
            required={true}
            label="Room Name"
            error={errorsName}
            value={values?.name}
            placeholder="Room Name"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="type"
            name="type"
            required={true}
            label="Room Type"
            error={errorsType}
            value={values?.type}
            placeholder="Room Type"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="ward_name"
            name="ward_name"
            required={true}
            label="Ward Name"
            error={errorsWardName}
            placeholder="Ward Name"
            value={values?.ward_name}
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="ward_type"
            name="ward_type"
            label="Ward Type"
            value={values?.ward_type}
            error={errorsWardType}
            placeholder="Ward Type"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="capacity"
            name="capacity"
            required={true}
            label="Capacity"
            placeholder="Capacity"
            error={errorsCapacity}
            onChange={handleChange}
            value={values?.capacity ?? ""}
          />
        </View>
        <View>
          {/* <Select
            id="location"
            name="location"
            required={true}
            label="Location"
            placeholder="Location"
            error={errorsLocation}
            value={values?.location}
            options={roomTypeOptions}
            onChange={(e) => {
              onSetHandler("location", e.currentTarget.value);
            }}
          /> */}
          <SingleSelector
            id="location"
            label="Location"
            name="location"
            error={errorsLocation}
            value={values?.location || ""}
            placeholder="Select Location"
            onChange={(value) => {
              onSetHandler("location", value);
            }}
            options={roomTypeOptions}
          />
        </View>
        <View>
          <Input
            id="floor"
            name="floor"
            label="Floor"
            required={true}
            placeholder="Floor"
            error={errorsFloor}
            value={values?.floor}
            onChange={handleChange}
          />
        </View>
        <View>
          {/* <Select
            id="status"
            name="status"
            required={true}
            label="Status"
            placeholder="Status"
            error={errorsStatus}
            value={values?.status}
            options={roomStatusOptions}
            onChange={(e) => {
              onSetHandler("status", e.currentTarget.value);
            }}
          /> */}
          <SingleSelector
            id="status"
            label="Status"
            name="status"
            error={errorsStatus}
            value={values?.status || ""}
            placeholder="Select Status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            options={roomStatusOptions}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
