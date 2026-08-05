import Input from "@/components/input";
import View from "@/components/view";
import { Rooms } from "@/interfaces/rooms";
import useForm from "@/utils/custom-hooks/use-form";
import { roomStatusOptions, roomTypeOptions } from "./roomFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";
import { useWards } from "@/actions/calls/wards";
import { useEffect } from "react";
import Textarea from "@/components/Textarea";
import { GenericStatus } from "@/interfaces";

interface SectionOneProps {
  errorsName: string;
  errorsType: string;
  errorsRoomNumber: string;
  errorsWardId: string;
  errorsBedCount: string;
  errorsStatus: string;
  errorsFloor: string;
  errorsDescription: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsType,
  errorsRoomNumber,
  errorsWardId,
  errorsBedCount,
  errorsStatus,
  errorsFloor,
  errorsDescription,
}) => {
  const roomsData = useSelector(
    (state: RootState) => state.rooms.roomDetailData
  ) as Partial<Rooms> | null;
  const { values, handleChange, onSetHandler } = useForm<Partial<Rooms> | null>(
    roomsData
  );

  const {wardDropdownHandler} = useWards();
  const wardDropdownData = useSelector(
    (state: RootState) => state.wards.wardDropdownData
  );
  const wardObj = wardDropdownData?.map((ward: any) => ({
    id: ward?.id,
    label: ward?.name,
    value: ward?.id,
  }));

  useEffect(() => {
    wardDropdownHandler(() => {});
  }, []);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <View>
          <Input
            id="name"
            name="name"
            required={true}
            label="Room Name"
            error={errorsName}
            value={values?.name || ""}
            placeholder="Room Name"
            onChange={handleChange}
          />
        </View>
        <View>
          <SingleSelector 
            label="Room Type"
            required={true}
            id="room_type"
            name="room_type"
            error={errorsType}
            options={roomTypeOptions}
            placeholder="Select Room Type"
            value={values?.room_type}
            onChange={(e) => {
              onSetHandler("room_type", e.target.value);
            }}
          />
        </View>
        <View>
          <Input
            id="room_number"
            name="room_number"
            label="Room Number"
            error={errorsRoomNumber}
            value={values?.room_number || ""}
            placeholder="Room Number"
            onChange={handleChange}
            required={true}
          />
        </View>
        
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          <SingleSelector
            id="ward_id"
            name="ward_id"
            required={true}
            label="Ward"
            error={errorsWardId}
            value={values?.ward_id || ""}
            options={wardObj}
            onChange={(e) => {
              onSetHandler("ward_id", e.target.value);
            }}
            placeholder="Select Ward"
          />
        </View>
         <View>
          <Input
            id="floor"
            name="floor"
            label="Floor"
            placeholder="Floor"
            error={errorsFloor}
            value={values?.floor}
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="bed_count"
            name="bed_count"
            type="number"
            required={true}
            label="Beds Capacity"
            placeholder="Beds Capacity"
            error={errorsBedCount}
            onChange={handleChange}
            value={values?.bed_count ?? 1}
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
            required={true}
            error={errorsStatus}
            value={values?.status || GenericStatus.ROOM_AVAILABLE}
            placeholder="Select Status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            options={roomStatusOptions}
          />
        </View>

        <View className="col-span-2">
          <Textarea
            id="description"
            name="description"
            label="Description"
            error={errorsDescription}
            value={values?.description || ""}
            placeholder="Description"
            onChange={handleChange}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
