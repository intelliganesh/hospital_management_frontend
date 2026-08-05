import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import SectionOne from "./SectionOne";
import { useEffect, useState } from "react";
import { validationForm } from "./validationForm";
import { toast } from "@/utils/custom-hooks/use-toast";
import { FormTypeProps } from "@/interfaces/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useBeds } from "@/actions/calls/beds";
import { clearBedDetailSlice } from "@/actions/slices/beds";
import { Bed } from "@/interfaces/beds";
import { useRoom } from "@/actions/calls/rooms";
import { useWards } from "@/actions/calls/wards";
import { RootState } from "@/actions/store";
// import { RootState } from "@/actions/store";

const BedsForm: React.FC<FormTypeProps> = ({ formType = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addBedHandler, bedDetailHandler, editBedHandler } = useBeds();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { wardDropdownHandler } = useWards();
  useEffect(() => {
    if (formType === "edit" && id) {
      bedDetailHandler(id, () => { });
    }
    wardDropdownHandler(() => { });
    return () => {
      dispatch(clearBedDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let bedFormObj: Partial<Bed> = {};

    try {
      for (let [key, value] of formData.entries()) {
        bedFormObj[key as keyof Bed] = value as any;
      }
      // bedFormObj["is_active"] =
      //   bedFormObj["is_active" as keyof Bed] === "1" ? true : false;
      console.log("bedFormObj", bedFormObj);
      await validationForm.validate(bedFormObj, { abortEarly: false });
      setErrors({});




      // console.log("bedFormObj", bedFormObj);
      setIsSubmitting(true);
      if (formType === "add") {
        addBedHandler(bedFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Bed Added successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to add Bed",
              variant: "destructive",
            });
          }
        });
      } else if (id) {
        editBedHandler(id, bedFormObj, (success: boolean) => {
          if (success) {
            navigate(-1);
            toast({
              title: "Success!",
              description: "Bed Updated successfully.",
              variant: "success",
            });
          } else {
            setIsSubmitting(false);
            toast({
              title: "Error!",
              description: "Failed to update Bed",
              variant: "destructive",
            });
          }
          setIsSubmitting(false);
        });
      }
    } catch (error: any) {
      console.log("error", error);
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
            Bed Registration
          </Text>
          <Button onPress={() => navigate(-1)} variant="outline">
            Back to Home
          </Button>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {/* {formType === "add" && "Fill in the details to create a new account"} */}
          Fill in the details to register Bed
        </Text>
        <form onSubmit={handleSubmit}>
          <SectionOne
            errorsBedNo={errors.bed_number}
            errorsBedType={errors.bed_type}
            errorsRoomId={errors.room_id}
            errorsStatus={errors.status}
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

export default BedsForm;
