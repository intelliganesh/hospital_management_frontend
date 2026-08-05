import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import SectionFour from "./SectionFour";
import SectionFive from "./SectionFive";
import SectionSix from "./SectionSix";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import { FormTypeProps } from "@/interfaces/dashboard";
import { usePreliminaryNotes } from "@/actions/calls/ipd/preliminaryNotes";
import { clearRoomDetailSlice } from "@/actions/slices/rooms";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import BouncingLoader from "@/components/BouncingLoader";
import { FileDown } from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";

const PreliminaryNotesForm: React.FC<FormTypeProps> = ({
  formType = "add",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // This is IPD ID
  const [, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get preliminary notes data from Redux
  const preliminaryNotesData = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData,
  ) as Partial<PreliminaryNotes> | null;
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();

  const {
    addPreliminaryNotes,
    updatePreliminaryNotes,
    preliminaryNotesDetail,
  } = usePreliminaryNotes();

  useEffect(() => {
    if (formType === "edit" && id) {
      setIsLoading(true);
      preliminaryNotesDetail(id, () => {
        setIsLoading(false);
      });
    }

    return () => {
      dispatch(clearRoomDetailSlice());
      // Clear preliminary notes data if you have such action
      // dispatch(clearPreliminaryNotesDetailSlice());
    };
  }, [id, formType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const preliminaryNotesFormObj: Partial<PreliminaryNotes> = {};

    try {
      for (let [key, value] of formData.entries()) {
        preliminaryNotesFormObj[key as keyof PreliminaryNotes] = value as any;
      }

      // await validationForm.validate(preliminaryNotesFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);

      if (formType === "add" && id !== undefined) {
        // ADD MODE: Use IPD ID
        addPreliminaryNotes(id, preliminaryNotesFormObj, (success: boolean) => {
          setIsSubmitting(false);

          if (success) {
            // navigate(-1);
            preliminaryNotesDetail(id, () => {
              setIsLoading(false);
            });
            toast({
              title: "Success!",
              description: "Preliminary Notes added successfully.",
              variant: "success",
            });
          } else {
            toast({
              title: "Error!",
              description: "Failed to add Preliminary Notes",
              variant: "destructive",
            });
          }
        });
      } else if (formType === "edit" && id) {
        // EDIT MODE: Use Preliminary Notes ID from Redux data
        const preliminaryNotesId = preliminaryNotesData?.id;

        if (!preliminaryNotesId) {
          setIsSubmitting(false);
          toast({
            title: "Error!",
            description: "Preliminary notes ID not found. Cannot update.",
            variant: "destructive",
          });
          return;
        }

        updatePreliminaryNotes(
          preliminaryNotesId, // Use preliminary notes ID, not IPD ID
          preliminaryNotesFormObj,
          (success: boolean) => {
            setIsSubmitting(false);
            if (success) {
              // navigate(-1);
              toast({
                title: "Success!",
                description: "Preliminary Notes updated successfully.",
                variant: "success",
              });
            } else {
              toast({
                title: "Error!",
                description: "Failed to update Preliminary Notes",
                variant: "destructive",
              });
            }
          },
        );
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

  // Show loading spinner while fetching preliminary notes data
  if (isLoading) {
    return <BouncingLoader isLoading={true} />;
  }

  return (
    <View className="min-h-screen dark:bg-background flex flex-col items-center p-4">
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-7xl p-6 md:p-8">
        <View className="flex justify-between items-center mb-2">
          <Text as="h2" weight="font-bold" className="text-2xl text-primary">
            {formType === "edit" ? "Edit" : "Add"} Preliminary Notes
          </Text>
          <View className="flex space-x-2">
            {formType === "edit" && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onPress={() => {
                  if (id) {
                    fetchAndDownloadPdf(
                      id,
                      IPD_GENERATE_PDF_URL,
                      "preliminary_notes",
                      () => {},
                    );
                  }
                }}
                disabled={isPdfDownloading}
              >
                {isPdfDownloading ? (
                  <BouncingLoader isLoading={isPdfDownloading} />
                ) : (
                  <FileDown size={14} />
                )}
                Generate PDF
              </Button>
            )}
            <Button variant="outline" onPress={() => navigate(-1)}>
              Back
            </Button>
          </View>
        </View>
        <Text as="p" className="text-text-light text-left mb-6">
          {formType === "edit" ? (
            <>
              Update the preliminary details{" "}
              <span className="text-primary font-semibold">
                {preliminaryNotesData?.ipd?.patient_name}
              </span>{" "}
              <span className="text-secondary font-medium">
                ({preliminaryNotesData?.ipd?.ipd_number})
              </span>
            </>
          ) : (
            "Fill in the preliminary details"
          )}
        </Text>

        {formType === "edit" && (
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <View>
              <Text as="p" className="text-text-light text-left mb-1">
                IPD Number
              </Text>
              <Text as="p" className="text-text font-semibold">
                {preliminaryNotesData?.ipd?.ipd_number}
              </Text>
            </View>

            <View>
              <Text as="p" className="text-text-light text-left mb-1">
                Patient Name
              </Text>
              <Text as="p" className="text-text font-semibold">
                {preliminaryNotesData?.ipd?.patient_name}
              </Text>
            </View>
            <View>
              <Text as="p" className="text-text-light text-left mb-1">
                Patient Phone
              </Text>
              <Text as="p" className="text-text font-semibold">
                {preliminaryNotesData?.ipd?.patient_phone}
              </Text>
            </View>
          </View>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <SectionOne
            errorsName={errors.name}
            errorsAge={errors.age}
            errorsGender={errors.gender}
          /> */}
          <Text
            as="h3"
            weight="font-semibold"
            className="text-xl text-gray-800 mb-4"
          >
            Clinical History
          </Text>
          <SectionTwo />
          <Text as="h3" className="font-semibold text-lg">
            Vital Signs
          </Text>
          <SectionThree />
          <Text as="h3" className="font-semibold text-lg">
            Examinations
          </Text>
          <SectionFour />
          <Text as="h3" className="font-semibold text-lg mb-3 mt-6">
            Laboratory Investigations
          </Text>
          <SectionFive />
          <Text as="h3" className="font-semibold text-lg mb-3 mt-6">
            Diagnosis & Treatment Plan
          </Text>
          <SectionSix />
          <View className="col-span-2 mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className="w-full bg-primary text-white rounded-md py-3 font-medium hover:bg-primary-600 transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
            >
              {isSubmitting
                ? "Submitting..."
                : formType === "edit"
                  ? "Update Preliminary Notes"
                  : "Submit Preliminary Notes"}
            </Button>
          </View>
        </form>
      </View>
    </View>
  );
};

export default PreliminaryNotesForm;
