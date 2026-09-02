import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import PatientInfoCard from "@/components/Notes Components/PatientInfoCard";
import CustomDateSelector from "@/components/Notes Components/CustomDateSelector";
import NoteCard from "@/components/Notes Components/NoteCard";
import { FileDown, Plus } from "lucide-react";
import dayjs from "dayjs";
import {
  DOCTOR_NOTES_ADD_URL,
  DOCTOR_NOTES_EDIT_URL,
  IPD_PATIENTS_DETAILS_URL,
  IPD_PATIENTS_URL,
} from "@/utils/urls/frontend";
import { useDispatch, useSelector } from "react-redux";
import { useIpdPatients } from "@/actions/calls/ipd";
import { RootState } from "@/actions/store";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { LoadingStatus } from "@/interfaces";
import { clearDoctorNotesDetailSlice } from "@/actions/slices/ipd/doctorNotes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BouncingLoader from "@/components/BouncingLoader";
import Modal from "@/components/Modal";
import DeleteLoader from "@/components/deleteLoader";
import { useDoctorNotes } from "@/actions/calls/ipd/doctorNotes";
import useColors from "@/utils/custom-hooks/use-colors";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import {
  IPD_DOWNLOAD_PDF_URL,
  IPD_GENERATE_PDF_URL,
} from "@/utils/urls/backend";

