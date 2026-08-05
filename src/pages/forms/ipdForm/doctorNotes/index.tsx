import Button from "@/components/button";
import Text from "@/components/text";
import View from "@/components/view";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import dayjs from "dayjs";
import { DoctorNotes } from "@/interfaces/ipd/doctorNotes";
import { useDispatch, useSelector } from "react-redux";
import { useDoctorNotes } from "@/actions/calls/ipd/doctorNotes";
import { clearDoctorNotesDetailSlice } from "@/actions/slices/ipd/doctorNotes";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";
import { DOCTOR_NOTES_URL, IPD_PATIENTS_DETAILS_URL, IPD_PATIENTS_URL } from "@/utils/urls/frontend";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import { LoadingStatus } from "@/interfaces";
import { useOpd } from "@/actions/calls/opd";
import SingleSelector from "@/components/SingleSelector";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import { validationSchema } from "./doctorNotesFormValidation";
import { useDateFormater } from "@/utils/custom-hooks/useDateFormater";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BouncingLoader from "@/components/BouncingLoader";

const DoctorNotesForm = ({ formType = "add" }: { formType?: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getCurrentDateTimeLocal } = useDateFormater();
  const { id: ipdID, noteId } = useParams<{ id: string; noteId: string }>();
  const isEditMode = formType === "edit";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addDoctorNotesHandler, editDoctorNotesHandler, doctorNotesListHandler, doctorNotesDetailHandler, cleanUp } = useDoctorNotes()

  const doctorNotesDetail = useSelector((state: RootState) => state.doctorNotes.doctorNotesDetailData);

  const doctors = useSelector((state: RootState) => state.opd.userList);

  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));

  const { PuaListHandler } = useOpd();
  useEffect(() => {
    PuaListHandler(() => { });
  }, []);

  useEffect(() => {
    if (formType === "add") {
      dispatch(clearDoctorNotesDetailSlice()); // start fresh for new patient
    }
  }, [formType, dispatch]);

  useEffect(() => {
    console.log("noteId", noteId);
    if (isEditMode && noteId) {
      doctorNotesDetailHandler(
        noteId,
        () => { },
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
      dispatch(clearDoctorNotesDetailSlice());
    };
  }, [noteId, formType]);

  const doctorNotesFormObj = {
    ...doctorNotesDetail,
    date: doctorNotesDetail?.date ? dayjs(doctorNotesDetail?.date).format("YYYY-MM-DD") : "",
    time: doctorNotesDetail?.time ? dayjs(doctorNotesDetail?.time).format("HH:mm:ss") : "",
  }

  const { values, handleChange, onSetHandler } =
    useForm<DoctorNotes>(doctorNotesFormObj || {});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let doctorNotesFormObj: Partial<DoctorNotes> = {};

    for (let [key, value] of formData.entries()) {
      doctorNotesFormObj[key as keyof DoctorNotes] = value as any;
    }

    console.log(ipdID);


    doctorNotesFormObj = formType === "add" ? { ...doctorNotesFormObj, ipd_id: ipdID } : { ...doctorNotesFormObj, ipd_id: doctorNotesDetail?.ipd_id };

    doctorNotesFormObj["doctor_id"] = Number(values["doctor_id"]);
    doctorNotesFormObj["datetime"] = dayjs(values["datetime"]).format("YYYY-MM-DD HH:mm:ss");

    try {
      await validationSchema.validate(doctorNotesFormObj, { abortEarly: false });
      setErrors({});
      setIsSubmitting(true);
      if (formType === "add") {
        // Add new patient
        addDoctorNotesHandler(
          doctorNotesFormObj,
          async (success: boolean) => {
            if (success) {
              navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOCTOR_NOTES_URL}/${ipdID}`);

              toast({
                title: "Success!",
                description: "Note added successfully.",
                variant: "success",
              });

              // await doctorNotesListHandler(ipdID, () => { });
            } else {
              setIsSubmitting(false);
            }
          }
        );
      } else if (noteId) {
        editDoctorNotesHandler(
          noteId,
          doctorNotesFormObj,
          async (success: boolean) => {
            if (success) {
              navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOCTOR_NOTES_URL}/${ipdID}`);

              toast({
                title: "Success!",
                description: "Note updated successfully.",
                variant: "success",
              });

              // await doctorNotesListHandler(ipdID, () => { });
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
        setErrors(errors);

        formSubmissionFailMessage();
      }
    }
  };
  return (
    <View className="min-h-screen dark:bg-background flex flex-col items-center p-4">
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
              <BreadcrumbLink to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}${DOCTOR_NOTES_URL}/${ipdID}`}>
                Doctor Notes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditMode ? "Edit Doctor Note" : "Add Doctor Note"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </View>
      <View className="border border-border bg-white dark:bg-card rounded-lg shadow-card w-full max-w-5xl p-6 md:p-8">
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {isEditMode ? "Edit Doctor Note" : "Add Doctor Note"}
            </Text>
          </View>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Cancel
          </Button>
        </View>

        <form onSubmit={handleSubmit} className="space-y-6">
          <>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
              <SingleSelector
                id="doctor_id"
                label="Attending Doctor"
                name="doctor_id"
                error={errors?.doctor_id}
                value={values?.doctor_id || ""}
                placeholder="Select Attending Doctor"
                onChange={(value) => {
                  onSetHandler("doctor_id", value);
                }}
                options={doctorsObj}
                // closeOnSelect={true}
                required={true}
              />
              <Input
                id="datetime"
                name="datetime"
                label="Date & Time"
                type="datetime-local"
                value={dayjs(values?.datetime).format("YYYY-MM-DDTHH:mm") || getCurrentDateTimeLocal()}
                onChange={handleChange}
                placeholder="Enter Date & Time"
              />
              {/* <View>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  label="Date"
                  placeholder="Select Date"
                  onChange={handleChange}
                  error={errors?.date}
                  value={
                    values?.date
                      ? values?.date + ""
                      : new Date().toISOString().split("T")[0] || ""
                  }
                />
              </View>

              <View>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  label="Time"
                  placeholder="Select Time"
                  onChange={handleChange}
                  error={errors?.time}
                  value={values?.time ? values?.time : dayjs().format("HH:mm") || ""}
                />
              </View> */}
            </View>

            <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <View>
                <Input
                  id="gc"
                  name="gc"
                  label="GC"
                  placeholder="Conscious / Oriented"
                  onChange={handleChange}
                  value={values?.gc || ""}
                  error={errors?.gc}
                />
              </View>
              <View>
                <Input
                  id="bp"
                  name="bp"
                  label="BP"
                  placeholder="120/80 mmHg"
                  onChange={handleChange}
                  value={values?.bp || ""}
                  error={errors?.bp}
                />
              </View>
              <View>
                <Input
                  id="pr"
                  name="pr"
                  label="PR"
                  placeholder="72 bpm"
                  onChange={handleChange}
                  value={values?.pr || ""}
                  error={errors?.pr}
                />
              </View>
            </View>
            <View className="mb-4">
              <Textarea
                id="clinical_notes"
                name="clinical_notes"
                label="Clinical Notes"
                placeholder="Enter Notes"
                onChange={handleChange}
                value={values?.clinical_notes || ""}
                error={errors?.clinical_notes}
              />
            </View>
            <View>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                label="Diagnosis"
                placeholder="Enter Diagnosis"
                onChange={handleChange}
                error={errors?.diagnosis}
                value={values?.diagnosis || ""}
              />
            </View>
          </>
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
