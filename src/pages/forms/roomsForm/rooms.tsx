import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { Rooms } from "@/interfaces/master/rooms";
import { validationForm } from "./validationForm";
import { useRoom } from "@/actions/calls/room";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch } from "react-redux";
import { clearRoomByIdSuccess } from "@/actions/slices/room";

const RoomsForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addRoom, getRoomById, updateRoom } = useRoom();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formType === "edit" && id) {
      getRoomById(id, () => {});
    }
    return () => {
      dispatch(clearRoomByIdSuccess());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let roomFormObj: Partial<Rooms> = {};

    try {
      for (let [key, value] of formData.entries()) {
        roomFormObj[key as keyof Rooms] = value as any;
      }
      await validationForm.validate(roomFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        addRoom(roomFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Room Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description:  "Failed to add Room",
            //   variant: "destructive",
            // });
          }
        });
      } else if (id) {
        updateRoom(id, roomFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Room Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            // toast({
            //   title: "Error!",
            //   description: "Failed to update Room",
            //   variant: "destructive",
            // });
          }
          setIsSubmitting(false);
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <View className="min-h-screen dark:bg-background flex flex-col  items-center p-4">
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-4xl p-6 md:p-8 mb-8">
        <View className=" flex items-center justify-between">
          <Text
            as="h2"
            weight="font-bold"
            className="text-2xl font-bold text-center text-primary "
          >
            Room Registration
          </Text>
          <Button onPress={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details to register Room
        </Text>
        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsName={errors.name}
            errorsType={errors.type}
            errorsWardName={errors.ward_name}
            errorsWardType={errors.ward_type}
            errorsCapacity={errors.capacity}
            errorsLocation={errors.location}
            errorsStatus={errors.status}
            errorsFloor={errors.floor}
          />
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </View>
        </form>
      </View>
    </View>
  );
};

export default RoomsForm;