const DoctorNotesPage: React.FC = () => {
  const { id: ipdID } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  const dispatch = useDispatch();
  const { getColor } = useColors();

  const [searchParams] = useSearchParams();
  const { ipdPatientDetailHandler, cleanUp: ipdCleanup } = useIpdPatients();

  const { doctorNotesListHandler, deleteDoctorNotesHandler, cleanUp } =
    useDoctorNotes();
  const doctorNotesList = useSelector(
    (state: RootState) => state.doctorNotes.doctorNotesListData,
  );

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );
  const isDischarged =
    ipdPatientDetailData?.status?.toLowerCase() === "discharged";

  const handleDoctorNotesPdf = () => {
    if (!ipdID) return;

    fetchAndDownloadPdf(
      ipdID,
      isDischarged ? IPD_DOWNLOAD_PDF_URL : IPD_GENERATE_PDF_URL,
      "doctor_notes",
      () => {},
    );
  };

  // useEffect(() => {
  //   // Group notes by date
  //   const grouped = notes.reduce((acc, note) => {
  //     const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");
  //     if (!acc[dateKey]) {
  //       acc[dateKey] = [];
  //     }
  //     acc[dateKey].push(note);
  //     return acc;
  //   }, {} as Record<string, NoteData[]>);
  //   setGroupedNotes(grouped);
  // }, [notes, selectedDate]);

  useEffect(() => {
    if (ipdID) {
      ipdPatientDetailHandler(
        ipdID,
        () => {},
        [],
        (status: LoadingStatus) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
    return () => {
      ipdCleanup();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [ipdID, dispatch]);

  useEffect(() => {
    if (!ipdID) return;

    doctorNotesListHandler(
      searchParams?.get("currentPage") ?? 1,
      () => {},
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      {
        ipd_id: ipdID,
        datetime: dayjs(selectedDate || new Date()).format("YYYY-MM-DD"),
      },
      (status: LoadingStatus) => {
        setIsLoading(
          status === "pending"
            ? true
            : status === "failed"
              ? true
              : status === "success" && false,
        );
      },
    );

    return () => {
      cleanUp();
      dispatch(clearDoctorNotesDetailSlice());
    };
  }, [
    selectedDate,
    ipdID,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddNote = () => {
    navigate(
      `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${DOCTOR_NOTES_ADD_URL}`,
    );
  };

  const handleEditNote = (noteId: string) => {
    navigate(
      `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}${DOCTOR_NOTES_EDIT_URL}/${noteId}`,
    );
  };

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleDeleteNote = () => {
    if (deleteId) {
      deleteDoctorNotesHandler(
        deleteId,
        (success: boolean) => {
          if (success) {
            doctorNotesListHandler(
              searchParams?.get("currentPage") ?? 1,
              () => {
                modalCloseHandler();
              },
              searchParams.get("search") ?? null,
              searchParams.get("sort_by") ?? null,
              searchParams.get("sort_order") ?? null,
              {
                ipd_id: ipdID,
                datetime: dayjs(selectedDate || new Date()).format(
                  "YYYY-MM-DD",
                ),
              },
            );
          }
        },
        (status: LoadingStatus) => {
          setIsDeleting(
            status === "pending"
              ? true
              : status === "failed"
                ? false
                : status === "success" && false,
          );
        },
      );
    }
  };

  const patientDetails = [
    {
      label: "Patient Name",
      value: ipdPatientDetailData?.patient_name || "N/A",
    },
    {
      label: "Age | Gender",
      value: `${ipdPatientDetailData?.patient?.age || "N/A"} years | ${ipdPatientDetailData?.patient?.gender || "N/A"}`,
    },
    { label: "IPD Number", value: ipdPatientDetailData?.ipd_number || "N/A" },
    {
      label: "Ward | Room | Bed",
      value: `${ipdPatientDetailData?.ward_type || "N/A"} | ${ipdPatientDetailData?.room_number || "N/A"} | ${ipdPatientDetailData?.bed_number || "N/A"}`,
    },
  ];

  return (
    <View className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 flex flex-col justify-center">
      {isLoading ? <BouncingLoader isLoading={isLoading} /> : null}
      <Modal
        title="Delete Note"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        closeOnOutsideClick={false}
        description="Are you sure you want to delete this note? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex items-center gap-2"
            onPress={handleDeleteNote}
          >
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>

      {/* <View> */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to={`${IPD_PATIENTS_URL}`}>
              IPD Patients
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              to={`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}`}
            >
              {ipdPatientDetailData?.patient_name || "Details"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Doctor Notes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <View className="w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <View className="flex justify-between items-center">
          <View>
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-white flex gap-2"
            >
              Doctor Notes for Patient{" "}
              <Text weight="font-semibold" className="text-primary !text-2xl">
                {ipdPatientDetailData?.patient_name}
              </Text>
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              IPD Number: {ipdPatientDetailData?.ipd_number}
            </Text>
          </View>
          <View className="flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onPress={handleDoctorNotesPdf}
              disabled={isPdfDownloading}
            >
              {isPdfDownloading ? (
                <BouncingLoader isLoading={isPdfDownloading} />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              {isDischarged ? "Download PDF" : "Generate PDF"}
            </Button>
            <Button variant="outline" onPress={() => navigate(`${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdID}`, { replace: true })}>
              Back
            </Button>
          </View>
        </View>

        {/* Patient Information Card */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PatientInfoCard
            title="Patient Information"
            patientDetails={patientDetails}
            columns={3}
          />
          <PatientInfoCard
            title="Staffs"
            patientDetails={
              ipdPatientDetailData?.staffs.length > 0
                ? [
                    {
                      user_role: "Primary Consultant Doctor",
                      user_name: ipdPatientDetailData?.doctor_name,
                    },
                    ...ipdPatientDetailData?.staffs,
                  ]
                    .flat()
                    .map((staff: any) => {
                      return {
                        label:
                          `${staff.user_role
                            .replace("_", " ")
                            .split(" ")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}` || "N/A",
                        value: staff.user_name || "N/A",
                      };
                    })
                : []
            }
            columns={3}
            features={{ reverseLabelValue: true }}
          />
        </View>

        {/* Notes Toolbar */}
        <View className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <View className="flex flex-wrap items-center justify-between gap-4">
            <CustomDateSelector
              value={selectedDate}
              onChange={handleDateChange}
              onConfirm={handleDateChange}
              label="Filter by Date"
              className="flex-1"
            />
            <Button onPress={handleAddNote} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Note
            </Button>
          </View>
        </View>

        {/* Notes List Grouped by Date */}
        <View className="space-y-6">
          {doctorNotesList?.data?.length > 0 && (
            <View className="space-y-4">
              {/* Date Header */}
              <View className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                  {dayjs(selectedDate).format("dddd, MMMM DD, YYYY")}
                </Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  Total Notes: {doctorNotesList?.data?.length}
                </Text>
              </View>

              {/* Notes for this date */}
              <View className="space-y-4">
                {doctorNotesList?.data?.map((note: any, index: number) => (
                  <NoteCard
                    key={index}
                    note={{
                      ...note,
                      documentedBy: "Dr. " + note.doctor_name,
                    }}
                    onEdit={handleEditNote}
                    onDelete={() => setDeleteId(note.id)}
                    style={{
                      borderLeftColor: getColor(index),
                    }}
                    renderContent={(note) => (
                      <View className="space-y-4">
                        {/* Vitals Section */}
                        {(note.gc || note.bp || note.pr) && (
                          <View
                            className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-background`}
                          >
                            <Text className="text-md font-semibold text-slate-600 dark:text-slate-400 mb-3">
                              Vitals
                            </Text>
                            <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {note.gc && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    GC
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.gc}
                                  </Text>
                                </View>
                              )}
                              {note.bp && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    Blood Pressure
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.bp}
                                  </Text>
                                </View>
                              )}
                              {note.pr && (
                                <View>
                                  <Text className="text-xs text-slate-500 dark:text-slate-400">
                                    PR
                                  </Text>
                                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {note.pr}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        )}

                        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Remark 1 */}
                          {note?.clinical_notes && (
                            <View>
                              <Text className="text-md font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                Clinical Notes
                              </Text>
                              <Text className="text-sm text-slate-700 dark:text-slate-300">
                                {note?.clinical_notes}
                              </Text>
                            </View>
                          )}

                          {/* Remark 2 */}
                          {note?.diagnosis && (
                            <View>
                              <Text className="text-md font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                Diagnosis
                              </Text>
                              <Text className="text-sm text-slate-700 dark:text-slate-300">
                                {note?.diagnosis}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {doctorNotesList?.data?.length === 0 && (
            <View className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <Text className="text-slate-500 dark:text-slate-400">
                No notes found for the selected date.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default DoctorNotesPage;
