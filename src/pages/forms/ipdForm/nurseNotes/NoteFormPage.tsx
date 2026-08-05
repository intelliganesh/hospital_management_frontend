import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import { toast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import { NurseNotes } from "@/interfaces/ipd/nurseNotes";
import { useNurseNotes } from "@/actions/calls/ipd/nurseNotes";
import { FormTypeProps } from "@/interfaces/dashboard";
import useForm from "@/utils/custom-hooks/use-form";
import { clearNurseNotesDetailSlice } from "@/actions/slices/ipd/nurseNotes";
import { LoadingStatus } from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import { validationSchema } from "./nurseNotesFormValidation";
import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import { IPD_PATIENTS_DETAILS_URL, IPD_PATIENTS_URL, NURSE_NOTES_URL } from "@/utils/urls/frontend";
import BouncingLoader from "@/components/BouncingLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDateFormater } from "@/utils/custom-hooks/useDateFormater";

const NoteFormPage: React.FC<FormTypeProps> = ({
  formType = "add"
}) => {
  const { id: ipdID, noteId } = useParams<{
    id: string;
    noteId?: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = formType === "edit";
  const nurseNotesDetail = useSelector((state: RootState) => state.nurseNotes.nurseNotesDetailData);
  const {getCurrentDateTimeLocal} = useDateFormater()

  const nurseList = useSelector((state: RootState) => state.opd.allUserList)?.filter((nurse: any) => nurse.role === "Nurse")?.map((nurse: any) => ({
            label: nurse.name,
            value: nurse.id,
          }));

  const [isLoading, setIsLoading] = useState(false);
   
  

  const {addNurseNotesHandler, editNurseNotesHandler, nurseNotesListHandler,  nurseNotesDetailHandler, cleanUp} = useNurseNotes()

    const { PuaListHandler} = useOpd()
  

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
     if (formType === "add") {
       dispatch(clearNurseNotesDetailSlice()); // start fresh for new patient
     }
   }, [formType, dispatch]);

   useEffect(() => {
       if (isEditMode && noteId ) {
         nurseNotesDetailHandler(
           noteId,
           () => {},
           [],
           (status: LoadingStatus) => {
             setIsLoading(
               status === "pending"
                 ? true
                 : status === "failed"
                 ? true
                 : status === "success" && false
             );
           }
         );
       }
       return () => {
         cleanUp();
         dispatch(clearNurseNotesDetailSlice());
       };
     }, [noteId, formType]);

      useEffect(() => {
               PuaListHandler(() => {});
             }, []);
     
    const { values, handleChange, onSetHandler } =
    useForm<NurseNotes>(nurseNotesDetail || {});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
  
      let nurseNotesFormObj: Partial<NurseNotes> = {};
  
      for (let [key, value] of formData.entries()) {
        nurseNotesFormObj[key as keyof NurseNotes] = value as any;
      }

      nurseNotesFormObj = formType === "add" ? {...nurseNotesFormObj, ipd_id: ipdID}: {...nurseNotesFormObj, ipd_id: nurseNotesDetail?.ipd_id};

      nurseNotesFormObj["nurse_id"] = Number(values["nurse_id"]);
      nurseNotesFormObj["datetime"] = dayjs(values["datetime"]).format("YYYY-MM-DD HH:mm:ss");
       
      try {
        await validationSchema.validate(nurseNotesFormObj, { abortEarly: false });
        setFormErrors({});
        setIsSubmitting(true);
        if (formType === "add") {
          // Add new patient
          addNurseNotesHandler(
            nurseNotesFormObj,
            async (success: boolean) => {
              if (success) {
                navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${NURSE_NOTES_URL}`);
  
                toast({
                  title: "Success!",
                  description: "Note added successfully.",
                  variant: "success",
                });
                
                // await nurseNotesListHandler(ipdID, () => {});
              } else {
                setIsSubmitting(false);
              }
            }
          );
        } else if (noteId) {
           editNurseNotesHandler(
            noteId,
            nurseNotesFormObj,
            async (success: boolean) => {
              if (success) {
                navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${NURSE_NOTES_URL}`);
  
                toast({
                  title: "Success!",
                  description: "Note updated successfully.",
                  variant: "success",
                });
                
                // await nurseNotesListHandler(ipdID, () => {});
              } else {
                setIsSubmitting(false);
              }
            }
          );
          }
        } catch (err: any) {
        setIsSubmitting(false);
        if (err.inner) {
          const errors: Record<string, string> = {};
          err.inner.forEach((e: any) => {
            if (e.path) errors[e.path] = e.message;
          });
          setFormErrors(errors);
  
          formSubmissionFailMessage();
        }
      }
    };

   

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 flex flex-col items-center">
      {isLoading ? <BouncingLoader isLoading={isLoading} /> : null}

       <View className="w-full max-w-4xl">
        <Breadcrumb className="mb-4">
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink to={`${IPD_PATIENTS_URL}`}>IPD Patients</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}`}>
                            IPD Patient Details
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${NURSE_NOTES_URL}`}>
                            Nurse Notes
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {isEditMode ? "Edit Nurse Note" : "Add Nurse Note"}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
       </View>
     
      <View className="w-full max-w-4xl space-y-6">
        {/* Page Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {isEditMode ? "Edit Nurse Note" : "Add Nurse Note"}
            </Text>
            <Text
              as="p"
              className="text-slate-600 dark:text-slate-400 text-sm"
            >
              {formType === "add" ? dayjs().format("dddd, MMMM DD, YYYY") : nurseNotesDetail?.datetime ? dayjs(nurseNotesDetail?.datetime).format("dddd, MMMM DD, YYYY") : "N/A"}
            </Text>
          </View>
          <Button
            variant="outline"
            onPress={() => navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${NURSE_NOTES_URL}`)}
          >
            Cancel
          </Button>
        </View>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <View className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            {/* Basic Information Section */}

            {/* Remark 1 */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Remark 1
              </Text>
              <textarea
                id="remark1"
                name="remark1"
                value={values?.remark1 || ""}
                onChange={handleChange}
                placeholder="Enter initial remarks..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {formErrors.remark1 && (
                <Text className="text-red-500 text-sm mt-1">
                  {formErrors.remark1}
                </Text>
              )}
            </View>

            {/* Vitals Section - Always visible */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Vitals
              </Text>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <View>
                    <Input
                    id="temperature"
                    name="temperature"
                    label="Temperature (°F)"
                    type="text"
                    value={values?.temperature || ""}
                    onChange={handleChange}
                    placeholder="e.g., 98.6"
                  />
                  {formErrors.temperature && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.temperature}
                    </Text>
                  )}
                  </View>
                  <View>
                  <Input
                    id="bp"
                    name="bp"
                    label="Blood Pressure"
                    type="text"
                    value={values?.bp || ""}
                    onChange={handleChange}
                    placeholder="e.g., 120/80"
                  />
                  {formErrors.bp && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.bp}
                    </Text>
                  )}
                  </View>
                  <View>
                  <Input
                    id="pulse"
                    name="pulse"
                    label="Pulse (bpm)"
                    type="text"
                    value={values?.pulse || ""}
                    onChange={handleChange}
                    placeholder="e.g., 72"
                  />
                  {formErrors.pulse && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.pulse}
                    </Text>
                  )}
                  </View>
                  <View>
                  <Input
                    id="spo2"
                    name="spo2"
                    label="SpO₂ (%)"
                    type="text"
                    value={values?.spo2 || ""}
                    onChange={handleChange}
                    placeholder="e.g., 98"
                  />
                  {formErrors.spo2 && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.spo2}
                    </Text>
                  )}
                  </View>
              </View>
            </View>

            {/* Remark 2 */}
            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Remark 2
              </Text>
              <textarea
                id="remark2"
                name="remark2"
                value={values?.remark2 || ""}
                onChange={handleChange}
                placeholder="Enter additional remarks..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {formErrors.remark2 && (
                <Text className="text-red-500 text-sm mt-1">
                  {formErrors.remark2}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
                Nurse
              </Text>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <View>
                  <SingleSelector
                id="nurse"
                name="nurse_id"
                label="This Note document by"
                value={values?.nurse_id || ""}
                onChange={(value) => onSetHandler("nurse_id", value)}
                options={nurseList}
                placeholder="Select Nurse"
              />
              {formErrors.nurse && (
                <Text className="text-red-500 text-sm mt-1">
                  {formErrors.nurse}
                </Text>
              )}
                </View>
                <View>
                  <Input
                    id="datetime"
                    name="datetime"
                    label="Date & Time"
                    type="datetime-local"
                    value={dayjs(values?.datetime).format("YYYY-MM-DDTHH:mm") || getCurrentDateTimeLocal()}
                    onChange={handleChange}
                    placeholder="Enter Date & Time"
                  />
                  {formErrors.datetime && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.datetime}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Form Actions */}
            <View className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onPress={() =>
                  navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${NURSE_NOTES_URL}`)
                }
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? isSubmitting ? "Updating..." : "Update Note" : isSubmitting ? "Saving..." : "Save Note"}
              </Button>
            </View>
          </View>
        </form>
      </View>
    </View>
  );
};

export default NoteFormPage;
