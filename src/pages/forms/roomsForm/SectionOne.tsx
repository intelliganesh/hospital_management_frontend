import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { Rooms } from "@/interfaces/master/rooms";
import useForm from "@/utils/custom-hooks/use-form";
import { roomStatusOptions, roomTypeOptions } from "./roomFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsName: string;
  errorsRoomType: string;
  errorsWardId: string;
  errorsRoomNumber: string;
  errorsBedCount: string;
  errorsDescription: string;
  errorsStatus: string;
  errorsFloor: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsRoomType,
  errorsWardId,
  errorsRoomNumber,
  errorsBedCount,
  errorsDescription,
  errorsStatus,
  errorsFloor,
}) => {
  const wardDropdownData = useSelector(
    (state: RootState) => state?.wards?.wardDropdownData,
  );
  const wardOptions = wardDropdownData?.map((ward: any) => ({
    id: ward?.id,
    label: ward?.name,
    value: ward?.id,
  }));
  const roomsData = useSelector(
    (state: RootState) => state.room.currentRoom,
  ) as Partial<Rooms> | null;
  const { values, handleChange, onSetHandler } = useForm<Partial<Rooms> | null>(
    roomsData,
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
          <SingleSelector
            id="room_type"
            name="room_type"
            required={true}
            label="Room Type"
            error={errorsRoomType}
            value={values?.room_type || ""}
            placeholder="Select Room Type"
            onChange={(value) => {
              onSetHandler("room_type", value);
            }}
            options={roomTypeOptions}
          />
        </View>
        <View>
          <SingleSelector
            id="ward_id"
            name="ward_id"
            required={true}
            label="Ward"
            error={errorsWardId}
            value={values?.ward_id || ""}
            placeholder="Select Ward"
            onChange={(value) => {
              onSetHandler("ward_id", value);
            }}
            options={wardOptions}
          />
        </View>
        <View>
          <Input
            id="room_number"
            name="room_number"
            required={true}
            label="Room Number"
            value={values?.room_number || ""}
            error={errorsRoomNumber}
            placeholder="Ex: R-101"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="bed_count"
            name="bed_count"
            type="number"
            required={true}
            label="Bed Count"
            placeholder="Ex: 2"
            error={errorsBedCount}
            onChange={handleChange}
            value={values?.bed_count ?? ""}
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

        <View className="md:col-span-2">
          <Textarea
            id="description"
            name="description"
            label="Description"
            error={errorsDescription}
            value={values?.description || ""}
            placeholder="Room description"
            onChange={handleChange}
          />
        </View>
        <View>
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
