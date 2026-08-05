import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import SectionOne from "./SectionOne";
import dayjs from "dayjs";

const DoctorNotesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj: Record<string, any> = {};

    for (let [key, value] of formData.entries()) {
      formObj[key] = value;
    }

    try {
      setIsSubmitting(true);

      // 🔗 API call can be added here
      console.log("Preliminary Notes Payload:", formObj);

      toast({
        title: "Success",
        description: "Preliminary Notes saved successfully",
        variant: "success",
      });

      navigate(-1);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="min-h-screen dark:bg-background flex flex-col items-center p-4">
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-5xl p-6 md:p-8">
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {isEditMode ? "Edit Doctor Note" : "Add Doctor Note"}
            </Text>
            {/* <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              {dayjs().format("dddd, MMMM DD, YYYY")}
            </Text> */}
          </View>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Cancel
          </Button>
        </View>

        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionOne errorsDate={errors.date} errorsTime={errors.time} />
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

export default DoctorNotesForm;
