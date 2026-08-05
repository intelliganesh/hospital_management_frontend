import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
// import { Department } from "@/interfaces/departments";
import { Bed, BedType } from "@/interfaces/beds";
import { bedStatusOptions, bedTypeOptions } from "./bedsFormOptions";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";
import Textarea from "@/components/Textarea";
import { useEffect, useState } from "react";
import { useRoom } from "@/actions/calls/rooms";

interface SectionOneProps {
  errorsBedNo: string;
  errorsBedType: string;
  errorsRoomId: string;
  errorsStatus: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsBedNo,
  errorsBedType,
  errorsRoomId,
  errorsStatus,
}) => {
  const [wardId, setWardId] = useState<number | null>(null);
  const { roomDropdownHandler } = useRoom();
  const roomDropdownData = useSelector(
    (state: RootState) => state?.rooms?.roomDropdownData
  );
  const wardDropdownData = useSelector(
    (state: RootState) => state?.wards?.wardDropdownData
  );
  const roomObj = roomDropdownData?.map((room: any) => ({
    id: room?.id,
    label: room?.name,
    value: room?.id,
  }));
  const wardObj = wardDropdownData?.map((ward: any) => ({
    id: ward?.id,
    label: ward?.name,
    value: ward?.id,
  }));
  const bedData = useSelector(
    (state: RootState) => state?.beds?.bedDetailData
  ) as Partial<Bed> | null;
  const { values, handleChange, onSetHandler } = useForm<Partial<Bed> | null>(
    bedData
  );

  useEffect(() => {
    if (wardId) {
      roomDropdownHandler(wardId, () => { });
    }
  }, [wardId]);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <View>
          <Input
            id="bed_number"
            name="bed_number"
            required={true}
            label="Bed No"
            error={errorsBedNo}
            value={values?.bed_number || ""}
            placeholder="Ex: 101"
            onChange={handleChange}
          />
        </View>
        <View>
          <SingleSelector
            id="bed_type"
            name="bed_type"
            required={true}
            label="Bed Type"
            error={errorsBedType}
            value={values?.bed_type || BedType.SINGLE}
            options={bedTypeOptions}
            onChange={(e) => {
              onSetHandler("bed_type", e.currentTarget.value);
            }}
            placeholder="Select Bed Type"
          />
        </View>
        {/* <View>
          <Select
            id="size"
            name="size"
            required={true}
            label="Bed Size"
            error={errorsSize}
            value={values?.size + ""}
            options={bedSizeOptions}
            onChange={(e) => {
              onSetHandler("size", e.currentTarget.value);
            }}
            placeholder="Select Bed Size"
          />
        </View> */}
        <View>
          <SingleSelector
            id="ward_id"
            name="ward_id"
            label="Ward"
            value={wardId || ""}
            options={wardObj}
            onChange={(value) => {
              setWardId(value);
            }}
            placeholder="Select Ward"
          />
        </View>
        <View>
          <SingleSelector
            id="room_id"
            name="room_id"
            disabled={!wardId}
            label="Room"
            error={errorsRoomId}
            value={values?.room_id || ""}
            options={roomObj}
            onChange={(e) => {
              onSetHandler("room_id", e.currentTarget.value);
            }}
            placeholder="Select Room"
          />
        </View>
        {/* <View>
          <Input
            id="bed_type"
            name="bed_type"
            label="Bed Type"
            // error={errorsCode}
            value={values?.bed_type || ""}
            placeholder="Ex: Single"
            onChange={handleChange}
          />
        </View> */}
        <View>
          <SingleSelector
            id="status"
            name="status"
            required={true}
            label="Status"
            error={errorsStatus}
            value={values?.status || GenericStatus.ROOM_AVAILABLE}
            options={bedStatusOptions}
            onChange={(e) => {
              onSetHandler("status", e.currentTarget.value);
            }}
            placeholder="Select Status"
          />
        </View>
        <View className="col-span-2">
          <Textarea
            id="description"
            name="description"
            label="Description"
            // error={errorsCode}
            value={values?.description || ""}
            placeholder="Ex: Description"
            onChange={handleChange}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
